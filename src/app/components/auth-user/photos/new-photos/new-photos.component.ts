/* eslint-disable @typescript-eslint/member-ordering */
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PhotosComponent } from '../photos.component';

const itemsContainerAnimationMetadata = trigger('itemsContainer', [
  transition(':enter', [
    group([
      style({ height: 0, borderWidth: 0 }),
      animate('300ms ease-out', style({
        height: '*',
        borderWidth: '*'
      })),
      query('@*', animateChild())
    ])
  ]),
  transition(':leave', [
    group([
      query('@*', animateChild()),
      animate('300ms ease-out', style({
        height: 0,
        borderWidth: 0
      })),
    ])
  ]),
  transition('* <=> *', [
    group([
      style({ height: '{{itsHeight}}px' }),
      animate('300ms ease-out', style({
        height: '*',
      })),
      query('@*', animateChild())
    ])
  ])
]);

const newPhotoAinmationMetadata = trigger('newPhoto', [
  transition(':enter', [
    style({transform: 'rotateY(720deg) scale(0)'}),
    animate('800ms ease-in-out', style({
      transform: 'rotateY(0deg) scale(1)'
    }))
  ]),
  transition(':leave', [
    animate('800ms ease-in-out', style({
      transform: 'rotateY(720deg) scale(0)'
    }))
  ]),
]);

@Component({
  selector: 'app-new-photos',
  templateUrl: './new-photos.component.html',
  styleUrls: ['./new-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    itemsContainerAnimationMetadata,
    newPhotoAinmationMetadata
  ]
})
export class NewPhotosComponent {

  itemsContainerAnimationState = false;

  private _uploaded$ = new Subject<void>();
  readonly uploaded$ = this._uploaded$.asObservable();

  private _uploaded2$ = new Subject<void>();
  readonly uploaded2$ = this._uploaded2$.asObservable();

  readonly uploadedPictureFromCamera$: Observable<unknown>;
  readonly uploadedImagesFromHardDrive$: Observable<unknown>;

  data: any = null;

  constructor(private photosComponent: PhotosComponent) {
    this.uploadedImagesFromHardDrive$ = this.photosComponent.imagesUploaded$;
    this.uploadedPictureFromCamera$ = this.photosComponent.imageUploaded$;
  }

  uploadImages(images: readonly File[]): void {
    this.photosComponent.uploadPhotos(images);
  }

  onPhotoAccepted(data: Blob): void {
    this.photosComponent.uplaodPhoto(data);
  }

}
