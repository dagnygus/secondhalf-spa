import { AppState } from 'src/app/app.ngrx.utils';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, first } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Injectable()
export class TokenIntercenptor implements HttpInterceptor {
  constructor(private readonly _store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {

    return this._store.select((appState) => appState.auth.token).pipe(
      first(),
      mergeMap((token) => token ?
        httpHandler.handle(req.clone({
          setHeaders: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${token}`
          }
        })) :
        httpHandler.handle(req)
      )
    );
  }
}
