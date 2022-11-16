import { ScrollManager } from './../../../services/scroll-manager';
import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[globalScrollNavigationTarget]'
})
export class GlobalScrollNavigationTargetDirective implements OnInit, OnDestroy {

  private static _isInstacieted = false;

  constructor(private readonly _el: ElementRef,
              private readonly _scrollManager: ScrollManager) {
    if (GlobalScrollNavigationTargetDirective._isInstacieted) {
      throw new Error('[globalScrollNavigationTarget] only one instance allowed!');
    }

    GlobalScrollNavigationTargetDirective._isInstacieted = true;
  }

  ngOnInit(): void {
    this._scrollManager.setGlobalTarget(this._el.nativeElement);
  }

  ngOnDestroy(): void {
      throw new Error('[globalScrollNavigationTarget] directive can not be a temporary instance!');
  }
}
