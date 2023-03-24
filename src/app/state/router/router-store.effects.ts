import { WindowScroller } from './../../services/window-scroller';
import { AppState } from 'src/app/app.ngrx.utils';
import { unsubscribeMemberState } from './../member/member.actions';
import { routerNavigatedAction, routerRequestAction } from '@ngrx/router-store';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import { RouterStateRef, RouterStateData } from './router-store-serializer';
import { filter, map, switchMap, takeUntil, tap, skip, observeOn, take } from 'rxjs/operators';
import { getMembers, unsubscribeMemebersListiners } from '../members/members.actions';
import { getMember } from '../member/member.actions';
import { isActionTypeOf } from '../utils';
import { ChatDialogService } from 'src/app/services/chat-dialog.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Action, Store, select } from '@ngrx/store';
import { merge, asyncScheduler } from 'rxjs';
import { getImages } from '../image/image.actions';
import { AuthStateRef } from '../auth/auth.state';
import { getChat, leaveChat } from '../chat/chat.actions';

@Injectable()
export class RouterEffects {


  membersPageNavigated$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._membersPageNavigated(action)),
    map(() => {
      const routerState = this._routerStateRef.state;
      const page = routerState.queryParams['page'] != null ? +routerState.queryParams['page'] : 1;
      const gender = routerState.queryParams['gender'] == null ? null : routerState.queryParams['gender'];
      const limit = routerState.queryParams['limit'] == null ? 10 : +routerState.queryParams['limit'];

      return getMembers({ page, gender, limit, info: 'Geting members form members page' });
    })
  ));

  leavedMembersPage$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._membersPageLeaved(action)),
    map(() => unsubscribeMemebersListiners( { info: 'Leaving members page.' } ))
  ));

  navigatedToSingleMemberPage$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageEntered(action)),
    map(() => {
      const id = this._routerStateRef.state.params['id'];
      return getMember({ id, info: 'Geting member for single member page.' });
    })
  ));

  leavedSingleMemberPage$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageLeaved(action)),
    map(() => unsubscribeMemberState())
  ));

  singleMemberFragmentChange$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageNavigated(action)),
    switchMap(() => this._store.pipe(
      select(({ member }) => member.member!),
      filter((member) => member != null && member.userId === this._routerStateRef.state.params['id']))),
      tap((member) => {
        const fragment = this._routerStateRef.state.fragment;
        if (fragment === 'chat' && !this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint)) {
          this._breakpointObserver.observe(this._chatDialogService.singleMemberBreakpoint).pipe(
            filter((state) => state.matches),
            take(1),
            takeUntil(this._actions$.pipe(filter((action) => this._memberPageNavigated(action) || this._memberPageLeaved(action))))
          ).subscribe(() => {
            if (this._authStateRef.state.userData) {
              this._chatDialogService.openChatDialogOnNextRoute(
                member.userId,
                member.nickName,
                member.mainPhotoUrl,
                this._chatDialogService.singleMemberBreakpoint);
            }
            this._router.navigateByUrl(`/member/${member.userId}`, { replaceUrl: true });
          });

          return;
        }
        if (fragment !== 'chat' && this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint)) {
          this._chatDialogService.onOpen.pipe(
            switchMap(() => this._breakpointObserver.observe(this._chatDialogService.singleMemberBreakpoint)),
            filter((state) => !state.matches),
            takeUntil(merge(
              this._chatDialogService.onClose.pipe(observeOn(asyncScheduler)),
              this._actions$.pipe(filter((action) => this._memberPageLeaved(action)))
            ))
          ).subscribe(() => {
              this._chatDialogService.closeCurrentDialog();
              this._router.navigateByUrl(`/member/${member.userId}#chat`);
          });

          return;
        }

        if (fragment && !this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint)) {
          this._breakpointObserver.observe(this._chatDialogService.singleMemberBreakpoint).pipe(
            filter((state) => state.matches),
            take(1),
            takeUntil(this._actions$.pipe(filter((action) => this._memberPageNavigated(action) || this._memberPageLeaved(action))))
          ).subscribe(() => {
            this._router.navigateByUrl(`/member/${member.userId}`, { replaceUrl: true });
          });

          return;
        }

        const isPrevMemberPage = this._routerStateRef.state.prevData?.url === 'member/:id';
        const prevFragment = this._routerStateRef.state.prevData?.fragment

        if (this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint) &&
            !this._chatDialogService.isOpen() && isPrevMemberPage &&
            prevFragment && prevFragment !== 'chat') {
          this._breakpointObserver.observe(this._chatDialogService.singleMemberBreakpoint).pipe(
            filter((state) => !state.matches),
            take(1),
            takeUntil(this._actions$.pipe(filter((action) => this._memberPageNavigated(action) || this._memberPageLeaved(action))))
          ).subscribe(() => {
            this._router.navigateByUrl(`/member/${member.userId}#${prevFragment}`, { replaceUrl: true })
          });
        }
      })
  ), { dispatch: false });

  getImagesForMemberIfBreakpointWillBeReached$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageEntered(action) && !this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint)),
    switchMap(() => this._breakpointObserver.observe(this._chatDialogService.singleMemberBreakpoint).pipe(
      filter((state) => state.matches),
      map(() => getImages({ userId: this._routerStateRef.state.params['id'], info: 'Geting member images from single member page.' })),
      takeUntil(this._actions$.pipe(filter((action) => this._memberPageLeaved(action)))),
    )),
  ));

  getImageForMemberIfBreakpointMatched$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageEntered(action) && this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint)),
    map(() => getImages({ userId: this._routerStateRef.state.params['id'], info: 'Geting member images from single member page.' }))
  ));

  getImagesForSmallViewMemberIfFragmentIsEquelPhotos$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageNavigated(action) &&
                       this._routerStateRef.state.fragment === 'photos' &&
                       !this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint)),
    map(() => getImages({ userId: this._routerStateRef.state.params['id'], info: 'Geting member images from single member page.' }))
  ));

  getChatForSmallViewMemberIfFragmentEquelsChat = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageNavigated(action) &&
                       this._routerStateRef.state.fragment === 'chat' &&
                       this._authStateRef.state.userData != null &&
                       !this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint)),
    map(() => getChat({ targetUserId: this._routerStateRef.state.params['id'], info: 'Geting chat for single member page' }))
  ));

  disposeChatWhenFragmentChange$ = createEffect(() => this._actions$.pipe(
    filter((action) => (this._memberPageNavigated(action) && this._routerStateRef.state.fragment !== 'chat') ||
                       this._memberPageLeaved(action)),
    map(() => leaveChat())
  ))

  getImagesForAuthenticatedUser$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._accountPhotosEntered(action)),
    switchMap(() => this._store.pipe(
      select(({ auth }) => auth.userData!))),
      filter((userData) => userData != null),
      map(({ userId }) => getImages({ userId, info: 'Geting images for authenticatedUser.' }))
  ));

  scrollOnNavigationEnded$ = createEffect(() => this._actions$.pipe(
    ofType(routerRequestAction, routerNavigatedAction),
    tap((action) => {
      if (isActionTypeOf(action, routerRequestAction)) {
        this._scroller.cancel();
      }
    }),
    ofType(routerNavigatedAction),
    skip(1),
    observeOn(asyncScheduler),
    tap(() => {
      const currData = this._routerStateRef.state;
      const prevData = this._routerStateRef.state.prevData;
      if (currData.fullPath === 'privacy' && currData.fullPath === prevData?.fullPath) {
          if (currData.fragment) {
            this._scroller.scroll(`.${currData.fragment}`);
          } else {
            this._scroller.scrollBack();
          }
        return;
      }
      if (currData.fullPath === 'member/:id' && currData.fullPath === prevData?.fullPath) {
        this._scroller.scroll('mat-tab-group', { addOffset: -64 });
        return;
      }

      if (currData.fullPath === 'member/:id' && (currData.fragment === 'chat' || currData.fragment === 'photos')) {
        this._scroller.scroll('mat-tab-group', { addOffset: -64 });
        return;
      }

      this._scroller.scroll('app-navbar', { addOffset: -1 });
    })
  ), { dispatch: false });


  closeChatDialogIfMemberPageLeaved$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageLeaved(action) && this._chatDialogService.isOpen()),
    tap(() => this._chatDialogService.closeCurrentDialog())
  ), { dispatch: false });

  navigateToSingleMemberPhosotOrInfoFragmentIfPreviousWasThat$ = createEffect(() => this._actions$.pipe(
    filter((action) => this._memberPageNavigated(action) && this._breakpointObserver.isMatched(this._chatDialogService.singleMemberBreakpoint)),
    switchMap(() => this._breakpointObserver.observe(this._chatDialogService.singleMemberBreakpoint).pipe(
      filter((state) => !state.matches &&
                        this._routerStateRef.state.prevData != null &&
                        this._routerStateRef.state.prevData.fullPath === 'member/:id' &&
                        (this._routerStateRef.state.prevData.fragment === 'photos' || this._routerStateRef.state.prevData.fragment === 'info') &&
                        !this._chatDialogService.isOpen()),
      tap(() => this._router.navigateByUrl(`member/${this._routerStateRef.state.params['id']}#${this._routerStateRef.state.prevData!.fragment}`)),
      take(1)
    ))
  ), { dispatch: false })


  constructor(private _actions$: Actions,
              private _routerStateRef: RouterStateRef,
              private _chatDialogService: ChatDialogService,
              private _store: Store<AppState>,
              private _breakpointObserver: BreakpointObserver,
              private _router: Router,
              private _scroller: WindowScroller,
              private _authStateRef: AuthStateRef) {}

  private _memberPageEntered(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
           _isSingleMemberPage(this._routerStateRef.state) &&
           !_isSingleMemberPage(this._routerStateRef.state.prevData);
  }

  private _memberPageNavigated(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
           _isSingleMemberPage(this._routerStateRef.state);
  }

  private _memberPageEnteredWithChatFragment(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
           _isSingleMemberPageWithFragment(this._routerStateRef.state, 'chat') &&
           !_isSingleMemberPage(this._routerStateRef.state.prevData);
  }

  private _memberPageLeaved(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
            !_isSingleMemberPage(this._routerStateRef.state) &&
            _isSingleMemberPage(this._routerStateRef.state.prevData);
  }

  private _memberPageFragmentChange(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
           _isSingleMemberPage(this._routerStateRef.state) &&
           _isSingleMemberPage(this._routerStateRef.state.prevData) &&
           this._routerStateRef.state.fragment !== this._routerStateRef.state.prevData!.fragment;
  }

  private _membersPageEntered(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
           _isMembersPage(this._routerStateRef.state) &&
           !_isMembersPage(this._routerStateRef.state.prevData);
  }

  private _membersPageLeaved(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
           !_isMembersPage(this._routerStateRef.state) &&
           _isMembersPage(this._routerStateRef.state.prevData);
  }

  private _membersPageNavigated(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
           _isMembersPage(this._routerStateRef.state);
  }

  private _accountPhotosEntered(action: Action): boolean {
    return isActionTypeOf(action, routerNavigatedAction) &&
           _isAccountPhotosPage(this._routerStateRef.state) &&
           !_isAccountPhotosPage(this._routerStateRef.state.prevData);
  }

}

function _isMembersPage(routerData: RouterStateData | null): boolean {
  return routerData !== null && routerData.fullPath === 'members';
}

function _isSingleMemberPage(routerData: RouterStateData | null): boolean {
  return routerData !== null && routerData.fullPath === 'member/:id';
}

function _isSingleMemberPageWithFragment(routerData: RouterStateData | null, fragment: string | null): boolean {
  return routerData !== null && routerData.fullPath === 'member/:id' && routerData.fragment === fragment;
}

function _isAccountPhotosPage(routerData: RouterStateData | null): boolean {
  return routerData !== null && routerData.fullPath === 'account/photos';
}
