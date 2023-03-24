import { initialState } from './member.state';
import { createReducer, on } from '@ngrx/store';
import { updateMemberState } from './member.actions';

export const memberReducer = createReducer(
  initialState,
  on(updateMemberState, (_, { newState }) => newState),
);
