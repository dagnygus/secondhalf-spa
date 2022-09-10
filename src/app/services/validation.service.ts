import { AppState } from 'src/app/app.ngrx.utils';
import { environment } from './../../environments/environment';
import { of } from 'rxjs';
import { AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Destroyable } from '../my-package/core/destroyable';
import { Injectable, OnDestroy } from '@angular/core';
import { delay, tap, map, distinctUntilChanged, } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AuthModel } from '../models/auth-model';
import { AUTH_URL, EMAIL_IS_NOT_IN_USE_URL } from '../utils/constans';

const EMAIL_ASYNC_VALIDATION_ERRORS = { emailAsync: { message: 'This address email is allready in use!' } };
const HAS_EMAIL_ASYNC_VALIDATION_ERRORS = { hasEmailAsyc: { message: 'This address e-mail is not Registered in our application' } };

@Injectable({ providedIn: 'root' })
export class AsyncValidationService extends Destroyable implements OnDestroy {

  private _authUserData: Readonly<AuthModel> | null = null;

  constructor(private readonly _httpClient: HttpClient,
              private readonly _store: Store<AppState>) {
    super();

    this._store.pipe(
      select((appState) => appState.auth.userData),
      distinctUntilChanged(),
      tap((userData) => {
        this._authUserData = userData;
      })
    );
  }

  email(onDoneCallback?: (...args: any[]) => any): AsyncValidatorFn {
    return (control) => this._httpClient.post<boolean>(EMAIL_IS_NOT_IN_USE_URL, { email: control.value }).pipe(
      map(value => value ? null : EMAIL_ASYNC_VALIDATION_ERRORS),
      tap(() => {
        control.markAsTouched();
        control.markAsDirty();
        if (onDoneCallback) {
          onDoneCallback();
        }
      }),
    );
  }

  hasEmail(onDoneCallback?: (...args: any[]) => any): AsyncValidatorFn {
    return (control) => this._httpClient.post<boolean>(EMAIL_IS_NOT_IN_USE_URL, { email: control.value }).pipe(
      map(value => !value ? null : HAS_EMAIL_ASYNC_VALIDATION_ERRORS),
      tap(() => {
        control.markAsTouched();
        control.markAsDirty();
        if (onDoneCallback) {
          onDoneCallback();
        }
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  otherEmial(onDoneCallback?: (...args: any[]) => any): AsyncValidatorFn {
    return (control) => {
      if (this._authUserData && control.value === this._authUserData.email) {
        return of(null);
      }

      return this._httpClient.post<boolean>(EMAIL_IS_NOT_IN_USE_URL, { email: control.value }).pipe(
        map(value => value ? null : EMAIL_ASYNC_VALIDATION_ERRORS),
        delay(environment.requestDelayTiming),
        tap(() => {
          control.markAsTouched();
          control.markAsDirty();
          if (onDoneCallback) {
            onDoneCallback();
          }
        }),
      );
    };
  }
}
