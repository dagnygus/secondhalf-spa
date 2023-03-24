import { AppState } from 'src/app/app.ngrx.utils';
import { Store } from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { emptyArr } from 'src/app/utils/constans';
import { NotificationModel } from './../../models/notification-model';
import { BaseStateRef } from '../utils';

export interface NotificationState {
  readonly notifications: readonly NotificationModel[];
}

export const initialState: NotificationState = {
  notifications: emptyArr,
};

@Injectable({ providedIn: 'root' })
export class NotificationStateRef extends BaseStateRef<NotificationState> implements OnDestroy {

  constructor(store: Store<AppState>) {
    super(store.select(({ notification }) => notification))
  }
}
