import { MemberState } from './member.state';
import { Action, createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

export enum MemberActionNames {
  getMember = '[Member] get member.',
  update = '[Member] Update memeber state.',
  httpError = '[Member] Member http error',
  unsubscribe = '[Member] unsubscribe member state.',
  clear = '[Member] clear member state.'
}

export const getMember = createAction(MemberActionNames.getMember, props<{ id: string, info: string }>());
export const updateMemberState = createAction(MemberActionNames.update, props<{ prevAction?: Action, newState: MemberState, info?: string }>())
export const unsubscribeMemberState = createAction(MemberActionNames.unsubscribe);
export const memberHttpError = createAction(MemberActionNames.httpError, props<{ prevAction: Action, info: string }>())


