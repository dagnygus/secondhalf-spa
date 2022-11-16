/* eslint-disable @typescript-eslint/member-ordering */
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';
import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PhotosComponent } from '../photos/photos.component';

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
  selector: 'app-new-photos[uploadedPictureFromCamera\\$][uploadedImagesFromHardDrive\\$]',
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

  @Input() uploadedPictureFromCamera$!: Observable<unknown>;
  @Input() uploadedImagesFromHardDrive$!: Observable<unknown>;

  @Output() pictureFromCameraAccepted = new EventEmitter<Blob>();
  @Output() imagesAccepted = new EventEmitter<readonly File[]>();

  constructor() {  }

  onUploadImagesBtnClick(images: readonly File[]): void {
    this.imagesAccepted.emit(images);
  }

  onPhotoAcceptedBtnClick(data: Blob): void {
    this.pictureFromCameraAccepted.emit(data);
  }

}
