import { animateElement } from './../../../utils/animation-helper';
/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, ElementRef, EmbeddedViewRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appLazyImage]',
})
export class LazyImageDirective implements OnInit {

  private _initialized = false;
  private _url!: string;

  @Input() set appLazyImage(value: string) {
    this._url = value;
    if (this._initialized) {
      this._update(value);
    }
  }

  @Input() loadingView?: LazyImageLoadingViewDirective;

  constructor(private readonly _renderer: Renderer2,
              private readonly _hostRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {

    const element = this._hostRef.nativeElement;

    this._renderer.listen(element, 'load', () => {

      if (this.loadingView) {
        this.loadingView.loaded();
      }

      if (typeof element.animate !== 'function') { return; }

      animateElement(
        element,
        { opacity: 1, filter: 'blur(0px)' },
        { easing: 'ease-out', duration: 500, fill: 'both' }
      );
    });

    this._update(this._url);
    this._initialized = true;
  }

  private _update(value: string): void {
    if (this.loadingView) {
      this.loadingView.loading();
    }

    this._renderer.setStyle(this._hostRef.nativeElement, 'opacity', 0);
    this._renderer.setStyle(this._hostRef.nativeElement, 'filter', 'blur(6px)');
    this._renderer.setProperty(this._hostRef.nativeElement, 'src', value);
  }

}

@Directive({
  selector: '[appLazyImageLoadingView]',
  exportAs: 'appLazyImageLoadingView'
})
export class LazyImageLoadingViewDirective {

  private _view: EmbeddedViewRef<unknown> | null = null;

  constructor(private readonly _vcRef: ViewContainerRef,
              private readonly _tmpRef: TemplateRef<unknown>) {}

  loading(): void {
    if (this._view) { return; }
    this._view = this._vcRef.createEmbeddedView(this._tmpRef);
  }

  loaded(): void {
    if (!this._view) { return; }
    this._view.destroy();
    this._view = null;
  }
}
