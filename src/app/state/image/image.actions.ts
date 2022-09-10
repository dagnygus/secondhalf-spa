/* eslint-disable @typescript-eslint/no-shadow */

import { createAction, props } from '@ngrx/store';
import { ImageState } from './image.state';

export enum ImageActionNames {
  uploadImageStart = '[Auth User Page/ Photos] upload image start.',
  uploadImageSuccess = '[Auth User Page / Photos] upload image success.',
  uploadImageFailed = '[Auth User Page / Photos] upload image failed.',
  uploadImagesStart = '[Auth User Page / Photos] upload images start.',
  uploadImagesSuccess = '[Auth User Page / Photos] upload images success.',
  uploadImagesFailed = '[Auth User Page / Photos] upload images failed.',
  deleteImageStart = '[Auth User Page / Photos] delete image start.',
  deleteImageSuccess = '[Auth User Page / Photos] delete image success.',
  deleteImageFailed = '[Auth User Page / Photos] delete image failed.',
  getImagesStart = '[Auth User Page / Photos] get images start.',
  getImagesSuccess = '[Auth User Page / Photos] get images success.',
  getImagesFailed = '[Auth User Page / Photos] get images failed.',
  getImagesForMemberStart = '[Member Page / Photos] get images for member start.',
  getImagesForMemberSuccess = '[Member Page / Photos] get images for member success.',
  getImagesForMemberFailed = '[Member Page / Photos] get images for member failed.',
  addNewMainImage = '[Auth Effects] Add new profile picture to images.',
  clearImageState = '[Auth User Page / Photos] Clear image state',
  changeImagesOrder = '[Auth User Page / Photos] Change images order after selecting new main image!'
}

export const uploadImageStart = createAction(
  ImageActionNames.uploadImageStart,
  props<{ data: File | Blob }>()
);

export const uploadImageSuccess = createAction(
  ImageActionNames.uploadImageSuccess,
  props<{ newState: ImageState }>()
);

export const uploadImageFailed = createAction(
  ImageActionNames.uploadImageFailed,
);

export const uploadImagesStart = createAction(
  ImageActionNames.uploadImagesStart,
  props<{ data: readonly (File | Blob)[] }>()
);

export const uploadImagesSuccess = createAction(
  ImageActionNames.uploadImagesSuccess,
  props<{ newState: ImageState }>()
);

export const uploadImagesFailed = createAction(
  ImageActionNames.uploadImagesFailed
);

export const deleteImageStart = createAction(
  ImageActionNames.deleteImageStart,
  props<{ index: number }>()
);

export const deleteImageSuccess = createAction(
  ImageActionNames.deleteImageSuccess,
  props<{ newState: ImageState }>()
);

export const deleteImageFailed = createAction(
  ImageActionNames.deleteImageFailed,
);

export const getImagesStart = createAction(
  ImageActionNames.getImagesStart
);

export const getImagesSuccess = createAction(
  ImageActionNames.getImagesSuccess,
  props<{ newState: ImageState }>()
);

export const getImagesFailed = createAction(
  ImageActionNames.getImagesFailed
);

export const getImagesForMemberStart = createAction(
  ImageActionNames.getImagesForMemberStart,
  props<{ userId: string }>()
);

export const getImagesForMemberSuccess = createAction(
  ImageActionNames.getImagesForMemberSuccess,
  props<{ newState: ImageState }>()
);

export const getImagesForMemberFailed = createAction(
  ImageActionNames.getImagesForMemberFailed,
);

export const addNewMainImage = createAction(
  ImageActionNames.addNewMainImage,
  props<{ url: string }>()
);

export const clearImageState = createAction(
  ImageActionNames.clearImageState
);

export const changeImagesOrder = createAction(
  ImageActionNames.changeImagesOrder,
  props<{ url: string }>()
);
