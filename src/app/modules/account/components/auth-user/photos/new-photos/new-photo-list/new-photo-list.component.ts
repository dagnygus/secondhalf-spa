import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewChecked,
         ChangeDetectionStrategy,
         ChangeDetectorRef,
         Component,
         EventEmitter,
         Input,
         OnChanges,
         Output,
         SimpleChanges } from '@angular/core';

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
  selector: 'app-new-photo-list[filesData]',
  templateUrl: './new-photo-list.component.html',
  styleUrls: ['./new-photo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    newPhotoAinmationMetadata
  ]
})
export class NewPhotoListComponent implements OnChanges, AfterViewChecked {

  @Input() filesData!: readonly string[]
  @Output() cancel = new EventEmitter<number>();

  constructor(private _cdRef: ChangeDetectorRef) {  }

  ngOnChanges(_: SimpleChanges): void {
    this._cdRef.reattach();
  }
  ngAfterViewChecked(): void {
    this._cdRef.detach();
  }
}

