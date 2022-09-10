/* eslint-disable @typescript-eslint/member-ordering */
import { Mover } from 'src/app/factories/web-animation.factory';
import { Directive, ElementRef, EmbeddedViewRef, Input, NgZone, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { MovementFactory } from '../factories/web-animation.factory';

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
              private readonly _ngZone: NgZone,
              private readonly _hostRef: ElementRef,
              private readonly _movementFactory: MovementFactory) { }

  ngOnInit(): void {

    const mover = this._movementFactory.createFor(this._hostRef);

    this._ngZone.runOutsideAngular(() => {
      this._renderer.listen(this._hostRef.nativeElement, 'load', () => {

        if (this.loadingView) {
          this.loadingView.loaded();
        }

        mover.to({
          opacity: 1,
          filter: 'blur(0px)'
        }, {
          duration: 500,
          easing: 'ease-out'
        });
      });
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
    this._view.detectChanges();
    this._view = null;
  }
}
