import { AppState } from 'src/app/app.ngrx.utils';
import { updateImagesState } from './../image/image.actions';
import { AuthModel } from './../../models/auth-model';
import { PatchUserModel } from './../../models/patch-user-model';
import { FsUserModelFieldNames } from './../../models/db-models';
import { createAuthModel, FsUserModel } from '../../models/db-models';
import {
        updateAuthState,
        signIn,
        signUp,
        logout,
        postAvatar,
        authHttpError,
        changePasswordStart,
        changePasswordSuccess,
        changePasswordFailed,
        updateUser,
        addAddressInfo,
        removeAvatar, } from './auth.actions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, filter, map, switchMap, tap, takeUntil, distinctUntilChanged, share, shareReplay, first, repeat, observeOn } from 'rxjs/operators';
import { assertNotNullAuthState, AuthState, AuthStateRef, initialState } from './auth.state';
import { forkJoin, from, of, timer, merge, Subscription, asyncScheduler } from 'rxjs';
import { LocalStorageService } from '../../services/localstorage.service';
import { SignInModel } from 'src/app/models/sign-in-model';
import { Auth, signInWithEmailAndPassword, updatePassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Storage, uploadBytes, ref, getDownloadURL } from '@angular/fire/storage';
import { UrlService } from 'src/app/services/url.service';
import { differenceInMilliseconds } from 'date-fns';
import { Action, Store } from '@ngrx/store';
import { FirebaseError } from '@angular/fire/app';
import { routerNavigatedAction } from '@ngrx/router-store';
import { AsyncActionStatus, isActionTypeOf, isPrevActionTypeOf } from '../utils';

@Injectable()
export class AuthEffects {

  signin$ = createEffect(() => this._actions$.pipe(
    ofType(signIn),
    exhaustMap((signInAction) => from(signInWithEmailAndPassword(
      this._auth,
      signInAction.signInModel.email,
      signInAction.signInModel.password
      )).pipe(
        exhaustMap((userCredentials) => {
          const userDocRef = doc(this._firestore, `users/${userCredentials.user.uid}`);
          return forkJoin([
            from(this._auth.currentUser!.getIdToken()),
            from(this._auth.currentUser!.getIdTokenResult()),
            from(getDoc(userDocRef))
          ]).pipe(
            map(([token, { claims, expirationTime }, userSnap]) => {
              const role = claims['admin'] ? 'admin' : claims['moderator'] ? 'moderator' : 'member';
              const userData = createAuthModel(userSnap.data() as FsUserModel);
              const newState: AuthState = {
                expirationTime,
                token,
                userData,
                role,
              };
              return updateAuthState({ newState, prevAction: signInAction });
            })
          );
        }),
        catchError((error) => of(authHttpError({ error, prevAction: signInAction })))
      )),
  ));

  saveCurrentStateInLocalStorage$ = createEffect(() => this._actions$.pipe(
    ofType(updateAuthState),
    tap(({ newState }) => {
      this._localStorageService.setItem('AUTH_STATE', newState);
    })
  ), { dispatch: false });

  singnup$ = createEffect(() => this._actions$.pipe(
    ofType(signUp),
    exhaustMap(action => this._httpClient.put<void>(this._urlService.authUrl, action.registerModel).pipe(
        map(() => {
          const signInModel: SignInModel = {
            email: action.registerModel.email,
            password: action.registerModel.password
          };
          return signIn({ signInModel, info: 'After sign up', prevAction: action });
        }),
        catchError((error) => of(authHttpError({ error, prevAction: action })))
      ))
  ));

  logout$ = createEffect(() => this._actions$.pipe(
    ofType(logout),
    exhaustMap((action) => from(this._auth.signOut()).pipe(map(() => action))),
    map((action) => {
      return updateAuthState({ newState: initialState, prevAction: action });
    })
  ));

