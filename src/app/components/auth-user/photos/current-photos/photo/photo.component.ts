import { map, distinctUntilChanged, tap } from 'rxjs/operators';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Inject, Renderer2, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { CurrentPhotosMediator } from '../current-photos.component';
import { DOCUMENT } from '@angular/common';

export interface ClientRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-photo[imageUrl][index]',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoComponent implements OnInit, OnDestroy {

  @Input() imageUrl!: string;
  @Input() index!: number;

  isMain = false;
  visibility = 'visible';

  private _subscription?: Subscription;
  private _unlisten: (() => void) | null = null;

  constructor(private readonly _store: Store<AppState>,
              private _cd: ChangeDetectorRef,
              private readonly _el: ElementRef<HTMLElement>,
              private readonly _currentPhotosMediator: CurrentPhotosMediator,
              @Inject(DOCUMENT) private readonly _document: Document,
              private readonly _renderer: Renderer2,
              private readonly _ngZone: NgZone) {

  }

  ngOnInit(): void {
    this._subscription = this._store.pipe(
      select((appState) => appState.auth.userData?.mainPhotoUrl === this.imageUrl),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.isMain = value;
      this._cd.markForCheck();
    });

    this._currentPhotosMediator.unselect$.subscribe(() => {
      if (this._unlisten) {
        this._unlisten();
        this._unlisten = null;

        setTimeout(() => {
          this.visibility = 'visible';
          this._cd.markForCheck();
        }, 249);
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  onPhotoClick(): void {

    this.visibility = 'hidden';
    if (this._currentPhotosMediator.selectedImg$.observers.length === 0) { return; }
    this._currentPhotosMediator.selectedImg$.next({
      url: this.imageUrl,
      index: this.index,
      rect: this._el.nativeElement.getBoundingClientRect()
    });

    this._ngZone.runOutsideAngular(() => {
      this._unlisten = this._renderer.listen(
        this._document.defaultView,
        'resize',
        () => {
          if (this._currentPhotosMediator.updateRect$.observers.length === 0) { return; }
          this._currentPhotosMediator.updateRect$.next(this._el.nativeElement.getBoundingClientRect());
        }
      );
    });
  }

}
