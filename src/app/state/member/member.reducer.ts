import { initialState } from './member.state';
import { createReducer, on } from '@ngrx/store';
import { getMemberSuccess,
  likeMemberFromMemberPageSuccess,
  clearMemberState,
  updateMemberState,
  getMemberStart,
  getMemberFailed} from './member.actions';

export const memberReducer = createReducer(
  initialState,
  on(getMemberSuccess,
     likeMemberFromMemberPageSuccess,
     updateMemberState, (_, { newState }) => newState),
  on(clearMemberState, () => initialState)
);
