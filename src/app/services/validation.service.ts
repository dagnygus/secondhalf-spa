import { AppState } from 'src/app/app.ngrx.utils';
import { of } from 'rxjs';
import { AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {  tap, map, distinctUntilChanged, } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AuthModel } from '../models/auth-model';
import { UrlService } from './url.service';

const EMAIL_ASYNC_VALIDATION_ERRORS = { emailAsync: 'This address email is allready in use!'  };
const HAS_EMAIL_ASYNC_VALIDATION_ERRORS = { hasEmailAsyc: 'Address email not recognized!'  };

@Injectable({ providedIn: 'root' })
export class AsyncValidationService{

  private _authUserData: Readonly<AuthModel> | null = null;

  constructor(private readonly _httpClient: HttpClient,
              private readonly _store: Store<AppState>,
              private readonly _urlService: UrlService) {

    this._store.pipe(
      select((appState) => appState.auth.userData),
      distinctUntilChanged(),
      tap((userData) => {
        this._authUserData = userData;
      })
    );
  }

  email(onDoneCallback?: (...args: any[]) => any): AsyncValidatorFn {
    return (control) => this._httpClient.post<boolean>(this._urlService.emailNotInUseUrl, { email: control.value }).pipe(
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
    return (control) => this._httpClient.post<boolean>(this._urlService.emailNotInUseUrl, { email: control.value }).pipe(
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

      return this._httpClient.post<boolean>(this._urlService.emailNotInUseUrl, { email: control.value }).pipe(
        map(value => value ? null : EMAIL_ASYNC_VALIDATION_ERRORS),
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
