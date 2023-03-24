import { Overlay, OverlayPositionBuilder, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef, Injectable, Injector, NgZone } from "@angular/core";
import { asyncScheduler, delay, merge, Observable, of, subscribeOn, switchMap, take, takeUntil, tap } from "rxjs";
import { PhotoModalComponent } from "../components/auth-user/photos/current-photos/photo-modal/photo-modal.component";

@Injectable()
export class PhotoModalService {
  private _overlayRef: OverlayRef | null = null;
  private _componentRef: ComponentRef<PhotoModalComponent> | null = null;


  constructor(private _overlay: Overlay,
              private _overlayPositionBuilder: OverlayPositionBuilder,
              private _ngZone: NgZone) {}

  openPhotoModal(imageUrl: string, index: number, isMain: boolean, sourceElement: HTMLElement, injector: Injector): PhotoModalComponent {
    if (this._componentRef) { return this._componentRef.instance; }

    const modalInjector = Injector.create({
      providers: [{ provide: 'sourceEl', useValue: sourceElement }],
      parent: injector
    });

    const overlayRef = this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlayPositionBuilder.global().centerHorizontally().centerVertically()
    });

    const componentRef = this._componentRef = this._overlayRef.attach(new ComponentPortal(PhotoModalComponent, null, modalInjector));

    componentRef.setInput('url', imageUrl);
    componentRef.setInput('index', index);
    componentRef.setInput('isMain', isMain);

    const backdropElement = overlayRef.backdropElement!
    backdropElement.style.touchAction = 'none';

    this._ngZone.runOutsideAngular(() => {
      new Observable(() => {
        const handler = (e: Event) => { e.preventDefault(); };
        backdropElement.addEventListener('wheel', handler);
        return () => {
          backdropElement.removeEventListener('wheel', handler)
        }
      }).pipe(takeUntil(componentRef.instance.onClose)).subscribe();
    });

    overlayRef.backdropClick().pipe(
      takeUntil(componentRef.instance.onClose),
    ).subscribe(() => componentRef.instance.close());

    componentRef.instance.onClose.pipe(subscribeOn(asyncScheduler)).subscribe(() => {
      overlayRef.detach();
      overlayRef.dispose();
      this._overlayRef = null;
      this._componentRef = null;
    });

    return componentRef.instance;
  }

  closePhotoModal(): void {
    if (this._componentRef) {
      this._componentRef.instance.close();
    }
  }
}
