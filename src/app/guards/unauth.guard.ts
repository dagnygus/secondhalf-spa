import { Observable, SubscriptionLike } from 'rxjs';
import { Injectable, OnDestroy} from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppState } from '../app.ngrx.utils';
import { Store } from '@ngrx/store';
import { selectIsAuth } from '../state/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class UnauthGourd implements CanActivate, OnDestroy {

  private _guardedUrl: string[] = [];
  private _isAuth = false;
  private _subscription?: SubscriptionLike;

  constructor(private readonly _location: Location,
              private readonly _store: Store<AppState>) {
    this._init();
  }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (!this._guardedUrl.includes(state.url)) {
      this._guardedUrl.push(state.url);
    }

    return this._store.select(selectIsAuth).pipe(
      distinctUntilChanged(),
      map((isAuth) => !isAuth)
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
      if (isAuth && this._guardedUrl.includes(this._location.path())) {
        this._location.back();
      }
    });

    this._subscription = this._location.subscribe(() => {
      if (this._isAuth && this._guardedUrl.includes(this._location.path())) {
        this._location.back();
      }
    });

  }

}
