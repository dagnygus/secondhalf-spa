
import { takeUntil } from 'rxjs/operators';
import { pipe, Observable, UnaryFunction, PartialObserver, Subscription } from 'rxjs';
import { Destroyable } from 'src/app/my-package';
import { Disposable } from './disposable';

export function unsubscribeWith<T>(target: Disposable | Destroyable): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(takeUntil((target as any)._dispose$));
}

export function afterAny<T>(observer: ((arg: T) => void) | PartialObserver<T>): UnaryFunction<Observable<T>, Observable<T>> {
  return (sourceObservable$: Observable<T>) => new Observable((subscriber) => {
      let subscription: Subscription;
      if (observer instanceof Function) {
        subscription = sourceObservable$.subscribe((data) => {
          subscriber.next(data);
          observer(data);
        });
      } else {
        subscription = sourceObservable$.subscribe({
          next: (data) => {
            subscriber.next(data);
            observer.next?.call(observer, data);
          },
          complete: () => {
            subscriber.complete();
            observer.complete?.call(observer);
          },
          error: (err) => {
            subscriber.error(err);
            observer.error?.call(observer, err);
          }
        });
      }

      return () => subscription.unsubscribe();
    });
}

export function afterAll<T>(observer: ((arg: T) => void) | PartialObserver<T>): UnaryFunction<Observable<T>, Observable<T>> {
  let refCount = 0;

  return (sourceObservable$: Observable<T>) => {

    let count = 0;

    return new Observable<T>((subscriber) => {
      let subscription: Subscription;
      refCount++;
      if (observer instanceof Function) {

        subscription = sourceObservable$.subscribe((data) => {
          count++;
          subscriber.next(data);

          if (count === refCount) {
            observer(data);
            count = 0;
          }

        });
      } else {
        subscription = sourceObservable$.subscribe({
          next: (data) => {
            count++;
            subscriber.next(data);

            if (count === refCount) {
              observer.next?.call(observer, data);
              count = 0;
            }
          },
          complete: () => {
            count++;
            subscriber.complete();

            if (count === refCount) {
              observer.complete?.call(observer);
              count = 0;
            }
          },
          error: (err) => {
            count++;
            subscriber.error(err);

            if (count === refCount) {
              observer.error?.call(observer, err);
              count = 0;
            }
          }
        });
      }
      return () => {
        refCount--;
        subscription.unsubscribe();
      };
    });
  };
}
// eslint-disable-next-line @typescript-eslint/ban-types
export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
// eslint-disable-next-line @typescript-eslint/ban-types
export type NonFunctionProperties<T> = { [K in keyof T]: T[K] extends Function ? never : K };


// eslint-disable-next-line max-len
export function toProp<T>(next: (value: T) => void): UnaryFunction<Observable<T>, Observable<T>> {
  return (sourceObservable$) => {
    let latestValue: any;
    const firtsEmitted = false;

    return new Observable((subscriber) => {
      const subscription = sourceObservable$.subscribe((value) => {
        if (firtsEmitted && value === latestValue) { return; }
        latestValue = value;
        next(value);
        subscriber.next(value);
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  };
}

// eslint-disable-next-line max-len
export function toggler<T>(resume$: Observable<unknown>, pause$: Observable<unknown>, startResuming?: boolean): UnaryFunction<Observable<T>, Observable<T>> {
  return (sourceObservable$) => new Observable((subscriber) => {

      let resume = startResuming;

      const resumeSubscription = resume$.subscribe(() => {
        resume = true;
      });

      const pauseSubscription = pause$.subscribe(() => {
        resume = false;
      });

      const sourceSubscription = sourceObservable$.subscribe((value) => {
        if (resume) {
          subscriber.next(value);
        }
      });

      return () => {
        sourceSubscription.unsubscribe();
        resumeSubscription.unsubscribe();
        pauseSubscription.unsubscribe();
      };
    });
}

// eslint-disable-next-line max-len
export function sampledToggler<T>(resume$: Observable<unknown>, pause$: Observable<unknown>, startResuming?: boolean): UnaryFunction<Observable<T>, Observable<T>> {
  return (sourceObservable$) => new Observable((subscriber) => {

      let resume = startResuming;
      let latestValue: any;
      let latestValueConsumed = false;

      const resumeSubscription = resume$.subscribe(() => {
        console.log('resume');
        resume = true;
        if (latestValueConsumed) { return; }
        subscriber.next(latestValue);
        latestValueConsumed = true;
      });

      const pauseSubscription = pause$.subscribe(() => {
        console.log('pause');
        resume = false;
      });

      const sourceSubscription = sourceObservable$.subscribe((value) => {
        if (resume) {
          subscriber.next(value);
          latestValueConsumed = true;
        } else {
          latestValue = value;
          latestValueConsumed = false;
        }
      });

      return () => {
        sourceSubscription.unsubscribe();
        resumeSubscription.unsubscribe();
        pauseSubscription.unsubscribe();
      };
    });
}
