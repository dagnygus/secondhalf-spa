import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { emptyArr } from "src/app/utils/constans";
import { AppState } from 'src/app/app.ngrx.utils';
import { BaseStateRef } from '../utils';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ImageState {
  readonly userId: string | null;
  readonly URLs: readonly string[];
}

export const initialState: ImageState = {
  userId: null,
  URLs: emptyArr
};

@Injectable({ providedIn: 'root' })
export class ImageStateRef extends BaseStateRef<ImageState> implements OnDestroy {

  constructor(store: Store<AppState>) {
    super(store.select(({ image }) => image))
  }

}
