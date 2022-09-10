import { PAGINATION_TOTAL_PAGES, USER_URL, LIKE_URL } from './../../utils/constans';
import { likeMemberInMemberStateFromMembersPage } from './../member/member.actions';
import { AppState } from 'src/app/app.ngrx.utils';
import { FsUserModel, FsUserModelFieldNames } from './../../models/db-models';
import { MemberModel } from './../../models/member-model';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, merge, Observable } from 'rxjs';
import { map, exhaustMap, catchError, switchMap, takeUntil, tap, delay } from 'rxjs/operators';
import { getMembersFailed,
         getMembersStart,
         getMembersSuccess,
         likeMemberFromMembersPageStart,
         liekMemberFromMembersPageFailed,
         likeMemberFromMembersPageSuccess,
         unsubscribeMemebersListiners,
         clearMembersState,
         updateMembers} from './members.actions';
import { collectionChanges, Firestore, collectionGroup, query, Query, where } from '@angular/fire/firestore';
import { StateSnapshotService } from '../../services/state-snapshot.service';
import { Injectable } from '@angular/core';
import { membersAdapter, MembersState } from './members.state';
import { Store } from '@ngrx/store';
import { MemberState } from '../member/member.state';
import { updateMemberState } from '../member/member.actions';

@Injectable()
export class MembersEffects {

  getMembers$ = createEffect(() => this._actions$.pipe(
    ofType(getMembersStart),
    exhaustMap(({ page, limit, gender }) => {

      const currentMembersState = this._stateSnapshotService.getMembersState();

      if (currentMembersState.page === page &&
          currentMembersState.limit === limit) {
        console.log('allready');
        return of(getMembersSuccess({ newState: currentMembersState }));
      }

      const offset = (page - 1) * limit;
      let requestUrl = `${USER_URL}?offset=${offset}&limit=${limit}`;

      if (gender != null) {
        requestUrl += `?gender=${gender}`;
      }

      return this._httpClient.get<MemberModel[]>(requestUrl, { observe: 'response' }).pipe(
        map((response) => {
          const totalPages = +response.headers.get(PAGINATION_TOTAL_PAGES)!;
          const users = response.body!;

          const newState = {
            totalPages,
            limit,
            page,
            gender,
            members: membersAdapter.setAll(users, currentMembersState.members as any)
          };

          return getMembersSuccess({ newState });
        }),
        catchError(httpError => of(getMembersFailed({ httpError })))
      );
    })
  ));

  likeMember$ = createEffect(() => this._actions$.pipe(
    ofType(likeMemberFromMembersPageStart),
    exhaustMap((action) => {

      const currentAuthState = this._stateSnapshotService.getAuthState();
      const currentMembersState = this._stateSnapshotService.getMembersState();
      const memberToUpdate = currentMembersState.members.entities[currentMembersState.members.ids[action.index]]!;

      const body = {
        sourceUserId: currentAuthState.userData!.userId,
        targetUserId: memberToUpdate.userId,
      };

      return this._httpClient.post<unknown>(LIKE_URL, body).pipe(
        tap({
          next: () => {

            const updatedMember: MemberModel = {
              ...memberToUpdate,
              liked: true
            };

            const newState: MembersState = {
              ...currentMembersState,
              members: membersAdapter.setOne(updatedMember, currentMembersState.members as any)
            };

            this._store.dispatch(likeMemberFromMembersPageSuccess({ newState}));

            const currentMemberState = this._stateSnapshotService.getMemberState();

            if (!currentMemberState.member ||
              currentMemberState.member.userId === memberToUpdate.userId) { return; }

            const newMemberState: MemberState = {
              member: {
                ...currentMemberState.member,
                liked: true,
              }
            };

            this._store.dispatch(likeMemberInMemberStateFromMembersPage({ newState: newMemberState }));
          },
          error: (httpError) => {
            this._store.dispatch(liekMemberFromMembersPageFailed({ httpError }));
          }
        })
      );
    })
  ), { dispatch: false });

  listenToMembersChanges$ = createEffect(() => this._actions$.pipe(
    ofType(getMembersSuccess),
    delay(3000),
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
        tap((changes) => {
          let currentSelectedMemberDataToUpate: FsUserModel | undefined;
          const currentMember = this._stateSnapshotService.getMemberState().member;

          const updatates = changes.map((change) => {

            const fsUpadatedUser = change.doc.data();

            if (currentMember && currentMember.userId === fsUpadatedUser.userId) {
              currentSelectedMemberDataToUpate = fsUpadatedUser;
            }

            return { id: change.doc.id, changes: fsUpadatedUser };
          });
          const currentState = this._stateSnapshotService.getMembersState();
          const members = membersAdapter.updateMany(updatates, currentState.members as any);
          const newState: MembersState = { ...currentState, members };

          this._store.dispatch(updateMembers({ newState }));

          if (!currentSelectedMemberDataToUpate) { return; }

          const newMemberState: MemberState = {
            member: {
              liked: currentMember!.liked,
              ...currentSelectedMemberDataToUpate
            }
          };

          this._store.dispatch(updateMemberState({ newState: newMemberState }));
        }),
        takeUntil(merge(
          this._actions$.pipe(ofType(unsubscribeMemebersListiners)),
          this._actions$.pipe(ofType(clearMembersState)),
        )),
      );
    })
  ), { dispatch: false });

  constructor(private readonly _actions$: Actions,
              private readonly _httpClient: HttpClient,
              private readonly _stateSnapshotService: StateSnapshotService,
              private readonly _firestore: Firestore,
              private readonly _store: Store<AppState>) {}
}


