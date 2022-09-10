
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { first } from 'rxjs/operators';
import { AnimationFrame } from './animation-frame';
import { Injectable, NgZone, } from '@angular/core';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { easeOutCubic } from '../utils/cubik-bezier';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

interface ScrollToOptions {
  offestY: number;
  minDuration?: number;
  maxDuration?: number;
  delay?: number;
  speed?: number;
  easingFn?: (t: number) => number;
}

@Injectable({ providedIn: 'root' })
export class ScrollManager {
  private readonly _targets = new Map<string, Element>();

  private _minDuration = 350;
  private _maxDuration = 3000;
  private _easingFn = easeOutCubic;
  private _delay: number | null = null;
  private _speed = 2;
  private _currentTargetId: string | null = null;
  private _side: 'top' | 'bottom' = 'bottom';
  private _delayTimeoutId: any = null;
  private _subscription?: Subscription;
  private _subscription2?: Subscription;
  private _navigating = false;
  private _allowScrolling = false;
  private _translation = 0;
  private _globalTarget?: Element;
  private _firstSkiped = false;
  private _noGlobalTarget = false;
  private _isBrowser = typeof window === 'object' && typeof window.document === 'object';
  private _prevent = false;
  private _currentPathname: string | null = null;
  private _currentQuery:  string | null = null;


  constructor(private readonly _ngZone: NgZone,
              private readonly _animationFrame: AnimationFrame,
              router: Router,) {

    this._ngZone.onStable.subscribe(() => {
      if ((this._currentTargetId != null || this._globalTarget != null) && this._allowScrolling) {
        this._doScrolling();
        this._reset();
        this._allowScrolling = false;
        return;
      }
      if (this._currentTargetId != null && !this._navigating) {
        this._reset();
      }
    });

    router.events.subscribe((event) => {
      if (this._prevent) { return; }

      if (event instanceof NavigationStart) {
        this._navigating = true;
        if (this._delayTimeoutId !== null) {
          clearTimeout(this._delayTimeoutId);
          this._delayTimeoutId = null;
        }

        this._subscription?.unsubscribe();
      }

      if (event instanceof NavigationEnd) {
        this._navigating = false;
        if (this._currentTargetId === null && this._globalTarget == null) { return; }
        if (typeof location !== 'undefined') {
          if (location.pathname === this._currentPathname && location.search === this._currentQuery) {
            return;
          } else {
            this._currentPathname = location.pathname;
            this._currentQuery = location.search;
          }
        }
        this._allowScrolling = true;
        return;
      }

      if (event instanceof NavigationCancel) {
        if (this._currentTargetId === null) { return; }
        this._navigating = false;
        this._reset();
        return;
      }
    });

    _ngZone.onStable.pipe(first()).subscribe(() => {
      if (this._globalTarget == null) {
        this._noGlobalTarget = true;
      }
    });
  }

  setTarget(id: string, target: Element): void;
  setTarget(id: string, target: any): void {
    if (!this._isBrowser) { return; }

    if (!_isElement(target)) {
      throw new Error('[scrollTargetId] scroll target must be an instace of Element!');
    }

    if (this._targets.has(id)) {
      throw new Error('[scrollTargetId] duplicated id!');
    }

    this._targets.set(id, target);
  }

  removeTarget(id: string): void {
    if (this._targets.has(id)) {
      this._targets.delete(id);
    }
  }

  setGlobalTarget(element: any): void {
    if (this._noGlobalTarget) {
      throw new Error('[globalScrollNavigationTarget] directive can not be instacieted long after application start!');
    }

    if (!this._isBrowser) { return; }

    if (!_isElement(element)) {
      throw new Error('[globalScrollNavigationTarget] global target must be an instace of Element!');
    }

    this._globalTarget = element;
  }

  _scroll(id: string, side: 'top' | 'bottom', minDur: number,
         maxDur: number, delay: number | null, speed: number,
         translation: number,
         doneCb?: (() => void) | null | undefined, easingFn?: ((t: number) => number) | null | undefined): void {

    if (this._delayTimeoutId !== null) {
      clearTimeout(this._delayTimeoutId);
      this._delayTimeoutId = null;
    }

    this._side = side;
    this._minDuration = minDur;
    this._maxDuration = maxDur;
    this._delay = delay;
    this._speed = speed;
    this._translation = translation;
    this._easingFn = easingFn ? easingFn : easeOutCubic;
    this._currentTargetId = id;

    this._doScrolling(doneCb);
  }

  scroll(id: string, side: 'top' | 'bottom', minDur: number,
         maxDur: number, delay: number | null, speed: number,
         translation: number, easingFn?: ((t: number) => number) | null | undefined): void {

    const target = this._targets.get(id);

    if (target == null) { return; }

    let offsetY: number;
    if (side === 'top') {
      offsetY = target.getBoundingClientRect().top + window.scrollY + translation;
    } else {
      offsetY = target.getBoundingClientRect().bottom + window.scrollY + translation;
    }

    if (!Number.isInteger(offsetY)) {
      offsetY = Math.round(offsetY);
    }

    const currentOffsetY = window.scrollY;
    const currentOffsetX = window.scrollX;

    let duration = Math.abs(Math.round((offsetY - currentOffsetY) * (1 / speed)));
    duration = duration < minDur ? minDur : duration > maxDur ? maxDur : duration;

    const timedLoop$ = this._animationFrame.timedLoop({
      from: currentOffsetY,
      to: offsetY,
      duration,
      easingFn: easingFn ? easingFn : easeOutCubic
    });

    if (delay !== null) {
      if (this._delayTimeoutId != null) {
        clearTimeout(this._delayTimeoutId);
      }

      this._ngZone.runOutsideAngular(() => {
        this._delayTimeoutId = setTimeout(() => {
          this._subscription2 = timedLoop$.subscribe((val) => window.scrollTo(currentOffsetX, val));
          this._delayTimeoutId = null;
        }, delay);
      });
    } else {
      this._subscription2 = timedLoop$.subscribe((val) => window.scrollTo(currentOffsetX, val));
    }
  }

