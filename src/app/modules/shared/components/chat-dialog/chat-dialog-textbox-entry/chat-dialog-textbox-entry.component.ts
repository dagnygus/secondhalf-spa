import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

const KEY_ENTER = 'Enter';

@Component({
  selector: 'app-chat-dialog-textbox-entry',
  templateUrl: './chat-dialog-textbox-entry.component.html',
  styleUrls: ['./chat-dialog-textbox-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatDialogTextboxEntryComponent {

  @Input() value = '';
  @Input() disabled: boolean | null = null;

  @Output() valueChange = new EventEmitter<string>();

  @Output() send = new EventEmitter<void>();

  constructor() { }

  onInput(value: string): void {
    this.value = value;
    if (this.valueChange.observers.length === 0) { return; }
    this.valueChange.emit(value);
  }

  onKeyUp(key: string): void {
    if (key === KEY_ENTER && this.send.observers.length > 0) {
      this.send.emit();
    }
  }

  onKeyDown(key: string): boolean {
    if (key === KEY_ENTER) {
      return false;
    }
    return true;
  }

  onSendBtnClick(): void {
    if (this.send.observers.length === 0) { return; }
    this.send.emit();
  }

}
