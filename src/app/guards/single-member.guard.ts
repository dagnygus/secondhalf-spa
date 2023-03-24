import { distinctUntilChanged } from 'rxjs/operators';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../app.ngrx.utils';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SingleMemberGuard implements CanActivate, CanActivateChild, CanLoad {


  constructor(private _location: Location,
              private _store: Store<AppState>,
              private _stateSnapshotService: StateSnapshotService,
              private _activatedRoute: ActivatedRoute) { this._init(); }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const userData = this._stateSnapshotService.getAuthState().userData;
    if (!userData) { return true; }
    const id = segments[segments.length - 1].parameterMap.get('id');
    return userData.userId !== id;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const userData = this._stateSnapshotService.getAuthState().userData;
    if (!userData) { return true; }
    const id = childRoute.paramMap.get('id');
    return userData.userId !== id;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userData = this._stateSnapshotService.getAuthState().userData;
    if (!userData) { return true; }
    const id = route.paramMap.get('id');
    return userData.userId !== id;
  }

  private _init(): void {
    this._store.pipe(
      select(state => state.auth.userData),
      distinctUntilChanged()
    ).subscribe((value) => {
      if (!value) { return; }
      if (!this._location.path().startsWith('/member/')) { return; }

      const id = this._activatedRoute.snapshot.paramMap.get('id');

      if (value.userId === id) { this._location.back(); }
    });
  }

}
