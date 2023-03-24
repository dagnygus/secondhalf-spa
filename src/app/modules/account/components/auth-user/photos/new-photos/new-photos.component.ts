/* eslint-disable @typescript-eslint/member-ordering */
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

const itemsContainerAnimationMetadata = trigger('itemsContainer', [
  transition(':enter', [
    group([
      style({ height: 0, borderWidth: 0 }),
      animate('300ms ease-out', style({
        height: '*',
        borderWidth: '*'
      })),
      query('@*', animateChild(), { optional: true })
    ])
  ]),
  transition(':leave', [
    group([
      query('@*', animateChild(), { optional: true }),
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
      query('@*', animateChild(), { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-new-photos',
  templateUrl: './new-photos.component.html',
  styleUrls: ['./new-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    itemsContainerAnimationMetadata,
  ]
})
export class NewPhotosComponent {

  private _files: readonly File[] | null = null;
  private _cameraOpen = false;

  itemsContainerAnimationState = false;
  filesData:  readonly string[] | null = null;

  @Input()
  public set files(value: readonly File[] | null) {
    if (this._files === value) { return; }
    this._files = value;
    this.filesChange.emit(value);
  }
  public get files(): readonly File[] | null {
    return this._files;
  }

  @Input()
  public get cameraOpen(): boolean {
    return this._cameraOpen;
  }
  public set cameraOpen(value: boolean) {
    if (this._cameraOpen === value) { return; }
    this._cameraOpen = value;
    this.cameraOpenChange.emit(value);
  }

  @Output() pictureAccepted = new EventEmitter<Blob>();
  @Output() imagesAccepted = new EventEmitter<readonly File[]>();
  @Output() filesChange = new EventEmitter<readonly File[] | null>();
  @Output() cameraOpenChange = new EventEmitter<boolean>();

}
