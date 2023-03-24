import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from "@angular/core";
import { createAnimationFrameTimeline } from "../utils/animation-frame-timeline";
import { delay as rxDelay, first, take, takeUntil, tap } from 'rxjs/operators'
import { fromEvent, merge, Subject, Subscription } from "rxjs";

export interface WindowScrollerOptions {
  minDur?: number,
  maxDur?: number,
  easingFn?: (t: number) => number,
  delay?: number,
  speed?: number,
  side?: 'top' | 'bottom',
  addOffset?: number,
  fromCurrentPosition?: boolean;
}



const emptyOptions = {};

function _clamp(min: number, curr: number, max: number) {
  return Math.max(min, Math.min(curr, max));
}

@Injectable({ providedIn: 'root' })
export class WindowScroller implements OnDestroy {
  private _subscription: Subscription | null = null
  private _timeoutId: any = null;
  // private _cachedPosition = 0;
  // private _lastTargetedPosition = 0;
  private _startPosition = 0;
  private _endPosition = 0
  private _lastStartedPosition = 0;

  private readonly _minDuration = 350;
  private readonly _maxDuration = 3000;
  private readonly _easingFn = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);
  private readonly _delay: number | null = null;
  private readonly _speed = 3;
  private readonly _side: 'top' | 'bottom' = 'top';
  private readonly _addOffset = 0;
  private readonly _onFinish = new Subject<void>();
  private readonly _onCancel = new Subject<void>();
  readonly onFinish = this._onFinish.asObservable();
  readonly onCancel = this._onCancel.asObservable();
  private _poped = false;

  constructor(public ngZone: NgZone,
              @Inject(PLATFORM_ID) private _platformId: object) {
    if (!isPlatformBrowser(_platformId)) { return; }
    const defaultView = document.defaultView;
    if (!defaultView) { return; }
    defaultView.addEventListener('popstate', this._onPopstate)
  }

  scroll(target: string | Element | ElementRef<Element>, options: WindowScrollerOptions = emptyOptions): void {
    if (!isPlatformBrowser(this._platformId)) { return; }
    const element = target instanceof ElementRef ? target.nativeElement : target instanceof Element ? target : document.querySelector(target);
    if (element == null) { return; }
    this.cancel();
    const side = options.side ?? this._side;
    const minDur = Math.max(0, options.minDur ?? this._minDuration);
    const maxDur = Math.max(minDur, options.maxDur ?? this._maxDuration);
    let delay = options.delay ?? this._delay;
    if (delay !== null && delay <= 0) { delay = null; }
    const speed = Math.max(1, options.speed ?? this._speed);
    const addOffset = options.addOffset ?? this._addOffset;
    const easingFn = options.easingFn ?? this._easingFn;

    if (NgZone.isInAngularZone()) {
      this.ngZone.runOutsideAngular(() => this._doScrolling(element, side, minDur, maxDur, delay, speed, addOffset, easingFn));
    } else {
      this._doScrolling(element, side, minDur, maxDur, delay, speed, addOffset, easingFn);
    }
  }

  scrollBack(): void {
    this._endPosition = this._poped ? document.documentElement.scrollTop: this._lastStartedPosition;
    if (NgZone.isInAngularZone()) {
      this.ngZone.runOutsideAngular(() => this._doScrolling(null, this._side, this._minDuration, this._maxDuration, this._delay, this._speed, this._addOffset, this._easingFn));
    } else {
      this._doScrolling(null, this._side, this._minDuration, this._maxDuration, this._delay, this._speed, this._addOffset, this._easingFn);
    }
  }

  cancel(): void {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
      this._onCancel.next()
    }
    if (this._subscription !== null) {
      this._subscription.unsubscribe();
      this._subscription = null;
      this._onCancel.next();
    }
  }

  ngOnDestroy(): void {
    this.cancel();
    if (isPlatformBrowser(this._platformId)) {
      window.removeEventListener('popstate', this._onPopstate);
    }
  }

  private _doScrolling(element: Element | null, side: 'top' | 'bottom', minDur: number,
                       maxDur: number, delay: number | null, speed: number,
                       addOffset: number, easingFn: (t: number) => number): void {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId)
      this._timeoutId = null;
    }
    const docElement = document.documentElement;
    const currY = this._lastStartedPosition = this._poped ? this._startPosition : docElement.scrollTop;
    this._poped = false;
    let targetY = element ? element.getBoundingClientRect()[side] + docElement.scrollTop + addOffset : this._endPosition;
    if (!Number.isInteger(targetY)) { targetY = Math.round(targetY); }
    let duration = _clamp(minDur, Math.abs(Math.round((targetY - currY) *  (1 / speed))), maxDur);
    let timeline = createAnimationFrameTimeline({
      from: currY,
      to: targetY,
      duration,
      easingFn
    });

    fromEvent(document, 'pointerdown').pipe(take(1), takeUntil(timeline)).subscribe(() => this.cancel());
    timeline = timeline.pipe(takeUntil(fromEvent(document, 'pointerdown').pipe(take(1), tap(() => this.cancel()))));

    if (delay === null) {
      timeline.subscribe({
        next: (value) => docElement.scrollTop = value,
        complete: () => {
          this._subscription = null;
          this._onFinish.next();
        }
      });
    } else {
      this._timeoutId = setTimeout(() => {
        this._timeoutId = null;
        timeline.subscribe({
          next: (value) => docElement.scrollTop = value,
          complete: () => {
            this._subscription = null;
            this._onFinish.next();
          }
        });
      }, delay)
    }
  }

  private _onPopstate = (e: any) => {
    this._poped = true;
    this._startPosition = document.documentElement.scrollTop;
  }
}
