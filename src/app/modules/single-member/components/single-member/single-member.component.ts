import { likeStart } from './../../../../state/like/like.actions';
import { LikeEvents } from './../../../../state/like/like.effects';
import { MemberEvents } from './../../../../state/member/member.effects';
import { group } from '@angular/animations';
import { flipInXAnimation, fadeInUpAnimation, flipOutYAnimation, fadeOutLeftAnimation, flipOutXAnimation, fadeOutUpAnimation } from '../../../../utils/ng-animations';
import { fadeInAnimation, fadeInLeftAnimation, fadeOutAnimation, flipInYAnimation } from '../../../../utils/ng-animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { ChatDialogService } from '../../../../services/chat-dialog.service';
import { MemberModel } from 'src/app/models/member-model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store, select } from '@ngrx/store';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { ImageEvents } from 'src/app/state/image/image.effects';
import { AsyncActionStatus, StateStatus } from 'src/app/state/utils';
import { ChatEvents } from 'src/app/state/chat/chat.effects';
import { MessageModel } from 'src/app/models/chat-model';
import { sendMessageStart } from 'src/app/state/chat/chat.actions';
import { BreakpointObserver } from '@angular/cdk/layout';

const aboutAnimationMetadata = trigger('about', [
  transition('true <=> false', [
    style({ height: '{{startHeight}}px' }),
    animate('250ms ease', style({ height: '*' }))
  ])
]);

const fadeAnimationMetadata = trigger('fade', [
  transition(':enter', fadeInAnimation('400ms', '300ms')),
  transition(':leave', fadeOutAnimation('400ms', '0ms'))
]);

const photoContainerAnimationMetadata = trigger('photoContainer', [
  transition(':enter', flipInYAnimation('1s', '400ms')
  ),
  transition(':leave', flipOutYAnimation('1s', '0ms'))
]);

const headerAnimationMetadata = trigger('header',[
  transition(':enter', group([
    query('.name-container', fadeInLeftAnimation('300ms', '300ms')),
    query('.like-btn', fadeInAnimation('300ms', '300ms'), { optional: true })
  ])),
  transition(':leave', [
    group([
      query('.name-container', fadeOutLeftAnimation('300ms', '100ms')),
      query('.image-container', fadeOutAnimation('300ms', '100ms')),
      query('.like-btn', fadeOutAnimation('300ms', '0ms'), { optional: true })
    ])
  ]),
]);

const memberInfoAnimationMetadata = trigger('info', [
  transition(':enter', [
    query('.single-member-info__single-info-container', [
      flipInXAnimation.startState,
      stagger(200, flipInXAnimation('400ms', '300ms'))
    ])
  ]),
  transition(':leave', [
    query('.single-member-info__single-info-container', [
      flipOutXAnimation('400ms', '0ms')
    ])
  ])
]);

const aboutMdAnimationMetadata = trigger('mdAbout', [
  transition(':enter', [
    fadeInUpAnimation.startState,
    fadeInUpAnimation('400ms', '300ms')
  ]),
  transition(':leave', [
    fadeOutUpAnimation('400ms', '0ms')
  ])
]);

@Component({
  selector: 'app-single-member',
  templateUrl: './single-member.component.html',
  styleUrls: ['./single-member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    aboutAnimationMetadata,
    fadeAnimationMetadata,
    photoContainerAnimationMetadata,
    headerAnimationMetadata,
    memberInfoAnimationMetadata,
    aboutMdAnimationMetadata
  ]
})
export class SingleMemberComponent extends PageComponent {

  readonly StateStatus = StateStatus

  private _selectedTabIndex = 0;
  public get selectedTabIndex() {
    return this._selectedTabIndex;
  }
  public set selectedTabIndex(value) {
    if (value == this._selectedTabIndex) { return; }
    this._selectedTabIndex = value;
    const fragment = this._getFragmentFromIndex(value);
    this._router.navigate([], { relativeTo: this._activatedRoute, replaceUrl: true, fragment })
  }

  member$: Observable<MemberModel | null>;
  memberStatus$: Observable<StateStatus>;
  isAuth$: Observable<boolean>;
  likePending$: Observable<boolean>;
  imagesUrls$: Observable<readonly string[]>;
  imagesStatus$: Observable<StateStatus>;
  memberNickName$: Observable<string | null>;
  aboutMember$: Observable<string | null>
  chatStatus$: Observable<StateStatus>;
  sendingMessageStatus$: Observable<AsyncActionStatus>;
  messages$: Observable<readonly MessageModel[]>;
  memberId$: Observable<string>;


  showMore = false;
  showingMoreOrLess = false;
  startHeight = 0;
  messageToSend = '';

  constructor(private readonly _store: Store<AppState>,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _router: Router,
              imageEvents: ImageEvents,
              memberEvents: MemberEvents,
              likeEvents: LikeEvents,
              chatEvents: ChatEvents,
              private readonly _changeDetectorRef: ChangeDetectorRef,
              private readonly _chatDialogService: ChatDialogService) {
      super();
      this.member$ = this._store.pipe(select(({ member }) => member.member));
      this.memberStatus$ = memberEvents.status$;
      this.isAuth$ = this._store.pipe(select(({ auth }) => auth.userData != null));
      this.likePending$ = likeEvents.pending$.pipe(startWith(false));
      this.imagesUrls$ = this._store.pipe(select(({ image }) => image.URLs));
      this.imagesStatus$ = imageEvents.status$;
      this.memberNickName$ = this._store.pipe(select(({ member }) => member.member?.nickName ?? null));
      this.aboutMember$ = this._store.pipe(select(({ member }) => member.member?.aboutMySelf ?? null));
      this.messages$ = this._store.pipe(select(({ chat }) => chat.messages));
      this.chatStatus$ = chatEvents.status$;
      this.sendingMessageStatus$ = chatEvents.sendingMessage$.pipe(
        tap((status) => {
          if (status === AsyncActionStatus.resolved) {
            this.messageToSend = '';
          }
        })
      );
      this.memberId$ = this._store.pipe(select(({ member }) => member.member!.userId))

      const fragment = this._activatedRoute.snapshot.fragment;
      switch (fragment) {
        case 'photos':
          this._selectedTabIndex = 1;
          break;
        case 'chat':
          this._selectedTabIndex = 2;
      }
    }

  onLike(id: string, isAllreadyLiked: boolean | null | undefined): void {
    if (isAllreadyLiked) { return; }
    this._store.dispatch(likeStart({ id }));
  }

  onShowMoreOrLessBtnClick(startHeight: number): void {
    this.startHeight = startHeight;
    this.showMore = !this.showMore;
    this._changeDetectorRef.detectChanges();
  }

  onShowingAbout(isShowing: boolean): void {
    this.showingMoreOrLess = isShowing;
  }

  onChat(member: MemberModel): void {
    this._chatDialogService.openChatDialog(
      member.userId,
      this._chatDialogService.singleMemberBreakpoint
    );
  }

  onSendMessage(content: string): void {
    this._store.dispatch(sendMessageStart(({ content })))
  }

  private _getFragmentFromIndex(index: number): string {
    switch (index) {
      case 0:
        return 'info';
      case 1:
        return 'photos';
      case 2:
        return 'chat';
      default:
        throw new Error('Invalid index');
    }
  }
}
