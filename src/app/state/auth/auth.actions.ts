/* eslint-disable @typescript-eslint/no-shadow */
import { AddressInfoModel } from '../../models/address-info-model';
import { Action, createAction, props, } from '@ngrx/store';
import { NewPasswordModel } from '../../models/new-password-model';
import { PatchUserModel } from '../../models/patch-user-model';
import { RegisterModel } from '../../models/register-model';
import { SignInModel } from '../../models/sign-in-model';
import { AuthState } from './auth.state';
import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from '@angular/fire/app';

export enum AuthActionsNames {
  signin = '[Auth] Sign in.',
  signup = '[Auth] Sign up.',
  logout = '[Auth] logout',
  postAvatar = '[Auth] Post avatar.',
  updateUser = '[Auth] Update user.',
  addAdressInfo = '[Auth] Add address info',
  changePasswordStart = '[Auth] Change password start.',
  changePasswordSuccess = '[Auth] Change password success.',
  changePasswordFailed = '[Auth] Change password failed.',
  removeAvatar = '[Auth] Remove avatar.',
  removeMainImageUrl = '[Image Effects] remove main image url.',
  httpError = '[Auth] http error.',
  update = '[Auth] update auth state.'
}

export const signIn = createAction(AuthActionsNames.signin, props<{ signInModel: SignInModel, info: string, prevAction?: Action }>());
export const signUp = createAction(AuthActionsNames.signup, props<{ registerModel: RegisterModel, info: string }>());
export const logout = createAction(AuthActionsNames.logout, props<{ info: string }>())
export const postAvatar = createAction(AuthActionsNames.postAvatar, props<{ file: File, info: string }>());
export const changePasswordStart = createAction(AuthActionsNames.changePasswordStart, props<{ newPasswordModel: NewPasswordModel }>());
export const changePasswordSuccess = createAction(AuthActionsNames.changePasswordSuccess);
export const changePasswordFailed = createAction(AuthActionsNames.changePasswordFailed, props<{ error: HttpErrorResponse }>());
export const updateUser = createAction(AuthActionsNames.updateUser, props<{ data: PatchUserModel, info: string }>());
export const updateAuthState = createAction(AuthActionsNames.update, props<{ newState: AuthState, prevAction?: Action, info?: string }>());
export const authHttpError = createAction(AuthActionsNames.httpError, props<{ error: HttpErrorResponse | FirebaseError, prevAction: Action }>())
export const addAddressInfo = createAction(AuthActionsNames.addAdressInfo, props<{  data: AddressInfoModel, info: string }>())
export const removeAvatar = createAction(AuthActionsNames.removeAvatar);
export const removeMainImageUrl = createAction(AuthActionsNames.removeMainImageUrl);
