/* eslint-disable @typescript-eslint/member-ordering */
import { Attribute, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { ScrollManager } from 'src/app/services/scroll-manager';
import { Easing, getEaseing } from 'src/app/utils/cubik-bezier';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: ':not(a):not(area)[scrollableRouterLink]',
})
export class ScrollableRouterLinkDirective extends RouterLink {

  private _targetId?: string;
  private _minScrollDuration = 350;
  private _maxScrollDuration = 3000;
  private _scrollEasing?: Easing;
  private _scrollDelay: number | null = null;
  private _speed = 2;
  private _side: 'top' | 'bottom' = 'top';
  private _scrollTranslation = 0;
  private _idFromFragment = false;

  @Input() set scrollableRouterLink(commands: any[] | string | null | undefined) {
    this.routerLink = commands;
  }

  @Input() set scrollToId(value: string) {
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

  @Input() set targetIdFromFragment(value: boolean | '') {
    this._idFromFragment = value === '' ? true : value;
  }

  @Input() set targetSide(value: 'top' | 'bottom') {
    this._side = value;
  }

  constructor(router: Router,
              private _route: ActivatedRoute,
              @Attribute('tabindex') tabIntexAttribute: string | null | undefined,
              renderer: Renderer2,
              private scrollManager: ScrollManager,
              el: ElementRef) { super(router, _route, tabIntexAttribute, renderer, el); }

  override onClick(): boolean {
    if (this._targetId) {
      this.scrollManager.scrollOnNavigationEnd(
        this._targetId,
        this._side,
        this._minScrollDuration,
        this._maxScrollDuration,
        this._scrollDelay,
        this._speed,
        this._scrollTranslation,
        this._scrollEasing ? getEaseing(this._scrollEasing) : undefined
      );
    } else if (this._idFromFragment && this.fragment != null) {
      this.scrollManager.scroll(
        this.fragment,
        this._side,
        this._minScrollDuration,
        this._maxScrollDuration,
        this._scrollDelay,
        this._speed,
        this._scrollTranslation,
        this._scrollEasing ? getEaseing(this._scrollEasing) : undefined
      );
    }
    return super.onClick();
  }

}


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'a[scrollableRouterLink],area[scrollableRouterLink]'
})
export class ScrollableRouterLinkWithHrefDirective extends RouterLinkWithHref {

  private _targetId?: string;
  private _minScrollDuration = 350;
  private _maxScrollDuration = 3000;
  private _scrollEasing?: Easing;
  private _scrollDelay: number | null = null;
  private _speed = 2;
  private _side: 'top' | 'bottom' = 'top';
  private _scrollTranslation = 0;
  private _idFromFragment = false;

  @Input() set scrollableRouterLink(commands: any[] | string | null | undefined) {
    this.routerLink = commands;
  }

  @Input() set scrollToId(value: string) {
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

  @Input() set targetIdFromFragment(value: boolean | '') {
    this._idFromFragment = value === '' ? true : value;
  }

  @Input() set targetSide(value: 'top' | 'bottom') {
    this._side = value;
  }

  constructor(router: Router,
              route: ActivatedRoute,
              locationStrategy: LocationStrategy,
              private scrollManager: ScrollManager) {
    super(router, route, locationStrategy);
  }

  override onClick(button: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean): boolean {
    if (this._targetId) {
      this.scrollManager.scrollOnNavigationEnd(
        this._targetId,
        this._side,
        this._minScrollDuration,
        this._maxScrollDuration,
        this._scrollDelay,
        this._speed,
        this._scrollTranslation,
        this._scrollEasing ? getEaseing(this._scrollEasing) : undefined
      );
    } else if (this._idFromFragment && this.fragment != null) {
      this.scrollManager.scroll(
        this.fragment,
        this._side,
        this._minScrollDuration,
        this._maxScrollDuration,
        this._scrollDelay,
        this._speed,
        this._scrollTranslation,
        this._scrollEasing ? getEaseing(this._scrollEasing) : undefined
      );
    }
    return super.onClick(button, ctrlKey, shiftKey, altKey, metaKey);
  }
}
