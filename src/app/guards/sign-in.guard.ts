import { ScrollManager } from './../services/scroll-manager';
import { Location } from '@angular/common';
import { AnimationFrame } from './../services/animation-frame';
/* eslint-disable max-len */
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable,  } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class SignInGuard implements CanActivate {
  private _guardedPaths: string[] = [];

  constructor(private _bpObs: BreakpointObserver,
              private _location: Location,
              private _scrollManager: ScrollManager,
              private _router: Router) {
    this._init();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this._guardedPaths.includes(state.url)) {
      this._guardedPaths.push(state.url);
    }

    return !this._bpObs.isMatched('(min-width: 580px)');
  }

  private _init(): void {
    this._bpObs.observe('(min-width: 580px)').subscribe((state) => {
      if (state.matches && this._guardedPaths.includes(this._location.path())) {
        this._router.navigateByUrl('/');
        this._scrollManager.scrollTo({ offestY: 0 });
      }
    });
  }

}
