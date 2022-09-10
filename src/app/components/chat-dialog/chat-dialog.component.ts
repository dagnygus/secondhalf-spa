import { fadeInDownAnimation, fadeOutUpAnimation } from './../../utils/ng-animations';
import { transition, trigger } from '@angular/animations';
import { MessageModel } from './../../models/chat-model';
// eslint-disable-next-line max-len
import { sendMessageStart, sendMessageSuccess, sendMessageFailed, getChatStart, leaveChat, getChatSuccess } from './../../state/chat/chat.actions';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef, HostBinding } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { merge, Subject } from 'rxjs';
import { AppState } from 'src/app/app.ngrx.utils';
import { map, takeUntil } from 'rxjs/operators';

const chatDialogAnimationMetadata = trigger('chatDialog', [
  transition(':enter', fadeInDownAnimation('300ms', '0ms')),
  transition(':leave', fadeOutUpAnimation('300ms', '0ms')),
]);

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [chatDialogAnimationMetadata]
})
export class ChatDialogComponent implements OnInit, OnDestroy {

  @HostBinding('class')
  hostClass = 'mat-elevation-z6';

  @HostBinding('@chatDialog')
  animationState?: any;

  sendingMessageDisabled = false;
  message = '';
  messages: readonly MessageModel[] = [];
  memberNickName = '';
  targetUserId = '';
  chatPending = false;
  imageUrl?: string | null | undefined = null;
  onClose = new Subject<void>();

  private _destroy$ = new Subject<void>();

  constructor(private _actions$: Actions,
              private _store: Store<AppState>,
              private _cd: ChangeDetectorRef) {}

  ngOnInit(): void {

    this._store.pipe(select((appState) => appState.chat.messages)).pipe(
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.messages = value;
      this._cd.markForCheck();
    });

    merge(
      this._actions$.pipe(ofType(sendMessageStart), map(() => true)),
      this._actions$.pipe(ofType(sendMessageSuccess), map(() => { this.message = ''; return false; })),
      this._actions$.pipe(ofType(sendMessageFailed), map(() => false))
    ).pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.sendingMessageDisabled = value;
      this.chatPending = value;
      this._cd.markForCheck();
    });


    merge(
      this._actions$.pipe(ofType(getChatStart), map(() => true)),
      this._actions$.pipe(ofType(getChatSuccess), map(() => false)),
    ).pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.chatPending = value;
      this._cd.markForCheck();
    });

    this._store.dispatch(getChatStart({ targetUserId: this.targetUserId }));
  }

  onSend(): void {
    if (!this.message) { return; }
    this._store.dispatch(sendMessageStart({ content: this.message }));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._store.dispatch(leaveChat());
  }

}

