import { LoadingSpinnerComponent } from '../modules/shared/components/loading-spinner/loading-spinner.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayPositionBuilder, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Injectable, Renderer2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalLoadingSpinnerService {

  private _overlayRef: OverlayRef | null = null;

  constructor(private readonly _overlay: Overlay,
              private readonly _positionStrategy: OverlayPositionBuilder,
              private _scrollStrategies: ScrollStrategyOptions) {}

  attach(): void {
    if (this._overlayRef) { return; }

    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._positionStrategy.global().centerHorizontally().centerVertically(),
      scrollStrategy: this._scrollStrategies.noop()
    });

    const componentRef = this._overlayRef.attach(new ComponentPortal(LoadingSpinnerComponent));
    componentRef.instance.setSize(
      '100px',
      '100px'
    );

    if (this._overlayRef.backdropElement === null) { return; }

    this._overlayRef.backdropElement.addEventListener('wheel', this._scrollHandler);
    this._overlayRef.backdropElement.style.touchAction = 'none';
  }

  detach(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.backdropElement!.removeEventListener('wheel', this._scrollHandler);
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _scrollHandler(e: Event): void {
    e.preventDefault();
  }
}
