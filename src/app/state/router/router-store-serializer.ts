import { startWith } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppState } from './../../app.ngrx.utils';
import { Params, Route, RouterStateSnapshot } from "@angular/router";
import { RouterReducerState, RouterStateSerializer } from "@ngrx/router-store";
import { Store, select } from '@ngrx/store';
import { BaseStateRef } from '../utils';

export interface RouterStateData {
  fragment: string | null;
  url: string;
  params: Params;
  queryParams: Params;
  fullPath: string;
}

export interface RouterStateUrl extends RouterStateData  {
  prevData: RouterStateData | null;
}

interface SerialzerPrivates {
  _currentUrl: string;
  _currentParams: Params;
  _currentQueryParams: Params;
  _currentFragment: string | null;
  _currentFullPath: string;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {

  private _emptyParams: Params = {};

  _currentUrl: string | null = null;
  _currentParams: Params | null = null;
  _currentQueryParams: Params | null = null;
  _currentFragment: string | null = null;
  _currentFullPath: string | null = null;

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let fullPath = '';
    let prevData: RouterStateData | null = null;
    let params: Params = {};

    if (this._hasCurrent()) {

      prevData = {
        fragment: this._currentFragment,
        url: this._currentUrl,
        params: this._currentParams,
        queryParams: this._currentQueryParams,
        fullPath: this._currentFullPath
      }
    }

    let route = routerState.root;
    if (route.routeConfig) {
      fullPath = _concatPaths(fullPath, route.routeConfig);
    }

    const stack = [route]

    while (stack.length > 0) {
      const r = stack.pop()!;
      params = { ...params, ...r.params }
      stack.push(...r.children);
    }

    while (route.firstChild) {
      route = route.firstChild;
      if (route.routeConfig) {
        fullPath = _concatPaths(fullPath, route.routeConfig);
      }
    }


    if (params == null) { params = this._emptyParams; }

    const {
      url,
      root: { queryParams, fragment },
    } = routerState;

    const returnResult = {
      url, params, queryParams, fragment, fullPath, prevData
    }

    this._currentUrl = url;
    this._currentParams = params;
    this._currentQueryParams = queryParams;
    this._currentFragment = fragment;
    this._currentFullPath = fullPath;

    return returnResult;
  }

  private _hasCurrent(): this is this & SerialzerPrivates {
    return this._currentUrl !== null;
  }

}

function _concatPaths(currentPath: string, route: Route): string {
  if (route.path == null || route.path.length === 0) { return currentPath; }


  const endedWithSlash = currentPath.endsWith('/');
  const startedWithSlash = route.path.startsWith('/');

  if (currentPath.length === 0) {
    if (startedWithSlash) {
      return route.path.substring(1);
    }
    return route.path;
  }

  if (!(endedWithSlash || startedWithSlash)) {
    return currentPath + '/' + route.path;
  } else if ((!endedWithSlash && startedWithSlash) || (endedWithSlash && !startedWithSlash)) {
    return currentPath + route.path;
  } else {
    return currentPath.substring(0, currentPath.length - 2) + route.path.substring(1);
  }
}

@Injectable({ providedIn: 'root' })
export class RouterStateRef extends BaseStateRef<RouterStateUrl> {

  private _navId = 0;
  get navigationId(): number { return this._navId }

  constructor(store: Store<AppState>) {

    const startigValue: RouterStateUrl = {
      fullPath: '',
      url: '/',
      fragment: null,
      params: {},
      queryParams: {},
      prevData: null
    }

    const source = store.pipe(
      select(({ router }) => {
        if (router) {
          this._navId = router.navigationId;
        }
        return router?.state ?? startigValue
      })
    )

    super(source)
  }
}
