import { MembersStateRef } from './../members/members.state';
import { assertNotNull } from 'src/app/utils/others';
import { FsUserModel, FsUserModelFieldNames } from 'src/app/models/db-models';
import { MemberModel } from 'src/app/models/member-model';
import { exhaustMap, first, map, switchMap, takeUntil, filter, shareReplay, tap, repeat, take } from 'rxjs/operators';
import {
  updateMemberState,
  getMember,
  unsubscribeMemberState,
  memberHttpError
} from './member.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, merge, ReplaySubject, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { MemberState, MemberStateRef } from './member.state';
import { Firestore, doc, docSnapshots, collectionGroup, query, where, collectionChanges, Query } from '@angular/fire/firestore';
import { StateStatus, isActionTypeOf, isPrevActionTypeOf } from '../utils';
import { likeSuccess } from '../like/like.actions';

@Injectable()
export class MemberEffects {

  getMember$ = createEffect(() => this._actions$.pipe(
    ofType(getMember),
    exhaustMap((action) => {
      const currentState = this._memberStateRef.state;

      if (currentState.member?.userId === action.id) {
        return of(updateMemberState({ newState: currentState, prevAction: action, info: 'Already present.' }));
      }

      const memberOrUndefined = this._membersStateRef.state.members.entities[action.id];

      if (memberOrUndefined) {
        const newState: MemberState = {
          member: memberOrUndefined,
        };
        return of(updateMemberState({ newState, prevAction: action, info: 'From members' }));
      }

      const docRef = doc(this._firestore, `users/${action.id}`);
      return docSnapshots<MemberModel>(docRef as any).pipe(
        take(1),
        map((snap) => {
          if (!snap.exists()) {
            return memberHttpError({ prevAction: action, info: 'Member not exist' });
          }

          const newState: MemberState = {
            member: snap.data(),
          };

          return updateMemberState({ newState, prevAction: action });
        })
      );
    })
  ));

 listenToChanges$ = createEffect(() => this._actions$.pipe(
    ofType(updateMemberState),
    filter(() => this._memberStateRef.state.member != null),
    switchMap(() => {

      const memberData = this._memberStateRef.state.member;

      assertNotNull(memberData);

      const userQuery = query(
        collectionGroup(this._firestore, 'users') as Query<FsUserModel>,
        where(FsUserModelFieldNames.userId, '==', memberData.userId)
      );

      return collectionChanges(userQuery, { events: [ 'modified' ] }).pipe(
        map((changes) => {
          const data = changes[0].doc.data();
          const newState: MemberState = {
            member: {
              ...data,
              liked: memberData.liked,
            }
          };

          return updateMemberState({ newState, info: 'Update from websocet' });
        }),
        takeUntil(this._actions$.pipe(ofType(unsubscribeMemberState, getMember)))
      );
    })
  ));

  likeMember$ = createEffect(() => this._actions$.pipe(
    ofType(likeSuccess),
    filter((action) => this._memberStateRef.state.member !== null && this._memberStateRef.state.member.userId === action.id),
    map((action) => {
      const oldState = this._memberStateRef.state.member!;
      const updatedMember: MemberModel = {
        ...oldState,
        liked: true
      }

      const newState: MemberState = { member: updatedMember }

      return updateMemberState({ newState,  prevAction: action })
    })
  ))

  constructor(
    private readonly _actions$: Actions,
    private readonly _firestore: Firestore,
    private readonly _memberStateRef: MemberStateRef,
    private readonly _membersStateRef: MembersStateRef
  ) {}
}

@Injectable({ providedIn: 'root' })
export class MemberEvents implements OnDestroy {
  private _subscription: Subscription

  status$ = new ReplaySubject<StateStatus>(1)


  constructor(private _actions$: Actions) {
    this._subscription = this._actions$.pipe(
      filter((action) => isActionTypeOf(action, getMember) || isPrevActionTypeOf(action, getMember)),
      map((action) => {
        switch (action.type) {
          case updateMemberState.type:
            return StateStatus.complete;
          case memberHttpError.type:
            return StateStatus.error;
          default:
            return StateStatus.pending;
        }
      })
    ).subscribe(this.status$);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
