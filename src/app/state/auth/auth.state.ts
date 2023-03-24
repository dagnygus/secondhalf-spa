import { AppState } from 'src/app/app.ngrx.utils';
import { OnDestroy, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { AuthModel } from '../../models/auth-model';
import { BaseStateRef } from '../utils';


// eslint-disable-next-line @typescript-eslint/naming-convention

interface _NullAuthState {
  readonly expirationTime: null;
  readonly token: null;
  readonly role: null;
  readonly userData: null;
}

interface _NotNullAuthState {
  readonly expirationTime: string;
  readonly token: string;
  readonly role: string | null;
  readonly userData: AuthModel;
}

export type AuthState = _NullAuthState | _NotNullAuthState;

export const initialState: AuthState = {
  expirationTime: null,
  token: null,
  role: null,
  userData: null,
};

export function assertNotNullAuthState(authState: AuthState): asserts authState is _NotNullAuthState {
  if (authState.userData == null) {
    throw new Error('Auth state is nullish');
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStateRef extends BaseStateRef<AuthState> implements OnDestroy {
  constructor(store: Store<AppState>) {
    super(store.select((appState) => appState.auth))
  }
}
