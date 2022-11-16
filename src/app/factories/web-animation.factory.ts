/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { ElementRef, forwardRef, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UnstableSubject } from '../utils/subjects';

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

  private _styleToRemove: string[] | null = null;
  private _animation: Animation | null = null;
  onDoneStable = new Subject<void>();
  onDoneUnstable = new UnstableSubject<void>(this._ngZone);
  onCancelStable = new Subject<void>();
  onCancelUnstable = new UnstableSubject<void>(this._ngZone);

  get isActive(): boolean { return this._animation != null; }

  constructor(private readonly _element: Element,
              private readonly _ngZone: NgZone) {}

  fromTo(from: MovingState, to: MovingState, duration: number): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  fromTo(from: MovingState, to: MovingState, config: MovingOptions): void;
  fromTo(from: MovingState, to: MovingState, configOrDuration: any): void {
    if (typeof this._element.animate !== 'function') { return; }
    this._dipsoseCurrentAnimations();
    from = this._coerceTransitionState(from);
    to = this._coerceTransitionState(to, true);
    const config = this._getConfig(configOrDuration);
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
    this._dipsoseCurrentAnimations();
    to = this._coerceTransitionState(to, true);
    const config = this._getConfig(configOrDuration);
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
    this.onDoneStable.next();
    this.onDoneUnstable.next();
  }

  private _riseOnCancel(): void {
    this.onCancelStable.next();
    this.onCancelUnstable.next();
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

    const element = this._element;
    if (!this._hasStyleProp(element)) { return state; }

    const propsToRetrive: string[] = [];

    Object.keys(state).forEach((key) => {
      if (state[key] !== '*') { return; }
      propsToRetrive.push(key as any);
    });

    if (propsToRetrive.length === 0) { return state; }
    const newState = { ...state } as any;

    const currentPropsValues = {} as any;
    const currentComputetStyle = getComputedStyle(element) as any;

    propsToRetrive.forEach((prop) => {
      currentPropsValues[prop] = currentComputetStyle[prop];
      element.style[prop] = '';
    });

    const newComputedStyle = getComputedStyle(element) as any;

    propsToRetrive.forEach((prop) => {
      newState[prop] = newComputedStyle[prop];
      element.style[prop] = currentPropsValues[prop];
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

  createFor(target: ElementRef<Element> | Element): Mover {

      let element: any;

      if (typeof (target as ElementRef).nativeElement === 'object') {
        element = (target as ElementRef).nativeElement;
      } else {
        element = target;
      }

      return new _MoverImpl(element, this._ngZone);

  }
}
