/* eslint-disable @typescript-eslint/member-ordering */
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthState } from '../state/auth/auth.state';

export interface DecodedToken {
  userid: string;
  email: string;
  rolename: string;
  iat: number;
  exp: number;
}

const AUTH_STATE = 'AuthState';
const EXP_DATE = 'EXP_DATE';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  get isAuth(): boolean { return this._isAuth; }

  private _isAuth = false;
  private _expDateTimeout: any;
  private _autoLogoutTimeout: any;

  private _tokenExpired$ = new Subject<void>();
  readonly tokenExpired$ = this._tokenExpired$.asObservable();

  constructor(@Inject(PLATFORM_ID) private _platformId: object) {}

  setItem<T extends object>(name: string, item: T): void {
    if (typeof localStorage === 'undefined') { return; }
    localStorage.setItem(name, JSON.stringify(item));
  }

  getItem<T>(name: string): T | null {
    if (typeof localStorage === 'undefined') { return null; }

    const itemStr = localStorage.getItem(name);

    if (!itemStr) { return null; }

    return JSON.parse(itemStr);
  }

  removeItem(name: string): void {
    if (typeof localStorage === 'undefined') { return; }
    localStorage.removeItem(name);
  }

  saveAuthState(state: AuthState, expirationTime: string): void | never {
    if (typeof localStorage === 'undefined') { return; }


    if (localStorage.getItem(AUTH_STATE) !== null) {
      throw new Error('Auth state allready is in local storage');
    }

    localStorage.setItem(AUTH_STATE, JSON.stringify(state));

    const expDate = new Date(expirationTime);
    localStorage.setItem(EXP_DATE, expDate.toISOString());
    this._initialAutoLogoutTimer(expDate);
  }

  removeAuthState(): void {
    if (typeof localStorage === 'undefined') { return; }
    localStorage.removeItem(AUTH_STATE);
    localStorage.removeItem(EXP_DATE);
  }

  getAuthState(): AuthState | null {
    if (typeof localStorage === 'undefined') { return null; }
    this._initialAutoLogoutTimer();
    const stateStr = localStorage.getItem(AUTH_STATE);
    if (!stateStr) { return null; }
    return JSON.parse(stateStr);
  }

  updateAuthState(state: AuthState): void {
    if (typeof localStorage === 'undefined') { return; }
    localStorage.setItem(AUTH_STATE, JSON.stringify(state));
  }

  private _initialAutoLogoutTimer(expDate?: Date): void {
    let localExpDate: Date;

    if (expDate) {
      localExpDate = expDate;
    } else {
      const expDateStr = localStorage.getItem(EXP_DATE);
      if (!expDateStr) {
        if (this._autoLogoutTimeout != null) {
          clearTimeout(this._autoLogoutTimeout);
        }

        if (localStorage.getItem(AUTH_STATE) != null) {
          localStorage.removeItem(AUTH_STATE);
        }
        return;
      }

      localExpDate = new Date(expDateStr);
    }

    const dateNow = new Date();

    if (localExpDate <= dateNow) {
      if (localStorage.getItem(AUTH_STATE)) {
        localStorage.removeItem(AUTH_STATE);
      }
      if (localStorage.getItem(EXP_DATE)) {
        localStorage.removeItem(EXP_DATE);
      }
      return;
    }

    const milliseconds = localExpDate.getTime() - dateNow.getTime();
    this._autoLogoutTimeout = setTimeout(() => {
      localStorage.removeItem(EXP_DATE);
      localStorage.removeItem(AUTH_STATE);
      this._tokenExpired$.next();
    }, milliseconds);
  }

  cancelTokenExpiryTimer(): void {
    if (this._expDateTimeout === null) { return; }

    clearTimeout(this._expDateTimeout);
    this._expDateTimeout = null;
  }

}
