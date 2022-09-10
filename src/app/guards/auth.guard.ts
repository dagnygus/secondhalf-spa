import { ScrollManager } from './../services/scroll-manager';
import { BreakpointObserver } from '@angular/cdk/layout';
import { unsubscribeWith } from 'src/app/my-package/core/rxjs-operators';
import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { Destroyable } from './../my-package/core/destroyable';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Location } from '@angular/common';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { AppState } from '../app.ngrx.utils';
import { Store } from '@ngrx/store';
import { selectIsAuth } from '../state/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

  private static fallbackUrl = '/signin';

  private _guardedPaths: string[] = [];


  constructor(private readonly _router: Router,
              private readonly _location: Location,
              private readonly _store: Store<AppState>,
              private readonly _brkObserver: BreakpointObserver,
              private readonly _scrollManager: ScrollManager) {
    this._init();
  }
  canActivateChild(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (!this._guardedPaths.includes(state.url)) {
      this._guardedPaths.push(state.url);
    }

    return this._store.select(selectIsAuth).pipe(
      map((isAuth) => isAuth || this._router.parseUrl('/signin'))
    );
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    if (!this._guardedPaths.includes(state.url)) {
      this._guardedPaths.push(state.url);
    }

    return this._store.select(selectIsAuth).pipe(
      map((isAuth) => isAuth || this._router.parseUrl('/signin'))
    );
  }

  private _init(): void {
    this._store.select(selectIsAuth).pipe(
      distinctUntilChanged(),
    ).subscribe((isAuth) => {
      console.log(isAuth);
      if (!isAuth && this._guardedPaths.includes(this._location.path())) {
        if (this._brkObserver.isMatched('(min-width: 580px)')) {
          this._scrollManager.scrollTo({ offestY: 0 });
          this._router.navigateByUrl('/');
        } else {
          this._router.navigateByUrl('/signin');
        }
      }
    });
  }

}
