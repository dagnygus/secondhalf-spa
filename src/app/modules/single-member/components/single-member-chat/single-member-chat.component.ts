import { getChatSuccess } from '../../../../state/chat/chat.actions';
/* eslint-disable @typescript-eslint/member-ordering */
import { getChatStart, sendMessageFailed, sendMessageStart, sendMessageSuccess } from '../../../../state/chat/chat.actions';
import { AppState } from 'src/app/app.ngrx.utils';
import { MessageModel } from 'src/app/models/chat-model';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, merge } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { leaveChat } from 'src/app/state/chat/chat.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-single-member-chat',
  templateUrl: './single-member-chat.component.html',
  styleUrls: ['./single-member-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMemberChatComponent implements OnDestroy {
  readonly sendingMessagesDisabled$: Observable<boolean>;
  readonly chatMessages$: Observable<readonly Readonly<MessageModel>[]>;
  readonly chatPending$: Observable<boolean>;

  message = '';

  @Input() isAuth = false;

  private _chatActive = false;



  @Input() memberNickName!: string;
  @Input() set chatActive(value: boolean) {
    if (this._chatActive === value) { return; }
    this._chatActive = value;

    if (!this.isAuth) { return; }

    if (this._chatActive) {
      const targetUserId = this.activatedRoute.snapshot.paramMap.get('id');
      if (targetUserId) {
        this.store.dispatch(getChatStart({ targetUserId }));
      }
    } else {
      this.store.dispatch(leaveChat());
    }
  }



  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<AppState>,
              private actions$: Actions) {
    this.chatMessages$ = this.store.pipe(select((appState) => appState.chat.messages));
    this.chatPending$ = merge<boolean, boolean>(
      this.actions$.pipe(ofType(getChatStart), map(() => true)),
      this.actions$.pipe(ofType(getChatSuccess), map(() => false)),
    );
    this.sendingMessagesDisabled$ = merge(
      this.actions$.pipe(ofType(sendMessageStart), map(() => true)),
      this.actions$.pipe(ofType(sendMessageSuccess), map(() => { this.message = ''; return false; })),
      this.actions$.pipe(ofType(sendMessageFailed), map(() => false)),
      this.chatPending$
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(leaveChat());
  }

  onSendHandler(): void {
    if (!this.message) { return; }
    this.store.dispatch(sendMessageStart({ content: this.message }));
  }

}

