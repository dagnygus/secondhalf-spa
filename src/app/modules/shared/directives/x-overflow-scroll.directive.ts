import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Renderer2, NgZone, AfterContentInit } from '@angular/core';

@Directive({
  selector: '[appXOverflowScroll]'
})
export class XOverflowScrollDirective implements AfterContentInit {

  constructor(private _el: ElementRef<HTMLElement>,
              private _renderer: Renderer2,
              private _ngZone: NgZone) { }

  ngAfterContentInit(): void {
    if (!(typeof window === 'object' && typeof window.document === 'object')) { return; }

    this._update();

    this._ngZone.runOutsideAngular(() => {
      this._renderer.listen(window, 'resize', () => this._update());
      const mutObserver = new MutationObserver(() => this._update());
      mutObserver.observe(this._el.nativeElement, { childList: true });
    });
  }

  private _update(): void {
    const nativeEl = this._el.nativeElement;
    nativeEl.style.overflowY = 'visible';
    nativeEl.style.maxHeight = 'unset';
    nativeEl.style.height = 'unset';
    const visibleHeight = nativeEl.clientHeight;
    nativeEl.style.overflowY = 'hidden';
    nativeEl.style.maxHeight = '';
    nativeEl.style.height = '';
    const hiddenHeight = nativeEl.clientHeight;

    if (visibleHeight > hiddenHeight) {
      nativeEl.style.overflowY = 'scroll';
      nativeEl.style.alignContent = 'unset';
    } else {
      nativeEl.style.overflowY = 'hidden';
      nativeEl.style.alignContent = '';
    }
  }

}
