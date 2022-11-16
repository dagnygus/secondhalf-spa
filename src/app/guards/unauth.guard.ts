import { Observable, SubscriptionLike } from 'rxjs';
import { Injectable, OnDestroy} from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppState } from '../app.ngrx.utils';
import { Store } from '@ngrx/store';
import { selectIsAuth } from '../state/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class UnauthGourd implements CanActivate, CanLoad, OnDestroy {

  private _guardedUrl: Set<string> = new Set();
  private _isAuth = false;
  private _subscription?: SubscriptionLike;

  constructor(private readonly _location: Location,
              private readonly _store: Store<AppState>,
              private readonly _router: Router) {
    this._init();
  }

  canLoad(_: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    const url = '/' + segments.toString().replace(',', '/');

    if (!this._guardedUrl.has(url)) {
      this._guardedUrl.add(url);
    }

    return this._store.select(selectIsAuth).pipe(
      distinctUntilChanged(),
      map((isAuth) => !isAuth || this._router.parseUrl('/')),
    );
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (!this._guardedUrl.has(state.url)) {
      this._guardedUrl.add(state.url);
    }

    return this._store.select(selectIsAuth).pipe(
      distinctUntilChanged(),
      map((isAuth) => !isAuth || this._router.parseUrl('/')),
    );
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  private _init(): void {

    this._store.select(selectIsAuth).pipe(
      distinctUntilChanged(),
    ).subscribe((isAuth) => {
      this._isAuth = isAuth;
      if (isAuth && this._guardedUrl.has(this._location.path())) {
        this._location.back();
      }
    });

    this._subscription = this._location.subscribe(() => {
      if (this._isAuth && this._guardedUrl.has(this._location.path())) {
        this._location.back();
      }
    });

  }

}
