import { environment } from 'src/environments/environment';
import { updateUser } from 'src/app/state/auth/auth.actions';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store, Action } from '@ngrx/store';
import { updateAuthState } from './../auth/auth.actions';
import { AuthModel } from './../../models/auth-model';
import { UrlService } from 'src/app/services/url.service';
import { assertNotNullAuthState, AuthState, AuthStateRef } from './../auth/auth.state';
import { exhaustMap, map, catchError,  switchMap, filter, startWith, distinctUntilChanged, share, shareReplay } from 'rxjs/operators';
import { getImages,
         updateImagesState,
         uploadImages,
         imagesHttpError,
         deleteImage,
         uploadImage} from './image.actions';
import { Injectable, OnDestroy } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, merge, of, ReplaySubject, Subscription, Observable } from 'rxjs';
import { ImageState, initialState, ImageStateRef } from './image.state';
import { Storage, ref, uploadBytes, deleteObject, getDownloadURL } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { assertNotNull } from 'src/app/utils/others';
import { FsUserModelFieldNames } from 'src/app/models/db-models';
import { isPrevActionTypeOf, StateStatus, isActionTypeOf, AsyncActionStatus } from '../utils';

const getImageName = (imageUrl: string) => {

  if (environment.funcrtionsEmulator) {

    let index = imageUrl.lastIndexOf('%2F') + 3;
    let imageName = imageUrl.substring(index);

    if (imageName.includes('?')) {
      index = imageName.indexOf('?');
      imageName = imageName.substring(0, index);
    }

    return imageName;
  } else {

    const index1 = imageUrl.lastIndexOf('%2F');
    const index2 = imageUrl.lastIndexOf('?');
    let name = imageUrl.substring(index1 + 3, index2);
    if (name.includes('%3A')) {
        name = (name as any).replaceAll('%3A', ':');
    }
    return name;
  }

};

@Injectable()
export class ImageEffects {

  getImages$ = createEffect(() => this._actions$.pipe(
    ofType(getImages),
    exhaustMap((action) => {
      const currentImageState = this._imageStateRef.state;
      if (currentImageState.userId === action.userId) {

        const authUserData = this._authStateRef.state.userData;
        const URLs = currentImageState.URLs.slice()
          if (authUserData && action.userId === authUserData.userId && authUserData.mainPhotoUrl) {
            _correctOrder(URLs, authUserData.mainPhotoUrl)
          }

        return of(updateImagesState({
          newState: {
            ...currentImageState,
            URLs
          }
        }));
      }

      return this._httpClient.get<string[]>(`${this._urlService.imageUrl}/${action.userId}`).pipe(
        map((URLs) => {

          const authUserData = this._authStateRef.state.userData;

          if (authUserData && action.userId === authUserData.userId && authUserData.mainPhotoUrl) {
            _correctOrder(URLs, authUserData.mainPhotoUrl)
          }

          const newState: ImageState = {
            userId: action.userId,
            URLs,
          };

          return updateImagesState({ newState, prevAction: action });
        }),
        catchError(() => of(imagesHttpError({ prevAction: action })))
      );
    })
  ));

  uploadImages$ = createEffect(() => this._actions$.pipe(
    ofType(uploadImages),
    exhaustMap((action) => {
      const authUserData = this._authStateRef.state.userData;

      assertNotNull(authUserData);

      return from(this._uploadImagesToStorage(authUserData.userId, action.data)).pipe(
        map((urls) => {
          const { userId, URLs } = this._imageStateRef.state;
          urls.push(...URLs);

          const authUserData = this._authStateRef.state.userData;

          if (authUserData && authUserData.userId === userId && authUserData.mainPhotoUrl) {
            _correctOrder(urls, authUserData.mainPhotoUrl)
          }

          const newState: ImageState = {
            userId,
            URLs: urls
          };

          return updateImagesState({ newState, prevAction: action });
        }),
        catchError(() => of(imagesHttpError({ prevAction: action }))
      ));
    })
  ));

  uploadImage$ = createEffect(() => this._actions$.pipe(
    ofType(uploadImage),
    exhaustMap((action) => {
      const authUserData = this._authStateRef.state.userData;

      assertNotNull(authUserData);

      let name: string;
      if (_isFile(action.data)) {
        name = action.data.name;
      } else {
        name = authUserData.email;
      }

      const path = `${authUserData.userId}/images/__${new Date().toJSON()}_${name}`;
      const storageRef = ref(this._storage, path);

      return from(uploadBytes(storageRef, action.data)).pipe(
        switchMap(async (uploadResult) => await getDownloadURL(uploadResult.ref)),
        map((url) => {
          const currentState = this._imageStateRef.state;
          const URLs = currentState.URLs.slice();
          URLs.unshift(url);

          const authUserData = this._authStateRef.state.userData;

          if (authUserData && currentState.userId === authUserData.userId && authUserData.mainPhotoUrl) {
            _correctOrder(URLs, authUserData.mainPhotoUrl)
          }

          const newState: ImageState = {
            userId: currentState.userId,
            URLs
          };
          return updateImagesState({ newState, prevAction: action });
        }),
        catchError(() => of(imagesHttpError({ prevAction: action })))
      );
    })
  ));

