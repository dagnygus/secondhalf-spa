import { merge, Subscription, fromEvent } from 'rxjs';
import { OnInit, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, NgZone, Input } from '@angular/core';
import { animateElement, AnimationOptions } from 'src/app/utils/animation-helper';


@Directive({
  selector: '[appFadeInViewport]'
})
export class FadeInViewportDirective implements OnInit, OnDestroy, OnChanges {

  private _threshold = 0;
  private _subscription?: Subscription;
  private _currentIntersectionRatio = 0;
  private _offsetY = 0;
  private _debounceTime = 0;
  private _animationOptions: AnimationOptions | null = null;

  @Input() set appFadeInViewport(value: number | `${number}` | '') {
    this._threshold = typeof value === 'number' ? value : value === '' ? 0 : +value;
    this._threshold = this._threshold < 0 ? 0 : this._threshold > 1 ? 1 : this._threshold;
  }

  @Input() appFadeInViewportFrom: 'center' | 'left' | 'right' | 'up' | 'down' = 'center';

  @Input() set appFadeInViewportOffsetY(value: number | `${number}`) {
    this._offsetY = typeof value === 'number' ? value : +value;
  }

  @Input() set debounceTime(value: number | `${number}`) {
    this._debounceTime = typeof value === 'number' ? value : +value;
    if (this._animationOptions != null) {
      this._animationOptions.duration = this._debounceTime;
    }
  }

  constructor(private _ngZone: NgZone,
              private _hostEl: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    const element = this._hostEl.nativeElement;
    if (typeof element.animate !== 'function') { return; }

    this._ngZone.runOutsideAngular(() => {
      this._setupInitialStyles(element);
      this._update(element);

      this._subscription = merge(
        fromEvent(window, 'scroll'),
        fromEvent(window, 'resize')
      ).subscribe(() => this._update(element));
    });

  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!(typeof window === 'object' && typeof window.document === 'object')) { return; }
    let shouldUpdate = false;
    Object.keys(changes).forEach((key) => {
      if (!changes[key].isFirstChange()) {
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      this._update(this._hostEl.nativeElement);
    }
  }

  private _update(element: HTMLElement): void {
    const intersectionRatio = this._getIntersectionRatio(element);

    if (this._currentIntersectionRatio === intersectionRatio) { return; }
    this._currentIntersectionRatio = intersectionRatio;

    const keyframe = this._getAnimationKeyframe(intersectionRatio);

    if (this._debounceTime === 0) {
      if (this._animationOptions != null) {
        this._animationOptions = null;
      }
      Object.keys(keyframe).forEach((key) => {
        (element.style as any)[key] = typeof keyframe[key] === 'string' ? keyframe[key] : keyframe[key].toString();
      });
    } else {
      if (this._animationOptions == null) {
        this._animationOptions = { duration: this._debounceTime, easing: 'ease-in-out', fill: 'both' };
      }
      animateElement(element, keyframe, this._animationOptions);
    }
  }

  private _getIntersectionRatio(element: HTMLElement): number {
    const bottomOffset = window.scrollY + window.innerHeight;
    const elementOffset = window.scrollY + element.getBoundingClientRect().y + this._offsetY;
    const elementHeight = element.offsetHeight;
    // eslint-disable-next-line max-len
    let intersectionRatio = (bottomOffset - (elementOffset + elementHeight * this._threshold)) / (elementHeight - elementHeight * this._threshold);
    intersectionRatio = Math.max(0, Math.min(intersectionRatio, 1));
    // intersectionRatio = intersectionRatio < 0 ? 0 : intersectionRatio > 1 ? 1 : intersectionRatio;

    return intersectionRatio;
  }

  private _setupInitialStyles(element: HTMLElement): void {
    switch (this.appFadeInViewportFrom) {
      case 'center':
        element.style.opacity = '0';
        return;
      case 'down':
        element.style.opacity = '0';
        element.style.transform = 'translateY(100%)';
        return;
      case 'up':
        element.style.opacity = '0';
        element.style.transform = 'translateY(-100%)';
        return;
      case 'left':
        element.style.opacity = '0';
        element.style.transform = 'translateX(-100%)';
        return;
      case 'right':
        element.style.opacity = '0';
        element.style.transform = 'translateX(100%)';
        return;
    }
  }

  private _getAnimationKeyframe(intersectionRatio: number): { [key: string]: string | number } {
    switch (this.appFadeInViewportFrom) {
      case 'center':
        return { opacity: intersectionRatio };
      case 'down':
        return { opacity: intersectionRatio, transform: `translateY(${100 * (1 - intersectionRatio)}%)` };
      case 'up':
        return { opacity: intersectionRatio, transform: `translateY(-${100 * (1 - intersectionRatio)}%)` };
      case 'left':
        return { opacity: intersectionRatio, transform: `translateX(-${100 * (1 - intersectionRatio)}%)` };
      case 'right':
        return { opacity: intersectionRatio, transform: `translateX(${100 * (1 - intersectionRatio)}%)` };
      default:
        return null!;
    }
  }
}
