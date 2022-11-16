import { easeInOutCubic } from '../../../../../utils/cubik-bezier';
/* eslint-disable @typescript-eslint/member-ordering */
import { AnimationFrame } from '../../../../../services/animation-frame';
import { StateSnapshotService } from '../../../../../services/state-snapshot.service';
import { MessageModel } from '../../../../../models/chat-model';
import { Component, Input, ElementRef, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chat-dialog-clouds[memberNickName][messages]',
  templateUrl: './chat-dialog-clouds.component.html',
  styleUrls: ['./chat-dialog-clouds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatDialogCloudsComponent implements OnChanges {

  private readonly _userId: string;

  @Input() memberNickName!: string;
  @Input() messages!: readonly MessageModel[];
  @Input() chatPending = false;

  constructor(stateSnapshotServcie: StateSnapshotService,
              private _animationFrame: AnimationFrame,
              private _el: ElementRef<HTMLElement>) {
    this._userId = stateSnapshotServcie.getAuthState().userData!.userId;
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.messages) {
        setTimeout(() => this._updateScrollPosition());
      }
  }

  isOwn(message: MessageModel): boolean {
    return this._userId === message.ownerID;
  }

  private _updateScrollPosition(): void {
    if (!(typeof window === 'object' && typeof window.document === 'object')) { return; }

    const el = this._el.nativeElement;
    if (el.scrollHeight === el.clientHeight + el.scrollTop) { return; }

    const from = el.scrollTop;
    const to = el.scrollHeight - el.clientHeight;
    let duration = Math.round((from - to) / 2);
    duration = Math.max(duration, 200);

    this._animationFrame.timedLoop({
      from,
      to,
      duration,
      easingFn: easeInOutCubic
    }).subscribe((value) => {
      el.scrollTo(0, value);
    });
  }

}
