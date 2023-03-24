/* eslint-disable @typescript-eslint/no-shadow */
import { HttpErrorResponse } from '@angular/common/http';
import { Action, createAction, props } from '@ngrx/store';
import { MembersState } from './members.state';

export enum MembersActionNames {
  getMembers = '[Members] Get members.',
  unsubscribe = '[Members] Unsubscribe from websocket.',
  httpError = '[Members] Http error.',
  update = '[Members] Update member state.',
}

export const getMembers = createAction(MembersActionNames.getMembers, props<{ page: number, gender?: string | null, limit: number, info: string }>())
export const unsubscribeMemebersListiners = createAction(MembersActionNames.unsubscribe, props<{ info: string }>());
export const updateMembersState = createAction(MembersActionNames.update, props<{ newState: MembersState, prevAction?: Action, info?: string }>())
export const membersHttpError = createAction(MembersActionNames.httpError, props<{ httpError: HttpErrorResponse, prevAction: Action }>())
export const membersError = createAction(MembersActionNames.httpError, props<{ httpError: HttpErrorResponse, prevAction: Action }>())
