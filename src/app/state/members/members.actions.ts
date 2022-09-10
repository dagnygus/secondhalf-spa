/* eslint-disable @typescript-eslint/no-shadow */
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { MembersState } from './members.state';

export enum MembersActionNames {
  getMembersStart = '[Members Page] Get members start',
  getMembersSuccess = '[Members Page] Get members success',
  getMembersFailed = '[Members Page] Get members failed',
  likeMemberStart = '[Members Page] Like member start',
  likeMemberSuccess = '[Members Page] Like member success',
  likeMemberFailed = '[Members Page] Like member failed',
  likeMemberInMembersStateFromMemberPage = '[Member Page] Like member in members state from member page',
  update = '[Firebase] updatet single member in members state',
  clearMembersState = '[Members Page] clear members state',
  unsubscribeMemebersListiners = '[Members Page] unsubscribe members listiners',
  resetCurrentMemebersState = '[Auth Effects] reset current members page',
}

export const getMembersStart = createAction(MembersActionNames.getMembersStart,
  props<{ page: number; gender?: string | null; limit: number }>()
);
export const getMembersSuccess = createAction(
  MembersActionNames.getMembersSuccess,
  props<{ newState: MembersState }>()
);
export const getMembersFailed = createAction(
  MembersActionNames.getMembersFailed,
  props<{ httpError: HttpErrorResponse }>()
);
export const likeMemberFromMembersPageStart = createAction(
  MembersActionNames.likeMemberStart, props<{ index: number }>()
);
export const likeMemberFromMembersPageSuccess = createAction(
  MembersActionNames.likeMemberSuccess, props<{ newState: MembersState }>()
);
export const liekMemberFromMembersPageFailed = createAction(
  MembersActionNames.likeMemberFailed, props<{ httpError: HttpErrorResponse }>()
);
export const clearMembersState = createAction(
  MembersActionNames.clearMembersState
);
export const unsubscribeMemebersListiners = createAction(MembersActionNames.unsubscribeMemebersListiners);
export const updateMembers = createAction(
  MembersActionNames.update,
  props<{ newState: MembersState }>()
);

export const likeMemberInMembersStateFromMemberPage = createAction(
  MembersActionNames.likeMemberInMembersStateFromMemberPage,
  props<{ newState: MembersState }>()
);

export const resetCurrentMembersState = createAction(
  MembersActionNames.resetCurrentMemebersState
);
