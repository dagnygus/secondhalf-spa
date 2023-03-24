import { assertNotNull } from 'src/app/utils/others';
import { AppState } from 'src/app/app.ngrx.utils';
import { Injectable, OnDestroy } from '@angular/core';
import { MemberModel } from 'src/app/models/member-model';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { BaseStateRef } from '../utils';

export interface MemberState {
  readonly member: MemberModel | null;
}

export const initialState: MemberState = {
  member: null
};

@Injectable({ providedIn: 'root' })
export class MemberStateRef extends BaseStateRef<MemberState> implements OnDestroy {

  constructor(store: Store<AppState>) {
    super(store.select(({ member }) => member))
  }

}
