import { MessageModel } from 'src/app/models/chat-model';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { AsyncActionStatus, StateStatus } from 'src/app/state/utils';

@Component({
  selector: 'app-single-member-chat[isAuth][memberNickName][chatStatus][sendingStatus][messages][messageToSend][memberId]',
  templateUrl: './single-member-chat.component.html',
  styleUrls: ['./single-member-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMemberChatComponent {

  private _messageToSend = '';
  readonly StateStatus = StateStatus;
  readonly ActionStatus = AsyncActionStatus;

  @Input()
  public get messageToSend(): string {
    return this._messageToSend;
  }
  public set messageToSend(value: string) {
    if (this._messageToSend === value) { return; }
    this._messageToSend = value;
    this.messageToSendChange.emit(value);
  }
  @Input() isAuth = false;
  @Input() memberNickName!: string;
  @Input() memberId!: string
  @Input() chatStatus!: StateStatus;
  @Input() sendingStatus!: AsyncActionStatus | null;
  @Input() messages: readonly MessageModel[] = null!;


  @Output() send = new EventEmitter<string>();
  @Output() messageToSendChange = new EventEmitter<string>();

  constructor() {
  }

}

