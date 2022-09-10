/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectorRef, Directive, ElementRef, Input, NgZone, Output, Renderer2, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { ScrollManager } from '../services/scroll-manager';
import { Easing, getEaseing } from '../utils/cubik-bezier';
import { EventEmitter2 } from '../utils/subjects';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[scrollOnClickToId]'
})
export class ScrollOnClickToIdDirective implements OnInit {

  private _targetId?: string;
  private _minScrollDuration = 350;
  private _maxScrollDuration = 3000;
  private _scrollEasing?: Easing;
  private _scrollDelay: number | null = null;
  private _speed = 2;
  private _side: 'top' | 'bottom' = 'top';
  private _scrollDisabled = false;
  private _scrollTranslation = 0;
  private _clickQuery?: string;

  @Input() set scrollOnClickToId(value: string) {
    this._targetId = value;
  }

  @Input() set minScrollDuration(value: number | `${number}`) {
    if (typeof value === 'string') {
      value = +value;
    }

    if (!(Number.isInteger(value) && value > 0)) {
      throw new Error(`[scrollableRouterLink] value '${value}' is incorrect for 'minScrollDuration'. Positive integer is required!`);
    }

    this._minScrollDuration = value;
  }

  @Input() set maxScrollDuration(value: number | `${number}`) {
    if (typeof value === 'string') {
      value = +value;
    }

    if (!(Number.isInteger(value) && value > 0)) {
      throw new Error(`[scrollableRouterLink] value '${value}' is incorrect for 'maxScrollDuration'. Positive integer is required!`);
    }

    this._maxScrollDuration = value;
  }

  @Input() set scrollEaseing(value: Easing) {
    this._scrollEasing = value;
  }

  @Input() set scrollDelay(value: number | `${number}`) {
    if (typeof value === 'string') {
      value = +value;
    }

    if (!(Number.isInteger(value) && value > 0)) {
      throw new Error(`[scrollableRouterLink] value '${value}' is incorrect for 'scrollDelay'. Positive integer is required!`);
    }

    this._scrollDelay = value;
  }

  @Input() set scrollDisabled(value: boolean) {
    this._scrollDisabled = value;
  }

  @Input() set scrollSpeed(value: number | `${number}`) {
    if (typeof value === 'string') {
      value = +value;
    }

    if (!(Number.isInteger(value) && value > 0)) {
      throw new Error(`[scrollableRouterLink] value '${value}' is incorrect for 'scrollSpeed'. Positive integer is required!`);
    }

    this._speed = value;
  }

  @Input() set scrollTranslation(value: number | `${number}`) {
    if (typeof value === 'string') {
      value = +value;
    }

    if (!Number.isInteger(value)) {
      throw new Error(`[scrollableRouterLink] value '${value}' is incorrect for 'scrollTranslation'. Integer is required!`);
    }

    this._scrollTranslation = value;
  }

  @Input() set clickQuery(value: string) { this._clickQuery = value; }

  @Output() scrollDone = new EventEmitter2<void>(this._cd, this._ngZone);

  constructor(private readonly _cd: ChangeDetectorRef,
              private readonly _ngZone: NgZone,
              private readonly _el: ElementRef<HTMLElement>,
              private readonly _renderer: Renderer2,
              private readonly _scrollManager: ScrollManager) { }

  ngOnInit(): void {

    this._ngZone.runOutsideAngular(() => {
      this._renderer.listen(this._el.nativeElement, 'click', (event) => {

        if (this._scrollDisabled) { return; }

        if (this._clickQuery != null) {
          if (typeof event.target.closest !== 'function' || !event.target.closest(this._clickQuery)) {
            return;
          }
        }

        this._scrollManager._scroll(
          this._targetId!,
          this._side,
          this._minScrollDuration,
          this._maxScrollDuration,
          this._scrollDelay,
          this._speed,
          this._scrollTranslation,
          this._riseOnDone,
          this._scrollEasing ? getEaseing(this._scrollEasing) : undefined
        );
      });
    });
  }

  private _riseOnDone = () => this.scrollDone.emit();

}
