import { OnInit } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { merge, Observable, Subject } from 'rxjs';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, EventEmitter, Output, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, Renderer2, NgZone, Input } from '@angular/core';
import { transition, trigger, style, animate, state } from '@angular/animations';
import { map, delay, distinctUntilChanged, tap, takeUntil, filter } from 'rxjs/operators';
import { PhotosComponent } from '../../photos/photos.component';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
import { CurrentPhotosMediator } from '../current-photos.component';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

const backdropAnimationMatadata = trigger('backdrop', [
  state('false', style({ opacity: 0 })),
  state('true', style({ opacity: 1 })),
  transition('false <=> true', animate('250ms ease-out'))
]);

const photoWrapperAnimationMetadata = trigger('photoWrapper', [
  transition('false => true', [
    style({
      top: '{{ startTop }}px',
      left: '{{ startLeft }}px',
      width: '{{ startWidth }}px',
      height: '{{ startHeight }}px'
    }),
    animate('250ms ease-out', style({
      top: '{{ targetTop }}px',
      left: '{{ targetLeft }}px',
      width: '{{ targetWidth }}px',
      height: '{{ targetHeight }}px'
    }))
  ]),
  transition('true => false', [
    style({
      top: '{{ targetTop }}px',
      left: '{{ targetLeft }}px',
      width: '{{ targetWidth }}px',
      height: '{{ targetHeight }}px'
    }),
    animate('250ms ease-out', style({
      top: '{{ startTop }}px',
      left: '{{ startLeft }}px',
      width: '{{ startWidth }}px',
      height: '{{ startHeight }}px'
    }))
  ])
]);

const profilePictureButtonAnimation = trigger('profilePictureButton', [
  state('false', style({ opacity: 0, transform: 'translateX(-100%)' })),
  state('true', style({ opacity: 1, transform: 'translateX(0)' })),
  transition('false <=> true', animate('250ms ease-out'))
]);

const deleteButtonAnimationMetadata = trigger('deleteButton', [
  state('false', style({ opacity: 0, transform: 'translateX(100%)' })),
  state('true', style({ opacity: 1, transform: 'translateX(0)' })),
  transition('false <=> true', animate('250ms ease-out'))
]);

const cancelButtonAnimationMetadata = trigger('cancelButton', [
  state('false', style({ opacity: 0, transform: 'scale(0)' })),
  state('true', style({ opacity: 1, transform: 'scale(1.2)' })),
  transition('false => true', animate('250ms 250ms ease-out')),
  transition('true => false', animate('250ms ease-out'))
]);

@Component({
  selector: 'app-photo-modal[selectingMainImage\\$][deleteImageSuccess\\$]',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    photoWrapperAnimationMetadata,
    backdropAnimationMatadata,
    profilePictureButtonAnimation,
    deleteButtonAnimationMetadata,
    cancelButtonAnimationMetadata
  ]
})
export class PhotoModalComponent implements OnInit, AfterViewInit, OnDestroy {

  private _destroy$ = new Subject<void>();

  @ViewChild('imgPlaceholder') private _imgPlaceholder!: ElementRef<HTMLElement>;

  private _index = -1;
  imageUrl: string | null = null;
  targetRect: DOMRect | null = null;
  show = false;
  showed = false;
  selectingMainImage = false;

  startTop = 0;
  startLeft = 0;
  startWidth = 0;
  startHeight = 0;

  targetTop = 0;
  targetLeft = 0;
  targetWidth = 0;
  targetHeight = 0;

  private _show$ = new Subject<boolean>();

  get isMain(): boolean {
    return this.imageUrl === this.stateSnapshotService.getAuthState().userData?.mainPhotoUrl;
  }
  mainImagePending = false;

  @Input() selectingMainImage$!: Observable<boolean>;
  @Input() deleteImageSuccess$!: Observable<unknown>;
  @Output() readonly deleteClick = new EventEmitter<number>();
  @Output() readonly mainImageClick = new EventEmitter<string>();


  constructor(private photosComponent: PhotosComponent,
              private stateSnapshotService: StateSnapshotService,
              private _currentPhotosMediator: CurrentPhotosMediator,
              private _renderer: Renderer2,
              private _ngZone: NgZone,
              @Inject(DOCUMENT) private _document: Document,
              @Inject(PLATFORM_ID) private _platformId: object,
              private _cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    // const selectingMainImage$ = this.photosComponent.patchingMainImageUrl$;
    // const deleteImageSuccess$ = this.photosComponent.deleteImageSuccess$;

    const show$ = merge(
      this._show$,
      this.selectingMainImage$,
      this.deleteImageSuccess$.pipe(map(() => false)),
    ).pipe(
      distinctUntilChanged(),
    );

    const showed$ = show$.pipe(
      delay(250),
    );

    show$.pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.show = value;
      if (!this.show) { this._currentPhotosMediator.unselect$.next(); }
      this._cd.markForCheck();
    });

    showed$.pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.showed = value;
      this._cd.markForCheck();
    });

    this.selectingMainImage$.pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.selectingMainImage = value;
      this._cd.markForCheck();
    });

    this._currentPhotosMediator.selectedImg$.subscribe(({ url, index, rect }) => {
      this.imageUrl = url;
      this._index = index;

      this.startTop = rect.top;
      this.startLeft = rect.left;
      this.startWidth = rect.width;
      this.startHeight = rect.height;

      this._show$.next(true);
    });

    this._currentPhotosMediator.updateRect$.subscribe((rect) => {
      this.startTop = rect.top;
      this.startLeft = rect.left;
      this.startWidth = rect.width;
      this.startHeight = rect.height;
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this._renderer.listen(
        this._document.defaultView,
        'resize',
        () => {
          const { left, top, width, height } = this._imgPlaceholder.nativeElement.getBoundingClientRect();
          this.targetLeft = left;
          this.targetTop = top;
          this.targetWidth = width;
          this.targetHeight = height;
        }
      );
    });

    if (!isPlatformBrowser(this._platformId)) { return; }
    const targetRect = this._imgPlaceholder.nativeElement.getBoundingClientRect();
    this.targetLeft = targetRect.left;
    this.targetTop = targetRect.top;
    this.targetWidth = targetRect.width;
    this.targetHeight = targetRect.height;
  }

  hidePhotoModal(): void {
    this._show$.next(false);
  }

  deleteButtonClickHandler(): void {
    if (!this.imageUrl) { return; }
    this.photosComponent.deleteImage(this._index);
    this.deleteClick.emit(this._index);
  }

  profilePictureButtonClickHandler(): void {
    if (!this.imageUrl) { return; }
    this.mainImagePending = true;
    this.photosComponent.selectNewMainImage(this.imageUrl);
    this.mainImageClick.emit(this.imageUrl);
  }

}
