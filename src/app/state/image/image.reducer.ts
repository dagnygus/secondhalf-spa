/* eslint-disable @typescript-eslint/naming-convention */
import { updateImagesState } from './image.actions';
import { createReducer, on } from '@ngrx/store';
import { initialState } from './image.state';

export const imageReducer = createReducer(
  initialState,
  on(updateImagesState, (_, { newState }) => newState)
);
