import { assertNotNull } from 'src/app/utils/others';
import { ChatEvents } from './../../../../state/chat/chat.effects';
import { fadeInDownAnimation, fadeOutUpAnimation } from '../../../../utils/ng-animations';
import { transition, trigger } from '@angular/animations';
import { MessageModel } from '../../../../models/chat-model';
// eslint-disable-next-line max-len
import { sendMessageStart, } from '../../../../state/chat/chat.actions';
import { ChangeDetectionStrategy, Component, OnDestroy, HostBinding, Input, ComponentRef, AfterViewInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AppState } from 'src/app/app.ngrx.utils';
import { takeUntil, tap } from 'rxjs/operators';
import { AsyncActionStatus, StateStatus } from 'src/app/state/utils';

const chatDialogAnimationMetadata = trigger('chatDialog', [
  transition(':enter', fadeInDownAnimation('300ms', '0ms')),
  transition(':leave', fadeOutUpAnimation('300ms', '0ms')),
]);

export enum ChatDialogInputNames {
  messageToSend = 'messageToSend',
  memberNickName = 'memberNickName',
  chatStatus = 'chatStatus',
  sendingStatus = 'sendingStatus',
  messages = 'messages',
  imageUrl = 'imageUrl',
  targetUserId = 'targetUserId'
}

export function bindInputs(componentRef: ComponentRef<ChatDialogComponent>, store: Store<AppState>, chatEvents: ChatEvents): void {
  store.pipe(
    select(({ member }) => member.member),
    takeUntil(componentRef.instance.onClose)
  ).subscribe((member) => {
    assertNotNull(member)
    componentRef.setInput(ChatDialogInputNames.memberNickName, member.nickName),
    componentRef.setInput(ChatDialogInputNames.imageUrl, member.mainPhotoUrl)
    componentRef.setInput(ChatDialogInputNames.targetUserId, member.userId)
  });

  store.pipe(
    select(({ chat }) => chat.messages),
    takeUntil(componentRef.instance.onClose)
  ).subscribe((messages) => {
    componentRef.setInput(ChatDialogInputNames.messages, messages)
  });

  chatEvents.status$.pipe(
    takeUntil(componentRef.instance.onClose),
  ).subscribe((status) => {
    componentRef.setInput(ChatDialogInputNames.chatStatus, status)
  });
  chatEvents.sendingMessage$.pipe(
    tap((status) => {
      if (status === AsyncActionStatus.resolved) {
        componentRef.setInput(ChatDialogInputNames.messageToSend, '');
      }
    })
  ).subscribe((status) => {
    componentRef.setInput(ChatDialogInputNames.sendingStatus, status)
  });

  componentRef.instance.onSend.subscribe((content) => {
    store.dispatch(sendMessageStart({ content }))
  });
}

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [chatDialogAnimationMetadata]
})
export class ChatDialogComponent implements OnDestroy {

  @HostBinding('class')
  hostClass = 'mat-elevation-z6';

  @HostBinding('@chatDialog')
  animationState?: any;

  readonly StateStatus = StateStatus;
  readonly ActionStatus = AsyncActionStatus;


  @Input() messageToSend = '';
  @Input() memberNickName!: string;
  @Input() chatStatus: StateStatus = null!;
  @Input() sendingStatus: AsyncActionStatus | null = null;
  @Input() messages: readonly MessageModel[] = null!;
  @Input() imageUrl: string | null | undefined = null;
  @Input() targetUserId: string = null!;

  onSend = new Subject<string>()
  onClose = new Subject<void>();


  constructor() { }

  ngOnDestroy(): void {
    console.log('destroy');
    this.onClose.next();
    this.onClose.complete();
    this.onSend.complete();
  }

}

