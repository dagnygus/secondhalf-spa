import { Location } from '@angular/common';
/* eslint-disable max-len */
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Injectable,  } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class SignInGuard implements CanActivate, CanLoad {
  private _guardedPaths = new Set<string>();

  constructor(private _bpObs: BreakpointObserver,
              private _location: Location,
              private _router: Router) {
    this._init();
  }

  canLoad(_: Route, segments: UrlSegment[]): boolean | UrlTree {
    const url = '/' + segments.toString().replace(',', '/');

    if (!this._guardedPaths.has(url)) {
      this._guardedPaths.add(url);
    }

    return !this._bpObs.isMatched('(min-width: 580px)') || this._router.parseUrl('/');
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree{
    if (!this._guardedPaths.has(state.url)) {
      this._guardedPaths.add(state.url);
    }

    return !this._bpObs.isMatched('(min-width: 580px)') || this._router.parseUrl('/');
  }

  private _init(): void {
    this._bpObs.observe('(min-width: 580px)').subscribe((state) => {
      if (state.matches && this._guardedPaths.has(this._location.path())) {
        this._router.navigateByUrl('/');
      }
    });
  }

}
