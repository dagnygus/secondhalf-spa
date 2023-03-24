import { initialState, MembersState, membersAdapter } from './members.state';
import { Action, createReducer, on } from '@ngrx/store';
import { updateMembersState } from './members.actions';

const _membersReducer = createReducer(
  initialState,
  on(updateMembersState, (_, { newState }) => newState),
);

export const membersReducer = (state: MembersState | undefined, action: Action) => _membersReducer(state, action);
