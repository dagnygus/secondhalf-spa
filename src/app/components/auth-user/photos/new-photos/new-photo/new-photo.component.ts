import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-photo[imageUrl]',
  templateUrl: './new-photo.component.html',
  styleUrls: ['./new-photo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPhotoComponent {

  @Input() imageUrl!: string;
  @Output() cancel = new EventEmitter<void>();

  constructor() { }

  onCancelButtonClick(): void {
    this.cancel.emit();
  }

}
