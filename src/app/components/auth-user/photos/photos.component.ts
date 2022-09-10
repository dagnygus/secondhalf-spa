import { PageComponent } from './../../../directives/page.component';
// eslint-disable-next-line max-len
import { fadeInLeftAnimation, fadeInRightAnimation, fadeOutAnimation, fadeOutLeftAnimation, fadeOutRightAnimation } from './../../../utils/ng-animations';
/* eslint-disable @typescript-eslint/member-ordering */
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { FsUserModelFieldNames } from './../../../models/db-models';
import { PatchUserModel } from './../../../models/patch-user-model';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
import { StateStatus } from './../../../app.ngrx.utils';
import { changeImagesOrder,
         deleteImageStart,
         deleteImageSuccess,
         deleteImageFailed,
         getImagesStart,
         uploadImagesStart,
         uploadImagesSuccess,
         uploadImageFailed,
         uploadImageStart,
         uploadImageSuccess,
         uploadImagesFailed} from './../../../state/image/image.actions';
import { Actions, ofType } from '@ngrx/effects';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { merge, Observable, Subject, } from 'rxjs';
import { AppState } from 'src/app/app.ngrx.utils';
import { filter, map, sample, tap, distinctUntilChanged, delay, first, takeUntil } from 'rxjs/operators';
import { patchUserStart, patchUserSuccess } from 'src/app/state/auth/auth.actions';
import { GlobalLoadingSpinnerService } from 'src/app/services/global-loading-spinner.service';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('hostElAnimationState', [
      transition(':leave', [
        group([
          query('app-photo', animate('300ms ease-out', style({ transform: 'scale(0)', opacity: 0 })), { optional: true }),
          query('app-new-photo', [
            animate('400ms ease-in-out', style({
              transform: 'rotateY(320deg) scale(0)'
            }))
          ], { optional: true }),
          query('.new-photos__upload-btn', [
            fadeOutAnimation('300ms', '0ms')
          ], { optional: true }),
          query('app-camera-picture-input', [
            fadeOutLeftAnimation('300ms', '0ms')
          ], { optional: true }),
          query('app-multi-file-picker-input', [
            fadeOutRightAnimation('300ms', '0ms')
          ], { optional: true }),
        ])
      ]),
      transition(':enter', [
        group([
          query('app-camera-picture-input', [
            fadeInLeftAnimation.startState,
            fadeInLeftAnimation('400ms', '400ms')
          ], { optional: true }),
          query('app-multi-file-picker-input', [
            fadeInRightAnimation.startState,
            fadeInRightAnimation('400ms', '400ms')
          ], { optional: true }),
        ])
      ])
    ])
  ]
})
export class PhotosComponent extends PageComponent implements OnInit, OnDestroy {

  readonly images$: Observable<readonly string[]>;
  readonly imagesStateStatus$: Observable<StateStatus>;
  readonly deleteImageSuccess$: Observable<unknown>;
  readonly patchingMainImageUrl$: Observable<boolean>;
  readonly imageUploaded$: Observable<unknown>;
  readonly imagesUploaded$: Observable<unknown>;

  imagesStateStatus: StateStatus = 'pending';
  @HostBinding('@hostElAnimationState') animationState = null;


  private _currentUserId: string;
  private _destroy$ = new Subject<void>();

  constructor(private readonly _store: Store<AppState>,
              private readonly _actions$: Actions,
              stateSnapshotService: StateSnapshotService,
              spinnerService: GlobalLoadingSpinnerService) {
    super();
    this._currentUserId = stateSnapshotService.getAuthState().userData!.userId;
    this.deleteImageSuccess$ = this._actions$.pipe(ofType(deleteImageSuccess));
    this.imageUploaded$ = this._actions$.pipe(ofType(uploadImageSuccess));
    this.imagesUploaded$ = this._actions$.pipe(ofType(uploadImagesSuccess));

    this.images$ = merge(
      this._store.pipe(
        select((appState) => appState.image.URLs),
        first()
      ),
      this._store.pipe(
        select((appState) => appState.image.URLs),
        sample(this._actions$.pipe(ofType(changeImagesOrder), delay(300)))
      )
    );

    this.imagesStateStatus$ = this._store.pipe(
      select((appState) => appState.image.status),
      distinctUntilChanged(),
      tap((status) => this.imagesStateStatus = status)
    );

    const patchingMainImageUrlStart$ = this._actions$.pipe(ofType(patchUserStart)).pipe(
      filter((action) => action.data.fieldName === 'mainPhotoUrl'),
      map(() => true)
    );

    patchingMainImageUrlStart$.pipe(takeUntil(this._destroy$)).subscribe(() => spinnerService.attach());

    const patchingMainImageUrlEnd$ = patchingMainImageUrlStart$.pipe(
      sample(this._actions$.pipe(ofType(patchUserSuccess))),
      map(() => false)
    );

    patchingMainImageUrlEnd$.pipe(takeUntil(this._destroy$)).subscribe(() => spinnerService.detach());

    this.patchingMainImageUrl$ = merge(
      patchingMainImageUrlStart$,
      patchingMainImageUrlEnd$
    );

    merge(
      this._actions$.pipe(ofType(uploadImageStart)),
      this._actions$.pipe(ofType(uploadImagesStart)),
      this._actions$.pipe(ofType(deleteImageStart)),
    ).pipe(takeUntil(this._destroy$)).subscribe(() => spinnerService.attach());

    merge(
      this._actions$.pipe(ofType(uploadImageSuccess)),
      this._actions$.pipe(ofType(uploadImagesSuccess)),
      this._actions$.pipe(ofType(deleteImageSuccess)),
      this._actions$.pipe(ofType(uploadImageFailed)),
      this._actions$.pipe(ofType(uploadImagesFailed)),
      this._actions$.pipe(ofType(deleteImageFailed)),
    ).pipe(takeUntil(this._destroy$)).subscribe(() => spinnerService.detach());
  }

  ngOnInit(): void {
    this._store.dispatch(getImagesStart());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  deleteImage(index: number): void {
    this._store.dispatch(deleteImageStart({ index }));
  }

  selectNewMainImage(url: string): void {

    const data: PatchUserModel = {
      userId: this._currentUserId,
      fieldName: FsUserModelFieldNames.mainPhotoUrl,
      newValue: url
    };

    this._store.dispatch(patchUserStart({ data }));
  }

  uploadPhotos(data: readonly (File | Blob)[]): void {
    this._store.dispatch(uploadImagesStart({ data }));
  }

  uplaodPhoto(data: File | Blob): void {
    this._store.dispatch(uploadImageStart({ data }));
  }
}

