/* eslint-disable @typescript-eslint/no-shadow */

import { Action, createAction, props } from '@ngrx/store';
import { ImageState } from './image.state';

export enum ImageActionNames {
  uploadImage = '[Images] Upload image.',
  uploadImages = '[Images] Upload images.',
  deleteImage = '[Images] Delete image.',
  getImages = '[Images] Get images.',
  update = '[Images] Update images state.',
  httpError = '[Images] Http error',
}

export const uploadImage = createAction(ImageActionNames.uploadImage, props<{ data: File | Blob, info: string }>());
export const uploadImages = createAction(ImageActionNames.uploadImages, props<{ data: readonly (File | Blob)[], info: string }>());
export const deleteImage = createAction(ImageActionNames.deleteImage, props<{ index: number, info: string }>())
export const getImages = createAction(ImageActionNames.getImages, props<{ userId: string, info: string }>());
export const updateImagesState = createAction(ImageActionNames.update, props<{ newState: ImageState, prevAction?: Action, info?: string, mainImageDeleted?: boolean }>())
export const imagesHttpError = createAction(ImageActionNames.httpError, props<{ prevAction: Action, info?: string, }>())
