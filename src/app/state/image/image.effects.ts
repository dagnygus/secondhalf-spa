/* eslint-disable max-len */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/naming-convention */
import { environment } from './../../../environments/environment';
import { removeMainImageUrl, removeMainImageUrlStart } from './../auth/auth.actions';
import { exhaustMap, map, catchError, tap, switchMap } from 'rxjs/operators';
import { getImagesStart,
         getImagesSuccess,
         getImagesFailed,
         uploadImagesStart,
         uploadImagesSuccess,
         uploadImagesFailed,
         uploadImageStart,
         uploadImageSuccess,
         deleteImageStart,
         deleteImageSuccess,
         deleteImageFailed,
         getImagesForMemberStart,
         getImagesForMemberSuccess,
         getImagesForMemberFailed} from './image.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { from, of } from 'rxjs';
import { ImageState, initialState } from './image.state';
import { insertAt, removeAt } from 'src/app/utils/array-immutable-actions';
import { Storage, ref, listAll, getMetadata, uploadBytes, UploadResult, deleteObject, getDownloadURL, StorageReference } from '@angular/fire/storage';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ImageEffects {

  getMembersImages$ = createEffect(() => this._actions$.pipe(
    ofType(getImagesForMemberStart),
    exhaustMap(({ userId }) => {
      const currentImageState = this._stateSnapshotService.getImageState();
      if (currentImageState.userId === userId) {
        return of(getImagesForMemberSuccess({
          newState: {
            ...currentImageState,
            status: 'complete'
          }
        }));
      }

      return this._httpClient.get<string[]>(`${environment.baseUrl}image/${userId}`).pipe(
        map((URLs) => {
          const newState: ImageState = {
            status: 'complete',
            userId,
            URLs,
          };

          return getImagesForMemberSuccess({ newState });
        }),
        catchError(() => of(getImagesForMemberFailed()))
      );
    })
  ));

  getImages$ = createEffect(() => this._actions$.pipe(
    ofType(getImagesStart),
    exhaustMap(() => {
      const userId = this._stateSnapshotService.getAuthState().userData!.userId;
      const currentImageState = this._stateSnapshotService.getImageState();
      const storageRef = ref(this._storage, `/${userId}/images`);

      if (userId === currentImageState.userId) {
        let newState: ImageState;
        if (currentImageState.status === 'complete') {
          newState = currentImageState;
        } else {
          newState = {
            ...currentImageState,
            status: 'complete',
          };
        }
        return of(getImagesSuccess({ newState }));
      }

      return from(listAll(storageRef)).pipe(
        switchMap((listResult) => Promise.all(listResult.items.map((item) => getMetadata(item)))),
        map((metadatas) => metadatas.sort((prev, curr) => curr.timeCreated.localeCompare(prev.timeCreated))),
        switchMap((metadatas) => Promise.all(metadatas.map((metadata) => getDownloadURL(metadata.ref!)))),
        map((URLs) => {

          const mainImageUrl = this._stateSnapshotService.getAuthState().userData!.mainPhotoUrl;

          if (mainImageUrl) {
            const mainIndex = URLs.findIndex((url) => url === mainImageUrl);
            const mainUrl = URLs.splice(mainIndex, 1)[0];
            URLs.unshift(mainUrl);
          }

          const newState: ImageState = {
            status: 'complete',
            userId,
            URLs,
          };

          return getImagesSuccess({ newState });
        }),
        catchError(() => of(getImagesFailed()))
      );
    })
  ));

  uploadImages$ = createEffect(() => this._actions$.pipe(
    ofType(uploadImagesStart),
    exhaustMap(({ data }) => {
      const userId = this._stateSnapshotService.getAuthState().userData!.userId;

      return from(this._uploadImagesToStorage(userId, data)).pipe(
        map((urls) => {
          const currentState = this._stateSnapshotService.getImageState();
          const newState: ImageState = {
            status: 'complete',
            userId: currentState.userId,
            URLs: currentState.URLs.length === 0 ? urls : urls.concat(currentState.URLs)
          };

          return uploadImagesSuccess({ newState });
        }),
        catchError(() => of(uploadImagesFailed())
      ));
    })
  ));

  uploadImage$ = createEffect(() => this._actions$.pipe(
    ofType(uploadImageStart),
    exhaustMap(({ data }) => {
      const currentUserData = this._stateSnapshotService.getAuthState().userData!;
      let name: string;
      if (_isFile(data)) {
        name = data.name;
      } else {
        name = currentUserData.email;
      }

      const path = `/${currentUserData.userId}/images/__${new Date().toJSON()}_${name}`;
      const storageRef = ref(this._storage, path);

      return from(uploadBytes(storageRef, data)).pipe(
        switchMap(async (uploadResult) => await getDownloadURL(uploadResult.ref)),
        map((url) => {
          const currentState = this._stateSnapshotService.getImageState();
          const URLs = currentState.URLs.slice();
          URLs.unshift(url);
          const newState: ImageState = {
            status: 'complete',
            userId: currentState.userId,
            URLs
          };
          return uploadImageSuccess({ newState });
        })
      );
    })
  ));

  deleteImage$ = createEffect(() => this._actions$.pipe(
    ofType(deleteImageStart),
    exhaustMap(({ index }) => {
      const currentState = this._stateSnapshotService.getImageState();
      const imageUrl = currentState.URLs[index];

      const storageRef = ref(this._storage, imageUrl);

      return from(deleteObject(storageRef)).pipe(
        tap({
          next: () => {
            let newState: ImageState;

            const URLs = currentState.URLs.slice(0);
            URLs.splice(index, 1);

            if (URLs.length > 0) {
              newState = {
                status: 'complete',
                userId: currentState.userId,
                URLs
              };
            } else {
              newState = initialState;
            }

            this._store.dispatch(deleteImageSuccess({ newState }));
            const mainImageUrl = this._stateSnapshotService.getAuthState().userData!.mainPhotoUrl;

            if (mainImageUrl === imageUrl) {
              this._store.dispatch(removeMainImageUrlStart());
            }
          },

          error: () => {
            this._store.dispatch(deleteImageFailed());
          }
        })
      );
    })
  ), { dispatch: false });

  constructor(private readonly _actions$: Actions,
              private readonly _stateSnapshotService: StateSnapshotService,
              private readonly _store: Store<AppState>,
              private readonly _storage: Storage,
              private readonly _httpClient: HttpClient) {}

  private async _uploadImagesToStorage(userId: string, files: readonly (Blob | File)[]): Promise<string[]> {
    const filepaths: string[] = [];

    for (const file of files) {
      let name: string;

      if (_isFile(file)) {
        name = file.name;
      } else {
        name = this._stateSnapshotService.getAuthState().userData!.email;
      }

      const storagePath = `/${userId}/images/__${new Date().toJSON()}_${name}`;
      const storageRef = ref(this._storage, storagePath);
      const uploadResult = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadResult.ref);
      filepaths.push(url);
    }
    return filepaths;
  }
}


function _isFile(fileOrBlob: File | Blob): fileOrBlob is File {
  return Object.getPrototypeOf(fileOrBlob) === File.prototype;
}