  scrollTo(scrollToOptions: ScrollToOptions): void {
    if (!this._isBrowser) { return; }

    const minDurr = scrollToOptions.minDuration != null ? scrollToOptions.minDuration : 350;
    let maxDurr = scrollToOptions.maxDuration != null ? scrollToOptions.maxDuration : 3000;

    if (minDurr < 0 || !Number.isInteger(minDurr)) {
      throw new Error('ScrollManager::scrollTo - minDuration must be a positive integer?');
    }

    if (maxDurr < 0 || !Number.isInteger(maxDurr)) {
      throw new Error('ScrollManager::scrollTo - maxDuration must be a positive integer?');
    }

    maxDurr = maxDurr < minDurr ? minDurr : maxDurr;

    const speed = scrollToOptions.speed != null ? scrollToOptions.speed : 2;

    if (speed < 0 || !Number.isInteger(speed)) {
      throw new Error('ScrollManager::scrollTo - speed must be a positive integer?');
    }

    const easingFn = scrollToOptions.easingFn != null ? scrollToOptions.easingFn : easeOutCubic;

    const offsetY = scrollToOptions.offestY;
    const currentOffsetY = window.scrollY;
    const currentOffsetX = window.scrollX;
    let duration = Math.abs(Math.round((offsetY - currentOffsetY) * (1 / speed)));

    duration = duration < minDurr ? minDurr : duration > maxDurr ? maxDurr : duration;

    const timedLoop$ = this._animationFrame.timedLoop({
      from: currentOffsetY,
      to: offsetY,
      duration,
      easingFn
    });

    this._prevent = true;

    timedLoop$.subscribe({
      next: (val) => window.scrollTo(currentOffsetX, val),
      complete: () => this._prevent = false,
    });
  }

  scrollOnNavigationEnd(id: string, side: 'top' | 'bottom', minDur: number,
                        maxDur: number, delay: number | null, speed: number,
                        translation: number,
                        easingFn?: ((t: number) => number) | null | undefined): void {
    if (this._ngZone.isStable) { return; }
    this._side = side;
    this._minDuration = minDur;
    this._maxDuration = maxDur;
    this._delay = delay;
    this._speed = speed;
    this._translation = translation;
    this._easingFn = easingFn ? easingFn : easeOutCubic;
    this._currentTargetId = id;
  }

  private _reset(): void {
    this._side = 'top';
    this._minDuration = 350;
    this._maxDuration = 3000;
    this._easingFn = easeOutCubic;
    this._delay = null;
    this._speed = 2;
    this._currentTargetId = null;
    this._translation = 0;
  }

  private _doScrolling(doneCb?: (() => void) | null | undefined): void {
    if (!this._targets.has(this._currentTargetId!) && this._globalTarget == null) {
      this._reset();
      return;
    }
    const target = this._targets.get(this._currentTargetId!) ?? this._globalTarget!;

    if (target === this._globalTarget && !this._firstSkiped) {
      this._firstSkiped = true;
      this._reset();
      return;
    }

    const currX = window.scrollX;
    const currY = window.scrollY;
    let targetY: number;

    if (this._side === 'top') {
      targetY = target.getBoundingClientRect().top + window.scrollY;
    } else {
      targetY = target.getBoundingClientRect().bottom + window.scrollY;
    }

    targetY += this._translation;

    if (!Number.isInteger(targetY)) {
      targetY = Math.round(targetY);
    }

    let duration = Math.abs(Math.round((targetY - currY) * (1 / this._speed)));
    duration = duration < this._minDuration ? this._minDuration : duration > this._maxDuration ? this._maxDuration : duration;

    const timedLoop$ = this._animationFrame.timedLoop({
      from: currY,
      to: targetY,
      duration,
      easingFn: this._easingFn
    });

    if (this._delay !== null) {
      const delay = this._delay;
      this._ngZone.runOutsideAngular(() => {
        this._delayTimeoutId = setTimeout(() => {
          this._subscription2?.unsubscribe();
          this._subscription = timedLoop$.subscribe({
            next: (val) => window.scrollTo(currX, val),
            complete: () => {
              if (doneCb) { doneCb(); }
            }
          });
          this._delayTimeoutId = null;
        }, delay);
      });
    } else {
      this._subscription2?.unsubscribe();
      this._subscription = timedLoop$.subscribe({
        next: (val) => window.scrollTo(currX, val),
        complete: () => {
          if (doneCb) { doneCb(); }
        }
      });
    }
  }
}

function _isElement(value: any): value is Element {
  return typeof value === 'object'
         && typeof value.tagName === 'string'
         && typeof value.nodeName === 'string'
         && typeof value.getBoundingClientRect === 'function' &&
         _isInheritFromElement(value);
}

function _isInheritFromElement(value: object): boolean {
  const constructor = Object.getPrototypeOf(value).constructor;
  return constructor.name === 'Element' ? true : constructor.name === 'Object' ? false : _isInheritFromElement(constructor.prototype);
}

