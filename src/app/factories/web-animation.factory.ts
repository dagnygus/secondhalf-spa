/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { isPlatformBrowser } from '@angular/common';
import { ElementRef, forwardRef, Inject, Injectable, Injector, NgZone, PLATFORM_ID, Provider } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UnstableSubject } from '../utils/subjects';

declare const ngDevMode: any;

export interface Mover {

  readonly onDoneStable: Observable<void>;
  readonly onDoneUnstable: Observable<void>;
  readonly onCancelStable: Observable<void>;
  readonly onCancelUnstable: Observable<void>;
  get isActive(): boolean;

  fromTo(from: MovingState, to: MovingState, duration: number): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  fromTo(from: MovingState, to: MovingState, config: MovingOptions): void;

  to(to: MovingState, duration: number): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  to(to: MovingState, config: MovingOptions): void;

  cancel(commitCurrrentStyles?: boolean): void;

}

export interface MovingState {
  [key: string]: string | number | undefined;
}

export interface MovingOptions {
  duration: number;
  delay?: number;
  easing?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
class _MoverImpl implements Mover {

  private _animation: Animation | null = null;
  private _onDoneStable = new Subject<void>();
  private _onDoneUnstable = new UnstableSubject<void>(this._ngZone);
  private _onCancelStable = new Subject<void>();
  private _onCancelUnstable = new UnstableSubject<void>(this._ngZone);

  private _styleToRemove: string[] | null = null;

  readonly onDoneStable = this._onDoneStable.asObservable();
  readonly onDoneUnstable = this._onDoneUnstable.asObservable();
  readonly onCancelStable = this._onCancelStable.asObservable();
  readonly onCancelUnstable = this._onCancelUnstable.asObservable();

  get isActive(): boolean { return !!this._animation; }

  constructor(private readonly _element: Element,
              private readonly _ngZone: NgZone) {}

  fromTo(from: MovingState, to: MovingState, duration: number): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  fromTo(from: MovingState, to: MovingState, config: MovingOptions): void;
  fromTo(from: MovingState, to: MovingState, configOrDuration: any): void {
    if (typeof this._element.animate !== 'function') { return; }

    const config = this._getConfig(configOrDuration);
    this._dipsoseCurrentAnimations();

    from = this._coerceTransitionState(from);
    to = this._coerceTransitionState(to, true);

    this._animation = this._element.animate([from, to], config);
    this._animation.pause();

    this._ngZone.runOutsideAngular(() => {
      this._animation!.onfinish = () => this._onFinishHanler(this._animation);
    });

    this._animation.play();
  }

  to(to: MovingState, configOrDuration: number): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  to(to: MovingState, configOrDuration: MovingOptions): void;
  to(to: MovingState, configOrDuration: any): void {

    if (typeof this._element.animate !== 'function') { return; }

    const config = this._getConfig(configOrDuration);
    this._dipsoseCurrentAnimations();

    to = this._coerceTransitionState(to, true);

    this._animation = this._element.animate(to, config);
    this._animation.pause();

    this._ngZone.runOutsideAngular(() => {
      this._animation!.onfinish = () => this._onFinishHanler(this._animation);
    });

    this._animation.play();
  }

  cancel(commitCurrentStyles = false): void {
    if (this._animation == null) { return; }
    const animation = this._animation;
    this._animation = null;

    if (commitCurrentStyles) {
      this._commitStyles(animation, () => {
        this._styleToRemove = null;
        animation.cancel();
        this._riseOnCancel();
      });
    }
  }

  private _onFinishHanler(animation?: Animation | null | undefined): void {
    if (!animation) { return; }

    this._commitStyles(animation, () => {
      animation.cancel();
      this._animation = null;

      if (this._styleToRemove) {
        for (const style of this._styleToRemove) {
          (this._element as any).style[style] = '';
        }
        this._styleToRemove = null;
      }
      this._riseOnDone();
    });
  }

  private _commitStyles(animation: Animation, cb: () => void): void {
    if (!this._element.closest('body')) { return; }

    try {
      animation.commitStyles();
    } catch {
      if (NgZone.isInAngularZone()) {
        this._ngZone.runOutsideAngular(() => requestAnimationFrame(() => this._commitStyles(animation, cb)));
      } else {
        requestAnimationFrame(() => this._commitStyles(animation, cb));
      }
    }
    cb();
  }

