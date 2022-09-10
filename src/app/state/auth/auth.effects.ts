import { changeImagesOrder } from './../image/image.actions';
import { AuthModel } from './../../models/auth-model';
import { PatchUserModel } from './../../models/patch-user-model';
import { clearMembersState, resetCurrentMembersState } from './../members/members.actions';
import { ADDRESS_INFO_URL, AUTH_URL, REMOVE_MAIN_IMG_URL, USER_URL } from './../../utils/constans';
import { FsUserModelFieldNames } from './../../models/db-models';
import { createAuthModel, FsUserModel } from '../../models/db-models';
import { changePasswordFailed,
         changePasswordStart,
         changePasswordSuccess,
         logoutFromUser,
         patchUserFailed,
         patchUserStart,
         patchUserSuccess,
         postAvatarStart,
         postAvatarSuccess,
         patchAddressInfoStart,
         patchAddressInfoFailed,
         patchAddressInfoSuccess,
        setDefaultState,
        signinFailed,
        signinStart,
        signinSuccess,
        signupFailed,
        signupStart,
        autoLogout,
        autoLogin,
        removeMainImageUrlStart,
        removeMainImageUrlSuccess,
        removeMainImageUrlFalied} from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, exhaustMap, filter, map, observeOn, switchMap, tap } from 'rxjs/operators';
import { AuthState } from './auth.state';
import { asapScheduler, forkJoin, from, of } from 'rxjs';
import { LocalStorageService } from '../../services/localstorage.service';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
import { SignInModel } from 'src/app/models/sign-in-model';
import { Auth, signInWithEmailAndPassword, updatePassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Storage, uploadBytes, ref, getDownloadURL } from '@angular/fire/storage';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { addNewMainImage } from '../image/image.actions';

@Injectable()
export class AuthEffects {

  signin$ = createEffect(() => this._actions$.pipe(
    ofType(signinStart),
    exhaustMap(({ signInModel }) => from(signInWithEmailAndPassword(this._auth, signInModel.email, signInModel.password)).pipe(
        exhaustMap((userCredentials) => {
          const userDocRef = doc(this._firestore, `users/${userCredentials.user.uid}`);
          return forkJoin([
            from(this._auth.currentUser!.getIdToken()),
            from(this._auth.currentUser!.getIdTokenResult()),
            from(getDoc(userDocRef))
          ]).pipe(
            map(([token, { claims, expirationTime }, userSnap]) => {

              const role = claims.admin ? 'admin' : claims.moderator ? 'moderator' : 'member';
              const userData = createAuthModel(userSnap.data() as FsUserModel);
              const newState: AuthState = {
                token,
                userData,
                role,
              };
              this._store.dispatch(clearMembersState());
              return signinSuccess({ newState, expirationTime });
            })
          );
        })
      )),
    catchError((error) => of(signinFailed({ error })))
  ));

  saveCurrentStateInLocalStorage = createEffect(() => this._actions$.pipe(
    ofType(signinSuccess),
    tap(({ newState , expirationTime }) => {
      this._localStorageService.saveAuthState(newState, expirationTime);
    })
  ), { dispatch: false });

  singnup$ = createEffect(() => this._actions$.pipe(
    ofType(signupStart),
    exhaustMap(action => this._httpClient.put<void>(AUTH_URL, action.registerModel).pipe(
        map(() => {
          const signInModel: SignInModel = {
            email: action.registerModel.email,
            password: action.registerModel.password
          };
          return signinStart({ signInModel });
        }),
        catchError((error) => of(signupFailed({ error })).pipe(tap(console.log)))
      ))
  ));

  logoutFromUser$ = createEffect(() => this._actions$.pipe(
    ofType(logoutFromUser),
    exhaustMap(() => from(this._auth.signOut())),
    map(() => {
      this._localStorageService.removeAuthState();
      this._localStorageService.cancelTokenExpiryTimer();
      // this._store.dispatch(clearMembersState());
      this._store.dispatch(resetCurrentMembersState());
      return setDefaultState();
    })
  ));

