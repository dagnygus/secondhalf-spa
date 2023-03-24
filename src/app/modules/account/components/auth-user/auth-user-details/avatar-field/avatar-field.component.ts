import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-avatar-field',
  templateUrl: './avatar-field.component.html',
  styleUrls: ['./avatar-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarFieldComponent {
  private _file: File | null = null;

  fileData: string | null = null;
  fileData$ = new Subject<string | null>();

  @Input()
  public get file(): File | null {
    return this._file;
  }
  public set file(value: File | null) {
    if (this._file === value) { return; }
    this._file = value;
    this.fileChange.emit(value);
  }
  @Input() imageUrl: string | null | undefined = null;
  @Input() avatarPending: boolean | null = null;
  @Input() uploadAvatarFailed: boolean | null = null;

  @Output() fileChange = new EventEmitter<File | null>()
  @Output() avatarSubmit = new EventEmitter<File>()
}
