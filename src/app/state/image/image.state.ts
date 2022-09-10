/* eslint-disable @typescript-eslint/naming-convention */
import { StateStatus } from './../../app.ngrx.utils';
import { emptyArr } from './../../utils/array-immutable-actions';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ImageState {
  readonly status: StateStatus;
  readonly userId: string | null;
  readonly URLs: readonly string[];
}

export const initialState: ImageState = {
  status: 'empty',
  userId: null,
  URLs: emptyArr
};
