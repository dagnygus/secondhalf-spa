import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageModel } from 'src/app/models/chat-model';

const KEY_ENTER = 'Enter';

@Component({
  selector: 'app-chat-dialog-textbox-entry',
  templateUrl: './chat-dialog-textbox-entry.component.html',
  styleUrls: ['./chat-dialog-textbox-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatDialogTextboxEntryComponent {

  private _value = '';

  @Input()
  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    if (this._value === value) { return; }
    this._value = value;
    this.valueChange.emit(value);
  }
  @Input() disabled: boolean | null = null;
  @Input() authUserId!: string
  @Input() messages!: readonly MessageModel[]

  @Output() valueChange = new EventEmitter<string>();
  @Output() send = new EventEmitter<string>();

  constructor() { }

  onKeyUp(key: string): void {
    if (key === KEY_ENTER && this._value) {
      this.send.emit(this._value);
    }
  }

  onKeyDown(key: string): boolean {
    if (key === KEY_ENTER) {
      return false;
    }
    return true;
  }

  onClick(): void {
    if (!this._value) { return; }
    this.send.emit(this._value);
  }

}
