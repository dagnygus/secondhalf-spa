import { group } from '@angular/animations';
// eslint-disable-next-line max-len
import { flipInXAnimation, fadeInUpAnimation, flipOutYAnimation, fadeOutLeftAnimation, flipOutXAnimation, fadeOutUpAnimation } from '../../../../utils/ng-animations';
// eslint-disable-next-line max-len
import { fadeInAnimation, fadeInLeftAnimation, fadeOutAnimation, flipInYAnimation } from '../../../../utils/ng-animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { ChatDialogService } from '../../../../services/chat-dialog.service';
import { StateSnapshotService } from '../../../../services/state-snapshot.service';
import { getImagesForMemberFailed, getImagesForMemberStart } from '../../../../state/image/image.actions';
import { StateStatus } from '../../../../app.ngrx.utils';
import { MemberModel } from 'src/app/models/member-model';
import { getMemberFailed, getMemberStart,
         getMemberSuccess,
         likeMemberFromMemberPageStart,
         likeMemberFromMemberPageSuccess,
         unsubscribeMemberState} from '../../../../state/member/member.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef, } from '@angular/core';
import { merge, Subject, Subscription } from 'rxjs';
import { map, distinctUntilChanged, takeUntil, filter, first } from 'rxjs/operators';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store, select } from '@ngrx/store';
import { selectIsAuth } from 'src/app/state/auth/auth.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { deleteNotificationStart } from 'src/app/state/notification/notification.actions';

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
    query('.single-member-header__name-container', fadeInLeftAnimation('300ms', '300ms')),
    query('.ingle-member-header__like-btn', fadeInAnimation('300ms', '300ms'), { optional: true })
  ])),
  transition(':leave', [
    group([
      query('.single-member-header__name-container', fadeOutLeftAnimation('300ms', '100ms')),
      query('.single-member-header__image-container', fadeOutAnimation('300ms', '100ms')),
      query('.ingle-member-header__like-btn', fadeOutAnimation('300ms', '0ms'), { optional: true })
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
export class SingleMemberComponent extends PageComponent implements OnInit, OnDestroy {

  selectedTabIndex = 0;
  member: MemberModel = null!;
  memberStatus: StateStatus = 'pending';
  isAuth = false;
  likePending = false;
  imagesUrls: readonly string[] = null!;
  imagesStatus: StateStatus = 'empty';
  showMore = false;
  showingMoreOrLess = false;

  startHeight = 0;

  private _memberId = '';
  private _destroy$ = new Subject();
  private _lastFragment = '';
  private _notificationSubscription: Subscription | null = null;


  constructor(private readonly _store: Store<AppState>,
              private readonly _actions$: Actions,
              private readonly _activatedRoute: ActivatedRoute,
              private readonly _router: Router,
              private readonly _changeDetectorRef: ChangeDetectorRef,
              private readonly _stateSnapshotService: StateSnapshotService,
              private readonly _chatDialogService: ChatDialogService) { super(); }

  ngOnInit(): void {
    this._store.pipe(
      select(appState => appState.member.member),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.member = value!;
      this._changeDetectorRef.markForCheck();
    });

    merge<StateStatus, StateStatus, StateStatus>(
      this._actions$.pipe(ofType(getMemberStart), map(() => 'pending')),
      this._actions$.pipe(ofType(getMemberSuccess), map(() => 'complete')),
      this._actions$.pipe(ofType(getMemberFailed), map(() => 'error'))
    ).pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.memberStatus = value;
      this._changeDetectorRef.markForCheck();
    });

    this._store.pipe(
      select((appState) => appState.image.URLs),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.imagesUrls = value;
      if (this.imagesUrls.length === 0) {
        this.imagesStatus = 'empty';
      } else {
        this.imagesStatus = 'complete';
      }
      this._changeDetectorRef.markForCheck();
    });

    merge<StateStatus, StateStatus>(
      this._actions$.pipe(ofType(getImagesForMemberStart), map(() => 'pending')),
      this._actions$.pipe(ofType(getImagesForMemberFailed), map(() => 'error')),
    ).pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.imagesStatus = value;
      this._changeDetectorRef.markForCheck();
    });

    this._store.pipe(
      select(selectIsAuth),
      takeUntil(this._destroy$),
    ).subscribe((value) => {
      this.isAuth = value;
      this._changeDetectorRef.markForCheck();
    });

    merge(this._actions$.pipe(ofType(likeMemberFromMemberPageStart), map(() => true)),
      this._actions$.pipe(ofType(likeMemberFromMemberPageSuccess), map(() => false))
    ).pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.likePending = value;
      this._changeDetectorRef.markForCheck();
    });

    const id = this._activatedRoute.snapshot.paramMap.get('id')!;
    this._memberId = id;
    this._store.dispatch(getMemberStart({ id }));

    let fragment = this._activatedRoute.snapshot.fragment;

    fragment = fragment == null ? 'info' : fragment;

    this.selectedTabIndex = this._getIndexFromFragment(fragment);

    if (this.selectedTabIndex === 1) {
      this._getImagesIfEmpty();
    }

    this._lastFragment = fragment;

  }

  ngOnDestroy(): void {
    this._store.dispatch(unsubscribeMemberState());
    this._destroy$.next();
    this._destroy$.complete();
    this._notificationSubscription?.unsubscribe();
  }

  onLike(id: string, isAllreadyLiked: boolean | null | undefined): void {
    if (isAllreadyLiked) { return; }
    this._store.dispatch(likeMemberFromMemberPageStart({ id }));
  }

  onSelectedTabIndexChange(index: number): void {

    const fragment = this._getFragmentFromIndex(index);
    this._replaceUrl(fragment);
    if (index === 1) {
      this._getImagesIfEmpty();
    }
  }

  onBreakpointEnter(isFirst: boolean): void {
    if (!isFirst) { return; }
    this._getImagesIfEmpty();
    this._replaceUrl();
  }

  onShowMoreOrLessBtnClick(startHeight: number): void {
    this.startHeight = startHeight;
    this.showMore = !this.showMore;
    this._changeDetectorRef.detectChanges();
  }

  onBreakpointLeave(isFirst: boolean): void {
    if (!isFirst) { return; }
    this._replaceUrl(this._lastFragment);
    this.selectedTabIndex = this._getIndexFromFragment(this._lastFragment);
  }

  onShowingAbout(isShowing: boolean): void {
    this.showingMoreOrLess = isShowing;
  }

  onChat(): void {
    this._chatDialogService.openChatDialog(
      this.member.userId,
      this.member.nickName,
      this.member.mainPhotoUrl,
      '(min-width: 580px)'
    );

    const subscription = this._store.pipe(
      select((appState) => appState.notification.notifications),
      map((notifications) => notifications.findIndex((not) => not.type === 'chat-notification' && not.uid === this._memberId)),
      filter((index) => index > -1),
    ).subscribe((index) => {
      this._store.dispatch(deleteNotificationStart({ index }));
    });

    this._chatDialogService.onClose.pipe(first()).subscribe(() => {
      subscription.unsubscribe();
    });
  }

  private _getImagesIfEmpty(): void {
    if (this.imagesStatus !== 'complete' || this._stateSnapshotService.getImageState().userId !== this._memberId) {
      this._store.dispatch(getImagesForMemberStart({ userId: this._memberId }));
    }
  }

  private _replaceUrl(fragment?: string): void {
    if (fragment == null) {
      this._router.navigate([], { relativeTo: this._activatedRoute, replaceUrl: true });
      if (this._lastFragment === 'chat') {
        setTimeout(() => {
          this._chatDialogService.openChatDialog(
            this._memberId,
            this.member.nickName,
            this.member.mainPhotoUrl,
            '(min-width: 580px)'
          );
        }, 300);
      }
    } else {
      this._router.navigate([], { relativeTo: this._activatedRoute, fragment, replaceUrl: true });

      if (fragment === 'chat') {
        if (!this._notificationSubscription) {
          this._notificationSubscription = this._store.pipe(
            select((appState) => appState.notification.notifications),
            map((notifications) => notifications.findIndex((not) => not.type === 'chat-notification' && not.uid === this._memberId)),
            filter((index) => index > -1),
          ).subscribe((index) => {
            this._store.dispatch(deleteNotificationStart({ index }));
          });
        }
      } else {
        this._notificationSubscription?.unsubscribe();
      }
    }
  }

  private _getIndexFromFragment(fragment: string): number {
    switch (fragment) {
      case 'info':
        return 0;
      case 'photos':
        this._getImagesIfEmpty();
        return 1;
      case 'chat':
        return 2;
      default:
        throw new Error('Invalid fragment');
    }
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