  postAvatar$ = createEffect(() => (this._actions$.pipe(
    ofType(postAvatarStart),
    exhaustMap(({ file }) => {
      const storageFilePath = `/${this._auth.currentUser!.uid}/images/__${new Date().toJSON()}_${file.name}`;
      const storageRef = ref(this._storage, storageFilePath);
      return from(uploadBytes(storageRef, file)).pipe(
        exhaustMap((uploadResult) => getDownloadURL(uploadResult.ref)),
        exhaustMap((url) => {

          const userId = this._stateSnapshotService.getAuthState().userData!.userId;

          const data: PatchUserModel = {
            userId,
            fieldName: FsUserModelFieldNames.mainPhotoUrl,
            newValue: url
          };

          return this._httpClient.patch<void>(USER_URL, data).pipe(
            tap({
              next: () => {

                const currentAuthState = this._stateSnapshotService.getAuthState();

                const newState: AuthState = {
                  token: currentAuthState.token,
                  role: currentAuthState.role,
                  userData: {
                    ...currentAuthState.userData!,
                    mainPhotoUrl: url
                  }
                };

                this._store.dispatch(postAvatarSuccess({ newState }));
                this._localStorageService.updateAuthState(newState);

                const currentImageState = this._stateSnapshotService.getImageState();
                if (currentAuthState.userData!.userId === currentImageState.userId) {
                  this._store.dispatch(addNewMainImage({ url }));
                }
              }
            }),
          );
        })
      );
    })
  )), { dispatch: false });

  changePassword$ = createEffect(() => this._actions$.pipe(
    ofType(changePasswordStart),
    exhaustMap(({ newPasswordModel }) => from(updatePassword(this._auth.currentUser!, newPasswordModel.newPassword)).pipe(
      map(() => changePasswordSuccess()),
      catchError((error) => of(changePasswordFailed({ error })))
    ))
  ));

  patchUser$ = createEffect(() => this._actions$.pipe(
    ofType(patchUserStart),
    exhaustMap((action) => this._httpClient.patch<unknown>(USER_URL, action.data).pipe(
      tap({
        next: () => {
          const currentState = this._stateSnapshotService.getAuthState();

          const newState: AuthState = {
            ...currentState,
            userData: {
              ...currentState.userData!,
              [action.data.fieldName]: action.data.newValue
            }
          };

          this._localStorageService.updateAuthState(newState);
          this._store.dispatch(patchUserSuccess({ newState }));

          if (action.data.fieldName === 'mainPhotoUrl') {
            const { userId } = this._stateSnapshotService.getImageState();
            if (currentState.userData!.userId !== userId) { return; }
            this._store.dispatch(changeImagesOrder({ url: action.data.newValue }));
          }
        },
        error: (error) => this._store.dispatch(patchUserFailed({ error }))
      }))
    )
  ), { dispatch: false });

  patchAddressInfo$ = createEffect(() => this._actions$.pipe(
    ofType(patchAddressInfoStart),
    exhaustMap((action) =>  {

      const userId = this._stateSnapshotService.getAuthState().userData!.userId;
      const body = { ...action.data, userId };

      return this._httpClient.patch<unknown>(ADDRESS_INFO_URL, body).pipe(
        map(() => {
          const currentState = this._stateSnapshotService.getAuthState();

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

          this._localStorageService.updateAuthState(newState);
          return patchAddressInfoSuccess({ newState });
        }),
        catchError((error) => of(patchAddressInfoFailed({ error })))
      );
    })
  ));

  autoLogout$ = createEffect(() => this._localStorageService.tokenExpired$.pipe(
    map(() => {
      this._store.dispatch(resetCurrentMembersState());
      return autoLogout();
    })
  ));

  autoLogin$ = createEffect(() => of(this._localStorageService.getAuthState()).pipe(
    filter((authStateFromLocalStorage) => authStateFromLocalStorage !== null),
    switchMap((authStateFromLocalStorage) => {
      console.log('autologin');
      return of(autoLogin({ newState: authStateFromLocalStorage! })).pipe(observeOn(asapScheduler));
    })
  ));

  removeMainImageUrl$ = createEffect(() => this._actions$.pipe(
    ofType(removeMainImageUrlStart),
    exhaustMap(() => {
      const currentAuthState = this._stateSnapshotService.getAuthState();
      const body = { targetUserId: currentAuthState.userData!.userId };

      return this._httpClient.patch<void>(REMOVE_MAIN_IMG_URL, body).pipe(
        map(() => {
          const newUserData: AuthModel = {
            ...currentAuthState.userData!,
            mainPhotoUrl: null
          };

          const newState: AuthState = {
            ...currentAuthState,
            userData: newUserData
          };

          this._localStorageService.updateAuthState(newState);

          return removeMainImageUrlSuccess({ newState });
        }),
        catchError(() => of(removeMainImageUrlFalied()))
      );
    })
  ));

  constructor(
    private readonly _actions$: Actions,
    private readonly _httpClient: HttpClient,
    private readonly _localStorageService: LocalStorageService,
    private readonly _stateSnapshotService: StateSnapshotService,
    private readonly _auth: Auth,
    private readonly _firestore: Firestore,
    private readonly _storage: Storage,
    private readonly _store: Store<AppState>
  ) { }

}

