/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { linearEasing } from '../utils/cubik-bezier';

export type TimedLoopOptions = {
  from: number;
  to: number;
  duration: number;
  easingFn?: (t: number) => number;
  count?: number | 'infinite';
  reverse?: boolean;
};

@Injectable({ providedIn: 'root' })
export class AnimationFrame {

  private _isBrowserEnv: boolean;
  private _hiddenStr: string | null;

  get tabHidden(): boolean { return this._hiddenStr === null ? true : (document as any).hidden; }

  constructor(private readonly _ngZone: NgZone) {

    this._isBrowserEnv = typeof window === 'object' &&
                         typeof window.document === 'object' &&
                         typeof window.requestAnimationFrame === 'function';


    if (this._isBrowserEnv) {
      if (typeof (document as any).hidden !== undefined) {
        this._hiddenStr = 'hidden';
      } else if (typeof (document as any).msHidden  !== undefined) {
        this._hiddenStr = 'msHidden';
      } else if (typeof (document as any).webkitHidden  !== undefined) {
        this._hiddenStr = 'webkitHidden';
      } else if (typeof (document as any).mozHidden  !== undefined) {
        this._hiddenStr = 'mozkitHidden';
      } else {
        this._hiddenStr = null;
      }
    } else {
      this._hiddenStr = null;
    }

  }

  request(handler: () => void): number {
    if (!this._isBrowserEnv) { return 0; }
    return requestAnimationFrame(handler);
  }

  zonelessRequest(handler: () => void): number {
    if (!this._isBrowserEnv) { return 0; }

    if (NgZone.isInAngularZone()) {
      return this._ngZone.runOutsideAngular(() => requestAnimationFrame(handler));
    } else {
      return requestAnimationFrame(handler);
    }
  }

  safeRequest(handler: () => void): number | string {
    if (!this._isBrowserEnv) { return 0; }
    if (this.tabHidden) {
      const timeoutId = setTimeout(handler, 10) as any as number;
      return timeoutId.toString();
    }
    return requestAnimationFrame(handler);
  }

  safeZonlessRequest(handler: () => void): number | string {
    if (!this._isBrowserEnv) { return 0; }

    if (this.tabHidden) {
      let timeoutId: number;

      if (NgZone.isInAngularZone()) {
        timeoutId = this._ngZone.runOutsideAngular(() => setTimeout(handler, 15)) as any as number;
      } else {
        timeoutId = setTimeout(() => handler, 15) as any as number;
      }
      return timeoutId.toString();
    }

    return this.zonelessRequest(handler);
  }

  timedLoop(arg: TimedLoopOptions): Observable<number> {
    if (!this._isBrowserEnv) { return new Observable(); }
    if (!Number.isInteger(arg.duration)) {
      throw new Error('the duration property must be an integer!');
    }

    return new Observable((observer) => {
      let unsubscribed = false;

      let from = arg.from;
      let to = arg.to;
      let delta = to - from;
      const easingFn = arg.easingFn ? arg.easingFn : linearEasing;
      const duration = arg.duration;
      const reverse = arg.reverse == null ? false : arg.reverse;
      let count = arg.count ? arg.count : 1;
      if (typeof count === 'number' && reverse) {
        count *= 2;
      }

      let i = 0;
      let swap: () => void | undefined;

      if (reverse) {
        swap = () => {
          const temp = from;
          from = to;
          to = temp;
          delta = to - from;
        };
      }

      let startTime = performance.now();
      const internalHandler = () => {
        if (unsubscribed) {
          return;
        }

        const t = performance.now() - startTime;
        if (t >= duration) {
          observer.next(to);
          if (count === 'infinite') {
            startTime = performance.now();
            if (swap) {
              swap();
            }
            this.zonelessRequest(internalHandler);
            return;
          }
          i++;
          if (i < count) {
            startTime = performance.now();
            if (swap) {
              swap();
            }
            this.zonelessRequest(internalHandler);
            return;
          }
          observer.complete();
          return;
        }
        observer.next(from + delta * easingFn(t / duration));
        this.zonelessRequest(internalHandler);
      };

      this.zonelessRequest(internalHandler);

      return () => unsubscribed = true;
    });
  }

  cancel(id: number | string): void {
    if (!this._isBrowserEnv) { return ; }
    // eslint-disable-next-line use-isnan, eqeqeq
    if (typeof id === 'number') {
      cancelAnimationFrame(id);
    } else {
      const parsed = +id;

      if (!Number.isInteger(parsed)) {
        throw new Error(`Invalid animation frame id! provided value '${id}' is incorect!`);
      }

      clearTimeout(+id);
    }
  }

  timeout(miliseconds: number): Observable<void> {

    if (miliseconds < 0) {
      throw new Error('An argument of \'timeout()\ method can not be negative or NaN!');
    }

    return new Observable((observer) => {
      let unsubscribed = false;
      const startTime = performance.now();

      const internalHandler = () => {
        if (unsubscribed) { return; }
        const t = performance.now() - startTime;
        if (t > miliseconds) { return; }
        observer.next();
        observer.complete();
        this.zonelessRequest(internalHandler);
      };

      return () => unsubscribed = true;
    });
  }

  interval(miliseconds: number, count?: number): any {
    if (miliseconds < 0) {
      throw new Error('First argument of \'interval()\ method can not be negative or NaN!');
    }

    if (count != null) {
      if (!(Number.isInteger(count) && count > 0)) {
        throw new Error('Second argument of \'interval()\ method must be an integer greater then 0!');
      }

      return new Observable((observer) => {
        let unsubscribed = false;
        let i = 0;
        let startTime = performance.now();

        const handler = () => {
          if (unsubscribed) { return; }
          const currentTime = performance.now();
          if (currentTime - startTime > miliseconds) {
            startTime = currentTime;
            observer.next();
            i++;

            if (i >= count) {
              observer.complete();
              return;
            }
          }

          this.zonelessRequest(handler);
        };

        this.zonelessRequest(handler);
        return () => unsubscribed = true;
      });
    }

    return new Observable((observer) => {
      let unsubscribed = false;
      let startTime = performance.now();

      const handler = () => {
        if (unsubscribed) { return; }
        const currentTime = performance.now();
        if (currentTime - startTime > miliseconds) {
          startTime = currentTime;
          observer.next();
        }

        this.zonelessRequest(handler);
      };

      this.zonelessRequest(handler);
      return () => unsubscribed = true;
    });
  }
}
