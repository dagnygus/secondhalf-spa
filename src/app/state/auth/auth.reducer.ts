import { Action, createReducer, on } from '@ngrx/store';
// eslint-disable-next-line max-len
import { patchUserSuccess, postAvatarSuccess, setDefaultState, signinSuccess, autoLogout, autoLogin, removeMainImageUrlSuccess, patchAddressInfoSuccess } from './auth.actions';
import { AuthState, initialState } from './auth.state';

const _authReducer = createReducer(
  initialState,
  on(setDefaultState, () => initialState),
  on(
    postAvatarSuccess,
    patchUserSuccess,
    autoLogin,
    signinSuccess,
    patchAddressInfoSuccess,
    (_, { newState }) => newState),
  on(autoLogout, () => initialState),
  on(removeMainImageUrlSuccess, (_, { newState }) => newState)
);

export const authReducer = (state: AuthState | undefined, action: Action) => _authReducer(state, action);
