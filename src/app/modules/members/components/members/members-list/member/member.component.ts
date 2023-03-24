import { ChatDialogService } from 'src/app/services/chat-dialog.service';
import { ElementRef, EventEmitter } from '@angular/core';
import { query, style, transition, trigger, animate, keyframes, animateChild } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, Output, ViewChild } from '@angular/core';
import { MemberModel } from 'src/app/models/member-model';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';


const containerAnimationMetadata = trigger('container', [

  transition(':enter', [
    style({ opacity: 0 }),
    animate('800ms 800ms ease-out', style({
      opacity: 1
    })),
    query('@*', animateChild())
  ])

]);

const mamberFooterAnimationMetadata = trigger('memberFooter', [

  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(100%)' }),

    animate('500ms 400ms ease-out', keyframes([
      style({ opacity: 1, transform: 'translateY(40%)', offset: 0.6 }),
      style({ opacity: 1, transform: 'translateY(0%)', offset: 1 }),
    ])),

    query('@*', animateChild()),
  ])

]);

const memeberButtonAnimationMetadata = trigger('memberBtn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0)' }),
    animate('300ms ease-out', keyframes([
      style({ opacity: 1, transform: 'scale(0.6)', offset: 0.6 }),
      style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
    ]))
  ])
]);

const LIKE_IMAGE_URL = 'url(/assets/front_end_images/like_button_confirmerd.svg)';
const LIKE_IMAGE_URL_CONFIRMED = 'url(/assets/front_end_images/like_button_confirmerd2.svg)';
const LIKE_IMAGE_URL_DISABLED = 'url(/assets/front_end_images/like_button_confirmerd_disabled.svg)';
const CHAT_IMAGE_URL = 'url(/assets/front_end_images/chat_button.svg)';
const CHAT_IMAGE_URL_DISABLED = 'url(/assets/front_end_images/chat_button_disabled.svg)';
const INFO_IMAGE_URL = 'url(/assets/front_end_images/info_button.svg)';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-member[member][isAuth][index][likePending]',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    containerAnimationMetadata,
    mamberFooterAnimationMetadata,
    memeberButtonAnimationMetadata
  ]
})
export class MemberComponent {

  @ViewChild('image') imageElRef!: ElementRef<HTMLElement>;

  // isAuth = false;
  @Input() likePending!: boolean;
  @Input() member!: Readonly<MemberModel>;
  @Input() index!: number;
  @Input() isAuth!: boolean;
  @Input() memberId!: string;

  @Output() like = new EventEmitter<void>();


  get infoBtnImgUrl(): string { return INFO_IMAGE_URL; }
  get likeBtnImageUrl(): string {
    if (this.isAuth) {
      return this.member.liked ? LIKE_IMAGE_URL_CONFIRMED : LIKE_IMAGE_URL;
    }
    return LIKE_IMAGE_URL_DISABLED;
  }
  get chatBtnImageUrl(): string {
    return this.isAuth ? CHAT_IMAGE_URL : CHAT_IMAGE_URL_DISABLED;
  }

  constructor(private _router: Router,
              private _breakpointObserver: BreakpointObserver,
              private _chatDialogService: ChatDialogService) {  }

  onLikeBtnClick(): void {
    this.like.emit();
  }

  navigateToMember(withChat: boolean): void {
    if (withChat && !this.isAuth) { return; }
    const breakpointMathced = this._breakpointObserver.isMatched('(min-width: 580px)');
    if (breakpointMathced && withChat) {
      this._chatDialogService.openChatDialogOnNextRoute(
        this.member.userId,
        this.member.nickName,
        this.member.mainPhotoUrl,
        '(min-width: 580px)'
      );
    }
    const url = breakpointMathced ? `/member/${this.member.userId}` : `/member/${this.member.userId}#${withChat ? 'chat' : 'info'}`;
    this._router.navigateByUrl(url);
  }
}
