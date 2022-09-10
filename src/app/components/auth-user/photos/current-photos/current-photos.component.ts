import { Destroyable } from 'src/app/my-package';
import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy,
         Component,
         Input,
         Output,
         EventEmitter,
         ChangeDetectorRef,
         forwardRef,
         HostBinding,
         OnDestroy,
         OnInit } from '@angular/core';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
import { delay, takeUntil } from 'rxjs/operators';
import { merge, Subject, Observable } from 'rxjs';

const photoContainerAnimationMetadata = trigger('photoContainer', [
  transition(':enter', [
    query('app-photo', [
      style({ opacity: 0, transform: 'scale(0)' }),
      stagger(150, animate('300ms 300ms', style({ opacity: 1, transform: 'scale(1)' }))),
    ], { optional: true }),
  ]),
]);

const photoAnimationMetadata = trigger('photo', [
  transition(':leave', [
    animate('300ms', style({ opacity: 0, transform: 'scale(0)' }))
  ]),
]);

@Component({
  selector: 'app-current-photos[imagesUrls][imageUploaded\\$][imagesUploaded\\$][deleteImageSuccess\\$][selectingMainImage\\$]',
  templateUrl: './current-photos.component.html',
  styleUrls: ['./current-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ { provide: forwardRef(() => CurrentPhotosMediator), useClass: forwardRef(() => CurrentPhotosMediator) } ],
  animations: [
    photoContainerAnimationMetadata,
    photoAnimationMetadata
  ]
})
export class CurrentPhotosComponent implements OnInit, OnDestroy {

  @Input() imagesUrls: readonly string[] | null = null;
  @Input() deleteImageSuccess$!: Observable<unknown>;
  @Input() imagesUploaded$!: Observable<unknown>;
  @Input() imageUploaded$!: Observable<unknown>;
  @Input() selectingMainImage$!: Observable<boolean>;
  @HostBinding('@photoContainer') photoContainerAnimState: any;
  @Output() deleteImage = new EventEmitter<number>();
  @Output() mainImageSelected = new EventEmitter<string>();

  private _destroy$ = new Subject<void>();


  constructor(private readonly _changeDetectorRef: ChangeDetectorRef,
              private readonly _stateSnapshotService: StateSnapshotService) {}

  ngOnInit(): void {
    this.deleteImageSuccess$.pipe(
      delay(250),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this.imagesUrls = this._stateSnapshotService.getImageState().URLs;
      this._changeDetectorRef.markForCheck();
    });

    merge(
      this.imageUploaded$,
      this.imagesUploaded$
    ).pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.imagesUrls = this._stateSnapshotService.getImageState().URLs;
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  deleteImageHanlder(index: number): void {
    this.deleteImage.emit(index);
  }

  mainImageClickHandler(url: string): void {
    this.mainImageSelected.emit(url);
  }

  trackBy(_: number, url: string): string {
    return url;
  }

}

export class CurrentPhotosMediator {
  selectedImg$ = new Subject<{ url: string; rect: DOMRect; index: number }>();
  updateRect$ = new Subject<DOMRect>();
  unselect$ = new Subject<void>();
}