  postAvatar$ = createEffect(() => (this._actions$.pipe(
    ofType(postAvatar),
    exhaustMap((action) => {
      const storageFilePath = `/${this._auth.currentUser!.uid}/images/__${new Date().toJSON()}_${action.file.name}`;
      const storageRef = ref(this._storage, storageFilePath);
      return from(uploadBytes(storageRef, action.file)).pipe(
        exhaustMap((uploadResult) => getDownloadURL(uploadResult.ref)),
        exhaustMap((url) => {

          const userId = this._authStateRef.state.userData!.userId;

          const data: PatchUserModel = {
            userId,
            fieldName: FsUserModelFieldNames.mainPhotoUrl,
            newValue: url
          };

          return this._httpClient.patch<void>(this._urlService.userUrl, data).pipe(
            map(() => {

                const currentAuthState = this._authStateRef.state;

                assertNotNullAuthState(currentAuthState);

                const newState: AuthState = {
                  expirationTime: currentAuthState.expirationTime,
                  token: currentAuthState.token,
                  role: currentAuthState.role,
                  userData: {
                    ...currentAuthState.userData!,
                    mainPhotoUrl: url
                  }
                };

                return updateAuthState({ newState, info: 'Avatar posted.', prevAction: action });
              }
            ),
          );
        })
      );
    })
  )));

  changePassword$ = createEffect(() => this._actions$.pipe(
    ofType(changePasswordStart),
    exhaustMap(({ newPasswordModel }) => from(updatePassword(this._auth.currentUser!, newPasswordModel.newPassword)).pipe(
      map(() => changePasswordSuccess()),
      catchError((error) => of(changePasswordFailed({ error })))
    ))
  ));

  patchUser$ = createEffect(() => this._actions$.pipe(
    ofType(updateUser),
    exhaustMap((action) => this._httpClient.patch<unknown>(this._urlService.userUrl, action.data).pipe(
      map(() => {
          const currentState = this._authStateRef.state;

          assertNotNullAuthState(currentState);

          const newState: AuthState = {
            ...currentState,
            userData: {
              ...currentState.userData!,
              [action.data.fieldName]: action.data.newValue
            }
          };
          return updateAuthState({ newState, prevAction: action });
        },
      ),
      catchError((error) => of(authHttpError({ error, prevAction: action }))))
    )
  ));

  addAddressInfo$ = createEffect(() => this._actions$.pipe(
    ofType(addAddressInfo),
    exhaustMap((action) =>  {

      const userId = this._authStateRef.state.userData!.userId;
      const body = { ...action.data, userId };

      return this._httpClient.patch<unknown>(this._urlService.addressInfoUrl, body).pipe(
        map(() => {
          const currentState = this._authStateRef.state;

          assertNotNullAuthState(currentState);

          const newState: AuthState = {
            ...currentState,
            userData: {
              ...currentState.userData!,
              hasAddressInfo: true,
              city: action.data.city,
              street: action.data.street,
              state: action.data.state,
              country: action.data.country
            }
          };
          return updateAuthState({ newState, prevAction: action });
        }),
        catchError((error) => of(authHttpError({ error, prevAction: action })))
      );
    })
  ));

  autoLogout$ = createEffect(() => this._actions$.pipe(
    ofType(updateAuthState),
    map(() => this._authStateRef.state.expirationTime),
    filter((expirationTime) => expirationTime != null),
    distinctUntilChanged(),
    switchMap((expirationTime) => timer(new Date(expirationTime!)).pipe(
        map(() => logout({ info: 'Autologout' })),
        takeUntil(this._actions$.pipe(ofType(logout)))
      )
    ),
  ));

  autoLogin$ = createEffect(() => of(this._localStorageService.getItem<AuthState>('AUTH_STATE')).pipe(
    filter((state) => {
      if (state == null) { return false; }
      if (state.expirationTime == null) { return false }

      const expDate = new Date(state.expirationTime);
      const currentDate = new Date();
      const miliscDiff = differenceInMilliseconds(expDate, currentDate);

      if (miliscDiff <= 0) {
        this._localStorageService.removeItem('AUTH_STATE');
        return false;
      }

      return true;
    }),
    map((state) => updateAuthState({ newState: state!, info: 'Autologin.' })),
    observeOn(asyncScheduler),
  ));

  removeMainImageUrl$ = createEffect(() => this._actions$.pipe(
    ofType(removeAvatar),
    exhaustMap((action) => {
      const currentAuthState = this._authStateRef.state;
      const body = { targetUserId: currentAuthState.userData!.userId };

      return this._httpClient.patch<void>(this._urlService.removeMainImageUrl, body).pipe(
        map(() => {
          const oldState = this._authStateRef.state;
          assertNotNullAuthState(oldState);
          const newUserData: AuthModel = {
            ...oldState.userData,
            mainPhotoUrl: null
          };
          const newState: AuthState = {
            ...oldState,
            userData: newUserData
          };
          return updateAuthState({ newState, prevAction: action, info: 'Main image removed.'  });
        }),
        catchError((error) => of(authHttpError({ error, prevAction: action })))
      );
    })
  ));

