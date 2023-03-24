import { coerceToNonNegativeNumber } from './coerction-and-types';
import { Observable } from "rxjs";

export interface AnimationFrameTimelineOptions {
  from: number;
  to: number;
  duration: number;
  easingFn?: (t: number) => number;
  count?: number | 'infinite';
  reverse?: boolean;
}

export const createAnimationFrameTimeline: (options: AnimationFrameTimelineOptions) => Observable<number> = (options) => {

  if (typeof requestAnimationFrame !== 'function') {
    return new Observable((obsever) => obsever.complete())
  }

  return new Observable((observer) => {
    let unsubscribed = false;

      let from = options.from;
      let to = options.to;
      let delta = to - from;
      const easingFn = options.easingFn ? options.easingFn : (t: number) => t;
      const duration = coerceToNonNegativeNumber(options.duration);
      const reverse = options.reverse == null ? false : options.reverse;
      let count = options.count ? options.count : 1;
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
            requestAnimationFrame(internalHandler);
            return;
          }
          i++;
          if (i < count) {
            startTime = performance.now();
            if (swap) {
              swap();
            }
            requestAnimationFrame(internalHandler);
            return;
          }
          observer.complete();
          return;
        }
        observer.next(from + delta * easingFn(t / duration));
        requestAnimationFrame(internalHandler);
      };

      requestAnimationFrame(internalHandler);

      return () => unsubscribed = true;
  })
}
