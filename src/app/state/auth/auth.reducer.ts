import { Action, createReducer, on } from '@ngrx/store';
// eslint-disable-next-line max-len
import { updateAuthState } from './auth.actions';
import { AuthState, initialState } from './auth.state';

const _authReducer = createReducer(
  initialState,
  on(updateAuthState, (_, { newState }) => newState),
);

export const authReducer = (state: AuthState | undefined, action: Action) => _authReducer(state, action);