  deleteImage$ = createEffect(() => this._actions$.pipe(
    ofType(deleteImage),
    exhaustMap((action) => {
      const currentImageState = this._imageStateRef.state;
      const imageUrl = currentImageState.URLs[action.index];
      const storageRef = ref(this._storage, imageUrl);
      return from(deleteObject(storageRef)).pipe(
        map(() => {
            let newState: ImageState;

            const URLs = currentImageState.URLs.slice(0);
            URLs.splice(action.index, 1);

            if (URLs.length > 0) {
              newState = {
                userId: currentImageState.userId,
                URLs
              };
            } else {
              newState = initialState;
            }

            const authUserData = this._authStateRef.state.userData;

            let mainImageDeleted = false;

            if (authUserData && authUserData.mainPhotoUrl) {
              mainImageDeleted = getImageName(authUserData.mainPhotoUrl) === getImageName(imageUrl);
            }

            return updateImagesState({ newState, prevAction: action, mainImageDeleted });
          },
        ),
        catchError(() => of(imagesHttpError({ prevAction: action })))
      );
    })
  ));

  changeOrderAfterUpdatingMainImageUrl$ = createEffect(() => this._actions$.pipe(
    ofType(updateAuthState),
    filter((action) => {
      if (isPrevActionTypeOf(action, updateUser) && action.prevAction.data.fieldName === FsUserModelFieldNames.mainPhotoUrl) {
        return true;
      }
      return false;
    }),
    map((action) => {
      assertNotNullAuthState(this._authStateRef.state);
      assertNotNull(this._authStateRef.state.userData.mainPhotoUrl);
      const newUrl = this._authStateRef.state.userData.mainPhotoUrl;
      const index = this._imageStateRef.state.URLs.indexOf(newUrl);
      const newUrls = this._imageStateRef.state.URLs.slice();
      newUrls.unshift(newUrls.splice(index, 1)[0]);
      const newState = {
        userId: this._imageStateRef.state.userId,
        URLs: newUrls
      }

      return updateImagesState({ newState, prevAction: action, info: 'Reordering after main image url change!' })
    })
  ))

  constructor(private readonly _actions$: Actions,
              private readonly _store: Store<AppState>,
              private readonly _storage: Storage,
              private readonly _httpClient: HttpClient,
              private readonly _authStateRef: AuthStateRef,
              private readonly _imageStateRef: ImageStateRef,
              private readonly _urlService: UrlService) {}

  private async _uploadImagesToStorage(userId: string, files: readonly (Blob | File)[]): Promise<string[]> {
    const filepaths: string[] = [];

    for (const file of files) {
      let name: string;

      if (_isFile(file)) {
        name = file.name;
      } else {
        name = this._authStateRef.state.userData!.email;
      }

      const storagePath = `${userId}/images/__${new Date().toJSON()}_${name}`;
      const storageRef = ref(this._storage, storagePath);
      const uploadResult = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadResult.ref);
      filepaths.push(url);
    }
    return filepaths;
  }
}

function _correctOrder(targetUrlsToSort: string[], mainPhotoUrl: string) {
  const indexOfMainImage = targetUrlsToSort.findIndex(
    (url) => getImageName(url) === getImageName(mainPhotoUrl)
  );
  if (indexOfMainImage > 0) {
    const mainImageUrl = targetUrlsToSort.splice(indexOfMainImage, 1)[0];
    targetUrlsToSort.unshift(mainImageUrl);
  }
}


function _isFile(fileOrBlob: File | Blob): fileOrBlob is File {
  return Object.getPrototypeOf(fileOrBlob) === File.prototype;
}


@Injectable({ providedIn: 'root' })
export class ImageEvents implements OnDestroy {

  private _connectionSubscription: Subscription;

  status$: Observable<StateStatus>;

  uploading$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, uploadImage, uploadImages) || isPrevActionTypeOf(action, uploadImage, uploadImages)),
    map(this._getAsyncActionStatus),
    share()
  );

  deleting$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, deleteImage) || isPrevActionTypeOf(action, deleteImage)),
    map(this._getAsyncActionStatus),
    share()
  );

  uploadingOne$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, uploadImage) || isPrevActionTypeOf(action, uploadImage)),
    map(this._getAsyncActionStatus),
    share()
  )

  uploadingMany$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, uploadImages) || isPrevActionTypeOf(action, uploadImages)),
    map(this._getAsyncActionStatus),
    share()
  )


  uploaded$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, updateImagesState) && isPrevActionTypeOf(action, uploadImage, uploadImages)),
    share()
  );

  uploadingError$ = this._actions$.pipe(
    ofType(imagesHttpError),
    filter((actions) => isPrevActionTypeOf(actions, uploadImage, uploadImages)),
    share()
  );

  constructor(private _actions$: Actions,
              private _imageStateRef: ImageStateRef) {

    const subject = new ReplaySubject<StateStatus>(1);
    this.status$ = new Observable((observer) => subject.subscribe(observer));

    this._connectionSubscription = merge(
      this._actions$.pipe(
        ofType(updateImagesState),
        map(() => this._imageStateRef.state),
        startWith(this._imageStateRef.state),
        map((state) => state.URLs.length > 0 ? StateStatus.complete : StateStatus.empty)
      ),
      this._actions$.pipe(
        ofType(getImages),
        map(() => StateStatus.pending)
      ),
      this._actions$.pipe(
        ofType(imagesHttpError),
        filter((action) => isPrevActionTypeOf(action, imagesHttpError)),
        map(() => StateStatus.error)
      )
    ).pipe(distinctUntilChanged()).subscribe(subject);
  }

  ngOnDestroy(): void {
    this._connectionSubscription.unsubscribe();
  }

  private _getAsyncActionStatus(action: Action): AsyncActionStatus {
    switch (action.type) {
      case updateImagesState.type:
        return AsyncActionStatus.resolved;
      case imagesHttpError.type:
        return AsyncActionStatus.resolved;
      default:
        return AsyncActionStatus.awaiting;
    }
  }
}
