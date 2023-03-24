import { updateAuthState } from './../auth/auth.actions';
import { likeSuccess } from './../like/like.actions';
import { UrlService } from 'src/app/services/url.service';
import { PAGINATION_TOTAL_PAGES } from './../../utils/constans';
import { FsUserModel, FsUserModelFieldNames } from './../../models/db-models';
import { MemberModel } from './../../models/member-model';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, merge, Subscription, ReplaySubject, first } from 'rxjs';
import { map, exhaustMap, catchError, switchMap, takeUntil, filter, startWith, distinctUntilChanged, share, shareReplay, tap, repeat, take } from 'rxjs/operators';
import { unsubscribeMemebersListiners,
         getMembers,
         updateMembersState,
         membersError} from './members.actions';
import { collectionChanges, Firestore, collectionGroup, query, Query, where } from '@angular/fire/firestore';
import { Injectable, OnDestroy } from '@angular/core';
import { MembersState, membersAdapter, MembersStateRef } from './members.state';
import { signIn } from '../auth/auth.actions';
import { isPrevActionTypeOf, StateStatus } from '../utils';

@Injectable()
export class MembersEffects {

  getMembers$ = createEffect(() => this._actions$.pipe(
    ofType(getMembers),
    exhaustMap((action) => {

      const currentMembersState = this._membersStateRef.state;

      if (currentMembersState.page === action.page &&
          currentMembersState.limit === action.limit &&
          currentMembersState.gender === action.gender &&
          action.info !== 'Refeching') {
        return of(updateMembersState({ newState: currentMembersState, prevAction: action, info: 'Already present' }));
      }

      const offset: number = (action.page - 1) * action.limit;
      let requestUrl: string = `${this._urlService.userUrl}?offset=${offset}&limit=${action.limit}`;

      if (action.gender != null) {
        requestUrl += `&gender=${action.gender}`;
      }

      return this._httpClient.get<MemberModel[]>(requestUrl, { observe: 'response' }).pipe(
        map((response) => {
          const totalPages = +response.headers.get(PAGINATION_TOTAL_PAGES)!;
          const users = response.body!;

          const newState = {
            totalPages,
            limit: action.limit,
            page: action.page,
            gender: action.gender,
            members: membersAdapter.setAll(users, currentMembersState.members)
          };

          return updateMembersState({ newState, prevAction: action });
        }),
        catchError(httpError => of(membersError({ httpError, prevAction: action })))
      );
    })
  ));

  likeMember$ = createEffect(() => this._actions$.pipe(
    ofType(likeSuccess),
    map((action) => {
      const oldState = this._membersStateRef.state;
      const newMembers = membersAdapter.updateOne({ id: action.id, changes: { liked: true } }, oldState.members);
      const newState = { ...oldState, members: newMembers };
      return updateMembersState({ newState });
    })
  ));

  listenToMembersChanges$ = createEffect(() => this._actions$.pipe(
    ofType(updateMembersState),
    filter((action) => isPrevActionTypeOf(action, getMembers)),
    switchMap((action) => {
      const ids = action.newState.members.ids;
      const colGrp = collectionGroup(this._firestore, 'users') as Query<FsUserModel>;
      const queries: Query<FsUserModel>[] = [];

      for (let i = 0; i < ids.length; i += 10) {
        if (i + 9 < ids.length) {
          queries.push(query(colGrp, where(FsUserModelFieldNames.userId, 'in', ids.slice(i, i + 9))));
        } else {
          queries.push(query(colGrp, where(FsUserModelFieldNames.userId, 'in', ids.slice(i))));
        }
      }

      const collectionChangesArr = queries.map(q => collectionChanges(q, { events: [ 'modified' ] }));

      return merge(...collectionChangesArr).pipe(
        map((changes) => {
          const updatates = changes.map((change) => {
            const fsUpadatedUser = change.doc.data();
            return { id: change.doc.id, changes: fsUpadatedUser };
          });
          const oldState = this._membersStateRef.state;
          const members = membersAdapter.updateMany(updatates, oldState.members)
          const newState: MembersState = { ...oldState, members };

          return updateMembersState({ newState, info: 'Update from websocet' });
        }),
        takeUntil(this._actions$.pipe(ofType(unsubscribeMemebersListiners, getMembers))
        ),
      );
    }),
  ));

  refetchMembersOnLogin$ = createEffect(() => this._actions$.pipe(
    ofType(updateAuthState),
    filter((action) => isPrevActionTypeOf(action, signIn)),
    filter(() => this._membersStateRef.state.members.ids.length > 0),
    map(() => {
      const { page, limit, gender } = this._membersStateRef.state;
      return getMembers({ page, limit, gender, info: 'Refeching' });
    })
  ));

  constructor(private readonly _actions$: Actions,
              private readonly _httpClient: HttpClient,
              private readonly _membersStateRef: MembersStateRef,
              private readonly _firestore: Firestore,
              private readonly _urlService: UrlService) {}
}

@Injectable({ providedIn: 'root' })
export class MembersEvents implements OnDestroy {
  private _subscription: Subscription

  status$ = new ReplaySubject<StateStatus>(1);

  constructor(private _actions$: Actions,
              private _membersStateRef: MembersStateRef) {
    this._subscription = merge(
      this._actions$.pipe(
        ofType(updateMembersState),
        map(() => this._membersStateRef.state),
        startWith(this._membersStateRef.state),
        map((state) => state.totalPages > 0 ? StateStatus.complete : StateStatus.empty)
      ),
      this._actions$.pipe(ofType(getMembers), map(() => StateStatus.pending)),
      this._actions$.pipe(ofType(membersError), filter((action) => isPrevActionTypeOf(action, getMembers)), map(() => StateStatus.error)),
    ).subscribe(this.status$);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
