/* eslint-disable @typescript-eslint/naming-convention */
import { insertAt } from './../../utils/array-immutable-actions';
import { uploadImageSuccess,
         uploadImagesSuccess,
         deleteImageSuccess,
         getImagesSuccess,
         getImagesForMemberSuccess,
         addNewMainImage,
         clearImageState,
         getImagesStart,
         getImagesForMemberStart,
         getImagesFailed,
         getImagesForMemberFailed,
         changeImagesOrder} from './image.actions';
import { createReducer, on } from '@ngrx/store';
import { ImageState, initialState } from './image.state';

export const imageReducer = createReducer(
  initialState,
  on(
    uploadImageSuccess,
    uploadImagesSuccess,
    deleteImageSuccess,
    getImagesSuccess,
    getImagesForMemberSuccess,
    (_, { newState }) => newState),
  on(addNewMainImage, (state, action) => {

    const URLs = state.URLs.slice();
    URLs.unshift(action.url);

    const newState: ImageState = {
      status: 'complete',
      userId: state.userId,
      URLs
    };

    return newState;
  }),
  on(getImagesStart, getImagesForMemberStart, (state) => ({ ...state, status: 'pending' })),
  on(getImagesFailed, getImagesForMemberFailed, (state) => ({ ...state, status: 'error' })),
  on(clearImageState, () => initialState),
  on(changeImagesOrder, (state, { url }) => {
    const newUrls = state.URLs.slice();
    const index = newUrls.findIndex((value) => value === url);
    const newMainUrl = newUrls.splice(index, 1)[0];
    newUrls.unshift(newMainUrl);
    return { ...state, URLs: newUrls };
  })
);