  private _getConfig(configOrDuration: any): any {
    let config: any;
    if (typeof configOrDuration === 'object') {
      config = { ...configOrDuration, fill: 'both' };
    } else {
      config = { duration: configOrDuration, fill: 'both' };
    }
    return config;
  }

  private _riseOnDone(): void {
    this._onDoneStable.next();
    this._onDoneUnstable.next();
  }

  private _riseOnCancel(): void {
    this._onCancelStable.next();
    this._onCancelUnstable.next();
  }

  private _dipsoseCurrentAnimations(): void {
    if (this._animation) {
      this._onFinishHanler(this._animation);
    }

    const animations = this._element.getAnimations();

    if (animations.length === 0) { return; }

    animations.forEach((animation) => {
      animation.commitStyles();
      animation.cancel();
    });
  }

  private _coerceTransitionState(state: MovingState, isLast = false): MovingState {

    if (!this._hasStyleProp(this._element)) { return state; }

    const propsToRetrive: string[] = [];

    Object.keys(state).forEach((key) => {
      if (state[key] !== '*') { return; }
      propsToRetrive.push(key as any);
    });

    if (propsToRetrive.length === 0) { return state; }
    const newState = { ...state } as any;

    const currentPropsValues = {} as any;
    const currentComputetStyle = getComputedStyle(this._element);

    propsToRetrive.forEach((prop) => {
      currentPropsValues[prop] = (currentComputetStyle as any)[prop];
    });

    propsToRetrive.forEach((prop) => {
      (this._element as any).style[prop] = '';
    });

    const newComputedStyle = getComputedStyle(this._element);

    propsToRetrive.forEach((prop) => {
      newState[prop] = (newComputedStyle as any)[prop];
    });

    propsToRetrive.forEach((prop) => {
      (this._element as any).style[prop] = currentPropsValues[prop];
    });

    if (isLast) {
      this._styleToRemove = propsToRetrive;
    }

    return newState;
  }

  private _hasStyleProp(element: any): element is { style: { [key: string]: string } } {
    return typeof element.style === 'object';
  }

}

// eslint-disable-next-line @typescript-eslint/naming-convention
class _SsrMoverImpl implements Mover {
  onDoneStable = new Observable<void>();
  onDoneUnstable = new Observable<void>();
  onCancelStable = new Observable<void>();
  onCancelUnstable = new Observable<void>();
  get isActive(): boolean { return false; }
  fromTo(from: MovingState, to: MovingState, duration: number): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  fromTo(from: MovingState, to: MovingState, config: MovingOptions): void;
  fromTo(_: any, _1: any, _2: any): void { }
  to(to: MovingState, duration: number): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  to(to: MovingState, config: MovingOptions): void;
  to(_: any, _1: any): void { }
  cancel(_?: boolean): void {}

}

@Injectable({
  providedIn: 'root',
  useFactory: (impl: _MovementFactoryImpl) => impl,
  deps: [forwardRef(() =>_MovementFactoryImpl)]
})
export abstract class MovementFactory {
  abstract createFor(target: ElementRef | Element): Mover;
}

@Injectable({ providedIn: 'root' })
class _MovementFactoryImpl extends MovementFactory {

  constructor(private readonly _ngZone: NgZone) { super(); }

  createFor(target: ElementRef<HTMLElement> | Element): Mover {

      let element: any;

      if (typeof (target as ElementRef).nativeElement === 'object') {
        element = (target as ElementRef).nativeElement;
      } else {
        element = target;
      }

      return new _MoverImpl(element, this._ngZone);

  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
// interface _MovementFactoryFn {
//   (ngZone: NgZone, platformId: object): MovementFactory;
//   singletonInstance?: MovementFactory;
// }


// const _movementFactoryFn: _MovementFactoryFn = (ngZone, platformId) => {

//   if (_movementFactoryFn.singletonInstance == null) {
//     _movementFactoryFn.singletonInstance = new _MovementFactoryImpl(ngZone, platformId);
//   }
//   return _movementFactoryFn.singletonInstance;
// };

// export const movementFactoryProvider: Provider = {
//   provide: MovementFactory,
//   useFactory: _movementFactoryFn,
//   deps: [NgZone, PLATFORM_ID],
// };
