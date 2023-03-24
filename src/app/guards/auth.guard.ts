import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
// eslint-disable-next-line max-len
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRoute, } from '@angular/router';
import { Location } from '@angular/common';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppState } from '../app.ngrx.utils';
import { Store } from '@ngrx/store';
import { selectIsAuth } from '../state/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  private _guardedPaths: Set<string> = new Set();


  constructor(private readonly _router: Router,
              private readonly _location: Location,
              private readonly _store: Store<AppState>,
              private readonly _brkObserver: BreakpointObserver) {
    this._init();
  }

  canLoad(_: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {

    const url = '/' + segments.toString().replace(',', '/');

    if (!this._guardedPaths.has(url)) {
      this._guardedPaths.add(url);
    }

    return this._store.select(selectIsAuth).pipe(
      map((isAuth) => isAuth || this._router.parseUrl('/signin'))
    );
  }

  canActivateChild(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    if (!this._guardedPaths.has(state.url)) {
      this._guardedPaths.add(state.url);
    }

    return this._store.select(selectIsAuth).pipe(
      map((isAuth) => isAuth || this._router.parseUrl('/signin'))
    );
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    if (!this._guardedPaths.has(state.url)) {
      this._guardedPaths.add(state.url);
    }

    return this._store.select(selectIsAuth).pipe(
      map((isAuth) => isAuth || this._router.parseUrl('/signin'))
    );
  }

  private _init(): void {
    this._store.select(selectIsAuth).pipe(
      distinctUntilChanged(),
    ).subscribe((isAuth) => {

      if (!isAuth && this._guardedPaths.has(this._location.path())) {
        if (this._brkObserver.isMatched('(min-width: 580px)')) {
          this._router.navigateByUrl('/');
        } else {
          this._router.navigateByUrl('/signin');
        }
      }
    });
  }

}
