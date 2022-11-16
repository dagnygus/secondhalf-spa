/* eslint-disable @typescript-eslint/member-ordering */
import { easeInOutCubic } from '../../../../../utils/cubik-bezier';
import { AnimationFrame } from '../../../../../services/animation-frame';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
import { MessageModel } from '../../../../../models/chat-model';
import { Observable, } from 'rxjs';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, NgZone, PLATFORM_ID,  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-single-member-chat-clouds[chatPending]',
  templateUrl: './single-member-chat-clouds.component.html',
  styleUrls: ['./single-member-chat-clouds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMemberChatCloudsComponent {

  private _messages$!: Observable<readonly Readonly<MessageModel>[]>;
  private readonly _userId: string;

  @Input() memberNickName!: string;

  @Input()
  get messages$(): Observable<readonly Readonly<MessageModel>[]> {
    return this._messages$;
  }
  set messages$(value: Observable<readonly Readonly<MessageModel>[]>) {
    this._messages$ = value.pipe(tap(() => {
      this._ngZone.runOutsideAngular(() => setTimeout(() => this._updateScrollPosition()));
    }));
  }

  @Input() chatPending!: boolean;

  constructor(stateSnapshotServcie: StateSnapshotService,
              private _animationFrame: AnimationFrame,
              private _el: ElementRef<HTMLElement>,
              @Inject(PLATFORM_ID) private _platformId: object,
              private _ngZone: NgZone) {
    this._userId = stateSnapshotServcie.getAuthState().userData!.userId;
  }

  isOwn(message: MessageModel): boolean {
    return this._userId === message.ownerID;
  }

  private _updateScrollPosition(): void {
    if (!isPlatformBrowser(this._platformId)) { return; }

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
