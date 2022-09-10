import { LIKE_URL } from './../../utils/constans';
import { likeMemberInMembersStateFromMemberPage, updateMembers } from './../members/members.actions';
import { FsUserModel, FsUserModelFieldNames } from './../../models/db-models';
import { MemberModel } from 'src/app/models/member-model';
import { environment } from 'src/environments/environment';
import { exhaustMap, first, map, switchMap, tap, takeUntil, catchError } from 'rxjs/operators';
import {
  getMemberFailed,
  getMemberStart,
  getMemberSuccess,
  likeMemberFromMemberPageFailed,
  likeMemberFromMemberPageSuccess,
  likeMemberFromMemberPageStart,
  updateMemberState,
  unsubscribeMemberState,
  clearMemberState
} from './member.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.ngrx.utils';
import { HttpClient } from '@angular/common/http';
import { of, merge } from 'rxjs';
import { Injectable } from '@angular/core';
import { StateSnapshotService } from '../../services/state-snapshot.service';
import { MemberState } from './member.state';
import { Firestore, doc, docSnapshots, collectionGroup, query, where, documentId, collectionChanges, Query } from '@angular/fire/firestore';
import { membersAdapter, MembersState } from '../members/members.state';

@Injectable()
export class MemberEffects {

  getMember$ = createEffect(() => this._actions$.pipe(
    ofType(getMemberStart),
    exhaustMap(({ id }) => {
      const currentState = this._stateSnapshotService.getMemberState();

      if (currentState.member && currentState.member.userId === id) {
        return of(getMemberSuccess({ newState: currentState }));
      }


      const memberOrUndefined = this._stateSnapshotService.getMembersState().members.entities[id];

      if (memberOrUndefined) {
        const newState: MemberState = {
          member: memberOrUndefined,
        };
        return of(getMemberSuccess({ newState }));
      }

      const docRef = doc(this._firestore, `users/${id}`);
      return docSnapshots<MemberModel>(docRef as any).pipe(
        first(),
        map((snap) => {
          if (!snap.exists()) {
            return getMemberFailed();
          }

          const newState: MemberState = {
            member: snap.data(),
          };

          return getMemberSuccess({ newState });
        })
      );
    })
  ));

  updateMember$ = createEffect(() => this._actions$.pipe(
    ofType(getMemberSuccess),
    switchMap((action) => {
      const userQuery = query(
        collectionGroup(this._firestore, 'users') as Query<FsUserModel>,
        where(FsUserModelFieldNames.userId, '==', action.newState.member!.userId)
      );

      return collectionChanges(userQuery, { events: [ 'modified' ] }).pipe(
        tap((changes) => {
          const data = changes[0].doc.data();
          const currentState = this._stateSnapshotService.getMemberState();
          const newState: MemberState = {
            member: {
              ...data,
              liked: currentState.member!.liked,
            }
          };

          this._store.dispatch(updateMemberState({ newState }));

          const currentMembersState = this._stateSnapshotService.getMembersState();
          const dataInMembersState = currentMembersState.members.entities[data.userId];

          if (!dataInMembersState) { return; }

          const newMembersState: MembersState = {
            ...currentMembersState,
            members: membersAdapter.setOne(newState.member!, currentMembersState.members as any)
          };

          this._store.dispatch(updateMembers({ newState: newMembersState }));
        }),
        takeUntil(merge(
          this._actions$.pipe(ofType(unsubscribeMemberState)),
          this._actions$.pipe(ofType(clearMemberState))
        ))
      );
    }),
  ), { dispatch: false });

  likeMember$ = createEffect(() => this._actions$.pipe(
    ofType(likeMemberFromMemberPageStart),
    exhaustMap(({ id }) => {
      const currentAuthState = this._stateSnapshotService.getAuthState();
      const body = {
        sourceUserId: currentAuthState.userData!.userId,
        targetUserId: id,
      };

      return this._httpClient.post<void>(LIKE_URL, body).pipe(
        tap({
          next: () => {
            const currentState = this._stateSnapshotService.getMemberState();
            const newState: MemberState = {
              member: {
                ...currentState.member!,
                liked: true
              }
            };

            this._store.dispatch(likeMemberFromMemberPageSuccess({ newState }));

            const currentMembersState = this._stateSnapshotService.getMembersState();

            const memberInMembersState = currentMembersState.members.entities[id];

            if (!memberInMembersState) { return; }

            const newMembersState: MembersState = {
              ...currentMembersState,
              members: membersAdapter.setOne(newState.member!, currentMembersState.members as any)
            };

            this._store.dispatch(likeMemberInMembersStateFromMemberPage({ newState: newMembersState }));
          },
          error: (httpError) => this._store.dispatch(likeMemberFromMemberPageFailed({ httpError }))
        })
      );
    })
  ), { dispatch: false });


  constructor(
    private readonly _actions$: Actions,
    private readonly _firestore: Firestore,
    private readonly _store: Store<AppState>,
    private readonly _httpClient: HttpClient,
    private readonly _stateSnapshotService: StateSnapshotService
  ) {}
}
