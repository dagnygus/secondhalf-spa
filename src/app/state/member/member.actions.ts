import { MemberState } from './member.state';
import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

export enum MemberActionNames {
  getMemberStart = '[Member Page] get single member start.',
  getMemberSuccess = '[Member Page] get single member success.',
  getMemberFailed = '[Member Page] get single member failed.',
  update = '[Firebase] udpate member state.',
  likeMemberFromMemberPageStart = '[Member Page] like member from member page start.',
  likeMemberFromMemberPageSuccess = '[Member Page] like member from member page success.',
  likeMemberFromMemberPageFailed = '[Member Page] like member from member page failed.',
  likeMemberInMemberStateFromMembersPage = '[Member Page] like member in member state from members page.',
  clearMemberState = '[Member Page] clear member state.',
  unsubscribeMemberState = '[Member Page] unsubscribe member state.'
}

export const getMemberStart = createAction(MemberActionNames.getMemberStart, props<{ id: string }>());
export const getMemberSuccess = createAction(MemberActionNames.getMemberSuccess, props<{ newState: MemberState }>());
export const getMemberFailed = createAction(MemberActionNames.getMemberFailed);
export const likeMemberFromMemberPageStart = createAction(
  MemberActionNames.likeMemberFromMemberPageStart,
  props<{ id: string }>()
);
export const likeMemberFromMemberPageSuccess = createAction(
  MemberActionNames.likeMemberFromMemberPageSuccess,
  props<{ newState: MemberState }>()
);
export const likeMemberFromMemberPageFailed = createAction(
  MemberActionNames.likeMemberFromMemberPageFailed,
  props<{ httpError: HttpErrorResponse }>()
);
export const clearMemberState = createAction(MemberActionNames.clearMemberState);
export const updateMemberState = createAction(
  MemberActionNames.update,
  props<{ newState: MemberState }>()
);

export const unsubscribeMemberState = createAction(MemberActionNames.unsubscribeMemberState);
export const likeMemberInMemberStateFromMembersPage = createAction(
  MemberActionNames.likeMemberInMemberStateFromMembersPage,
  props<{ newState: MemberState }>()
);