  updateLocalStorage$ = createEffect(() => this._actions$.pipe(
    ofType(updateAuthState),
    filter((action) => isPrevActionTypeOf(action, signIn, logout, updateUser, removeAvatar)),
    map(() => this._authStateRef.state),
    distinctUntilChanged(),
    tap((state) => {
      this._localStorageService.setItem('AUTH_STATE', state)
    })
  ), { dispatch: false })

  mainImageDeleted = createEffect(() => this._actions$.pipe(
    ofType(updateImagesState),
    filter((action) => action.mainImageDeleted === true),
    map((action) => {

      assertNotNullAuthState(this._authStateRef.state);

      const { expirationTime, token, userData, role } = this._authStateRef.state
      const newUserData: AuthModel = {
        ...userData!,
        mainPhotoUrl: null
      }

      const newAuthState: AuthState = {
        expirationTime,
        token,
        role,
        userData: newUserData
      }

      return updateAuthState({ newState: newAuthState, prevAction: action })
    })
  ));

  constructor(
    private readonly _actions$: Actions,
    private readonly _httpClient: HttpClient,
    private readonly _localStorageService: LocalStorageService,
    private readonly _auth: Auth,
    private readonly _firestore: Firestore,
    private readonly _storage: Storage,
    private readonly _urlService: UrlService,
    private readonly _authStateRef: AuthStateRef,
  ) { }

}

@Injectable({ providedIn: 'root' })
export class AuthStateEvents implements OnDestroy {

  private _subscription: Subscription;
  private _errorResponse: HttpErrorResponse | FirebaseError | null = null;

  postingAvatar$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, postAvatar) || isPrevActionTypeOf(action, postAvatar)),
    map(this._getAsyncActionStatus),
    share()
  )

  updateAvatar$ = this._actions$.pipe(
    filter((action) => {
      if (isActionTypeOf(action, updateUser) && action.data.fieldName === FsUserModelFieldNames.mainPhotoUrl) {
        return true;
      }
      if(isPrevActionTypeOf(action, updateUser)
      && action.prevAction.data.fieldName === FsUserModelFieldNames.mainPhotoUrl) {
        return true
      }
      return false
    }),
    map(this._getAsyncActionStatus),
    share()
  );

  updatingUser$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, updateUser) || isPrevActionTypeOf(action, updateUser)),
    map(this._getAsyncActionStatus),
    share()
  );

  signingIn$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, signIn) || isPrevActionTypeOf(action, signIn)),
    map(this._getAsyncActionStatus),
    share()
  )

  signingUp$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, signUp) || isPrevActionTypeOf(action, signUp)),
    map((action) => {

      switch (action.type) {
        case signIn.type:
          return AsyncActionStatus.resolved;
        case authHttpError.type:
          return AsyncActionStatus.rejected;
        default:
          return AsyncActionStatus.awaiting;
      }
    }),
    share()
  );

  addingAddressInfo$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, addAddressInfo) || isPrevActionTypeOf(action, addAddressInfo)),
    map(this._getAsyncActionStatus),
    share()
  );

  changingPassword$ = this._actions$.pipe(
    ofType(changePasswordStart, changePasswordSuccess, changePasswordFailed),
    map((action) => {
      switch (action.type) {
        case changePasswordSuccess.type:
          return AsyncActionStatus.resolved;
        case changePasswordFailed.type:
          return AsyncActionStatus.rejected;
        default:
          return AsyncActionStatus.awaiting;
      }
    })
  );

  constructor(private _actions$: Actions) {
    this._subscription = this._actions$.pipe(
      ofType(authHttpError)
    ).subscribe(({ error }) => {
      this._errorResponse = error;
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  getError(): HttpErrorResponse | FirebaseError | null {
    return this._errorResponse;
  }

  private _getAsyncActionStatus(action: Action): AsyncActionStatus {
    switch (action.type) {
      case updateAuthState.type:
        return AsyncActionStatus.resolved;
      case authHttpError.type:
        return AsyncActionStatus.rejected;
      default:
        return AsyncActionStatus.awaiting;
    }
  }
}
