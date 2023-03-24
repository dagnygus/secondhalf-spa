import { assertNotNullAuthState, AuthStateRef } from './../auth/auth.state';
import { UrlService } from 'src/app/services/url.service';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError, distinctUntilChanged, shareReplay, share, tap } from 'rxjs/operators';
import { likeStart, likeSuccess, likeFailed } from './like.actions';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, merge } from 'rxjs';
import { isActionTypeOf } from '../utils';

@Injectable()
export class LikeEffects {

  like$ = createEffect(() => this._actions$.pipe(
    ofType(likeStart),
    exhaustMap(({ id }) => {
      const currentAuthState = this._authStateRef.state;

      assertNotNullAuthState(currentAuthState);

      const body = {
        sourceUserId: currentAuthState.userData.userId,
        targetUserId: id
      }

      return this._http.post<void>(this._urlService.likeUrl, body).pipe(
        map(() => likeSuccess({ id })),
        catchError((httpError) => of(likeFailed({ httpError })))
      )
    })
  ))

  constructor(private _actions$: Actions,
              private _http: HttpClient,
              private _urlService: UrlService,
              private _authStateRef: AuthStateRef) {}
}

@Injectable({ providedIn: 'root' })
export class LikeEvents {

  pending$ = this._actions$.pipe(
    ofType(likeStart, likeSuccess, likeFailed),
    map((action) => {
      if (isActionTypeOf(action, likeFailed, likeSuccess)) {
        return false;
      }
      return true;
    }),
    share()
  );

  constructor(private _actions$: Actions) {}
}
