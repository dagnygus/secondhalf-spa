import { PhotoModalService } from './../../../services/photo-modal.service';
import { assertNotNull } from 'src/app/utils/others';
import { AuthStateEvents } from '../../../../../state/auth/auth.effects';
import { ImageEvents } from '../../../../../state/image/image.effects';
import { AuthStateRef } from '../../../../../state/auth/auth.state';
import { uploadImage, uploadImages, deleteImage } from '../../../../../state/image/image.actions';

// eslint-disable-next-line max-len
import { fadeInLeftAnimation, fadeInRightAnimation, fadeOutAnimation, fadeOutLeftAnimation, fadeOutRightAnimation } from '../../../../../utils/ng-animations';
/* eslint-disable @typescript-eslint/member-ordering */
import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { FsUserModelFieldNames } from '../../../../../models/db-models';
import { PatchUserModel } from '../../../../../models/patch-user-model';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, merge } from 'rxjs';
import { AppState } from 'src/app/app.ngrx.utils';
import { filter, map, tap, share, sample, delay, first } from 'rxjs/operators';
import { updateUser } from 'src/app/state/auth/auth.actions';
import { GlobalLoadingSpinnerService } from 'src/app/services/global-loading-spinner.service';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { AsyncActionStatus, StateStatus } from 'src/app/state/utils';


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
export class PhotosComponent extends PageComponent {

  cameraOpen = false

  readonly StateStatus = StateStatus

  readonly images$: Observable<readonly string[]>;
  readonly imagesStateStatus$: Observable<StateStatus>;
  readonly deleteImageSuccess$: Observable<unknown>;
  readonly patchingMainImageUrl$: Observable<boolean>;
  readonly imageUploaded$: Observable<unknown>;
  readonly imagesUploaded$: Observable<unknown>;
  readonly mainImageUrl$: Observable<string | null | undefined>

  @HostBinding('@hostElAnimationState') animationState = null;

  files: readonly File[] | null = null;

  private _currentUserId: string;

  constructor(private readonly _store: Store<AppState>,
              private readonly _photoModalService: PhotoModalService,
              authStateRef: AuthStateRef,
              imageEvents: ImageEvents,
              authEvents: AuthStateEvents,
              spinnerService: GlobalLoadingSpinnerService) {
    super();
    assertNotNull(authStateRef.state.userData);

    this._currentUserId = authStateRef.state.userData!.userId;

    const spinnerAttacherFn = (status: AsyncActionStatus) => {
      if (status === AsyncActionStatus.awaiting) {
        spinnerService.attach();
        return;
      }
      spinnerService.detach();
    };

    this.deleteImageSuccess$ = imageEvents.deleting$.pipe(
      tap(spinnerAttacherFn),
      filter((status) => status === AsyncActionStatus.resolved),
      share()
    );
    this.imageUploaded$ = imageEvents.uploadingOne$.pipe(
      tap(spinnerAttacherFn),
      filter((status) => status === AsyncActionStatus.resolved),
      share()
    );
    this.imagesUploaded$ = imageEvents.uploadingMany$.pipe(
      tap(spinnerAttacherFn),
      filter((status) => status === AsyncActionStatus.resolved),
      share()
    );

    this.imagesStateStatus$ = imageEvents.status$;

    this.patchingMainImageUrl$ = authEvents.updateAvatar$.pipe(
      filter((status) => status === AsyncActionStatus.awaiting || status === AsyncActionStatus.resolved),
      tap(spinnerAttacherFn),
      map((status) => status === AsyncActionStatus.awaiting)
    );

    this.images$ = this._store.pipe(
      select((appState) => appState.image.URLs),
      sample(
        merge(
          this.imageUploaded$.pipe(tap(() => this.cameraOpen = false)),
          this.imagesUploaded$.pipe(tap(() => this.files = null)),
          this.deleteImageSuccess$.pipe(
            tap(() => this._photoModalService.closePhotoModal()),
            delay(400),
          ),
          this.patchingMainImageUrl$.pipe(
            tap(() => this._photoModalService.closePhotoModal()),
            delay(400),
          ),
          imageEvents.status$.pipe(filter((status) => status === StateStatus.complete), first())
        )
      ),
      share(),
    );

    this.mainImageUrl$ = this._store.pipe(select(({ auth }) => auth.userData?.mainPhotoUrl));
  }

  deleteImage(index: number): void {
    this._store.dispatch(deleteImage({ index, info: '' }));
  }

  selectNewMainImage(url: string): void {

    const data: PatchUserModel = {
      userId: this._currentUserId,
      fieldName: FsUserModelFieldNames.mainPhotoUrl,
      newValue: url
    };

    this._store.dispatch(updateUser({ data, info: 'Updating user main image from app-photos component.' }));
  }

  uploadPhotos(data: readonly (File | Blob)[]): void {
    this._store.dispatch(uploadImages({ data, info: 'Uploading images from app-photos component.' }));
  }

  uplaodPhoto(data: File | Blob): void {
    this._store.dispatch(uploadImage({ data, info: 'Uploadfing image from app-photos component.' }));
  }
}

