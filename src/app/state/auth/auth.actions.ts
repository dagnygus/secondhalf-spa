/* eslint-disable @typescript-eslint/no-shadow */
import { AddressInfoModel } from '../../models/address-info-model';
import { createAction, props } from '@ngrx/store';
import { NewPasswordModel } from '../../models/new-password-model';
import { PatchUserModel } from '../../models/patch-user-model';
import { RegisterModel } from '../../models/register-model';
import { SignInModel } from '../../models/sign-in-model';
import { AuthState } from './auth.state';
import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from '@angular/fire/app';

export enum AuthActionsNames {
  signinStart = '[Auth Page / Singin Page] Singin start.',
  signinSuccess = '[Auth Page] Singin success.',
  signinFailed = '[Auth Page] Singin failed.',
  signupStart = '[Auth Page / Signup Page] Signup start.',
  signupFailed = '[Auth Page / Signup Page] Signup failed.',
  authStateSaveFailed = '[Local Storage Service / throw Error] state allready present.',
  logoutFromUser = '[On User Demand] Logout.',
  autoLogout = '[Local Storage Service] Auto logout.',
  autoLogin = '[Local Storage] Auto login.',
  setDefaultState = '[Web app] Reseting state.',
  postAvatarStart = '[Auth User Details Page] Post avatar start.',
  postAvatarSuccess = '[Auth User Details Page] Post avatar success.',
  postAvatarFailed = '[Auth User Details Page] Post avatar failed.',
  patchUserStart = '[Auth User Details Page] Patch avatar start.',
  patchUserSuccess = '[Auth User Details Page] Patch avatar success.',
  patchUserFailed = '[Auth User Details Page] Patch avatar failed.',
  patchAddressInfoStart = '[Auth User Details Page] Patch address info start.',
  patchAddressInfoSuccess = '[Auth User Details Page] Patch address info success.',
  patchAddressInfoFailed = '[Auth User Details Page] Patch address info failed.',
  changePasswordStart = '[Auth User Details Page] Change password start.',
  changePasswordSuccess = '[Auth User Details Page] Change password success.',
  changePasswordFailed = '[Auth User Details Page] Change password failed.',
  removeMainImageUrl = '[Image Effects] remove main image url.',
  removeMainImageUrlStart = '[Image Effects] remove main image url start.',
  removeMainImageUrlSuccess = '[Image Effects] remove main image url success.',
  removeMainImageUrlFailed = '[Image Effects] remove main image url failed.',
}

export const signinStart = createAction(
  AuthActionsNames.signinStart,
  props<{ signInModel: Immutable<SignInModel> }>()
);

export const signinSuccess = createAction(
  AuthActionsNames.signinSuccess,
  props<{ newState: AuthState; expirationTime: string }>()
);

export const signinFailed = createAction(
  AuthActionsNames.signinFailed,
  props<{ error: FirebaseError }>()
);

export const signupStart = createAction(
  AuthActionsNames.signupStart, props<{ registerModel: Immutable<RegisterModel> }>()
);

export const signupFailed = createAction(
  AuthActionsNames.signinFailed,
  props<{ error: FirebaseError }>()
);

export const authStateSaveFailed = createAction(
  AuthActionsNames.authStateSaveFailed
);

export const logoutFromUser = createAction(
  AuthActionsNames.logoutFromUser
);

export const autoLogout = createAction(
  AuthActionsNames.autoLogout
);

export const autoLogin = createAction(
  AuthActionsNames.autoLogin, props<{ newState: AuthState }>()
);

export const setDefaultState = createAction(
  AuthActionsNames.setDefaultState
);

export const postAvatarStart = createAction(
  AuthActionsNames.postAvatarStart, props<{ file: File }>()
);

export const postAvatarSuccess = createAction(
  AuthActionsNames.postAvatarSuccess, props<{ newState: AuthState }>()
);

export const postAvatarFailed = createAction(
  AuthActionsNames.postAvatarFailed,
  props<{ httpError: HttpErrorResponse }>()
);

export const changePasswordStart = createAction(
  AuthActionsNames.changePasswordStart,
  props<{ newPasswordModel: Immutable<NewPasswordModel> }>()
);

export const changePasswordSuccess = createAction(
  AuthActionsNames.changePasswordSuccess
);

export const changePasswordFailed = createAction(
  AuthActionsNames.changePasswordFailed,
  props<{ error: HttpErrorResponse }>()
);

export const patchUserStart = createAction(
  AuthActionsNames.patchUserStart,
  props<{ data: PatchUserModel }>()
);

export const patchUserSuccess = createAction(
  AuthActionsNames.patchUserSuccess,
  props<{ newState: AuthState }>()
);

export const patchUserFailed = createAction(
  AuthActionsNames.patchUserFailed, props<{ error: HttpErrorResponse }>()
);

export const patchAddressInfoStart = createAction(
  AuthActionsNames.patchAddressInfoStart,
  props<{ data: Immutable<AddressInfoModel> }>()
);

export const patchAddressInfoSuccess = createAction(
  AuthActionsNames.patchAddressInfoSuccess,
  props<{ newState: AuthState }>()
);

export const patchAddressInfoFailed = createAction(
  AuthActionsNames.patchAddressInfoFailed,
  props<{ error: HttpErrorResponse }>()
);

export const removeMainImageUrl = createAction(AuthActionsNames.removeMainImageUrl);

export const removeMainImageUrlStart = createAction(AuthActionsNames.removeMainImageUrlStart);

export const removeMainImageUrlSuccess = createAction(
  AuthActionsNames.removeMainImageUrlSuccess,
  props<{ newState: AuthState }>()
);

export const removeMainImageUrlFalied = createAction(AuthActionsNames.removeMainImageUrlFailed);
