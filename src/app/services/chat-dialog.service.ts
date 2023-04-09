import { leaveChat } from './../state/chat/chat.actions';
import { observeOn, take, takeUntil, tap } from 'rxjs/operators';
import { asyncScheduler, filter, Subject, Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, OnDestroy } from '@angular/core';
import { bindInputs, ChatDialogComponent } from '../modules/shared/components/chat-dialog/chat-dialog.component';
import { Router, NavigationEnd } from '@angular/router';
import { AppState } from '../app.ngrx.utils';
import { Store } from '@ngrx/store';
import { ChatEvents } from '../state/chat/chat.effects';
import { getChat } from '../state/chat/chat.actions';

@Injectable({ providedIn: 'root' })
export class ChatDialogService implements OnDestroy {


  get currentChatUserId(): string | null { return this._uid; }
  get currentChatDialog(): ComponentRef<ChatDialogComponent> | null { return this._componentRef; }
  onOpen = new Subject<void>();
  onClose = new Subject<void>();
  readonly singleMemberBreakpoint = '(min-width: 580px)';

  private _overlayRef: OverlayRef | null = null;
  private _subscription: Subscription | null = null;
  private _routerSubscription: Subscription;
  private _argsToApply: any = null;
  private _componentRef: ComponentRef<ChatDialogComponent> | null = null;
  private _isOpen = false;
  private _uid: string | null = null;

  constructor(private readonly _overlay: Overlay,
              private readonly _positionStrategy: OverlayPositionBuilder,
              private readonly _breakpointObserver: BreakpointObserver,
              private readonly _chatEvents: ChatEvents,
              private readonly _store: Store<AppState>,
              router: Router) {
    this._routerSubscription = router.events.pipe(
      filter((event) => this._argsToApply !== null && event instanceof NavigationEnd),
      observeOn(asyncScheduler)
    ).subscribe(() => {
      this.openChatDialog.apply(this, this._argsToApply);
      this._argsToApply = null;
    })
  }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this.onOpen.complete();
    this.onClose.complete()
  }

  isOpen(): this is this & { currentChatDialog: ComponentRef<ChatDialogComponent>, currentChatUserId: string } {
    return this._isOpen;
  }

  closeCurrentDialog(): void {
    if (this._overlayRef) {
      this._store.dispatch(leaveChat());
      this._uid = null;
      this._overlayRef.detach();
      const overlayRef = this._overlayRef;
      this._overlayRef = null;
      this._componentRef = null;
      this._subscription?.unsubscribe();
      this._isOpen = false
      this.onClose.next();
      setTimeout(() => {
        overlayRef.dispose();
      }, 301);
    }
  }

  openChatDialog(userId: string): ChatDialogComponent;
  openChatDialog(userId: string, breakpoint: string): ChatDialogComponent | null;
  openChatDialog(userId: string, breakpoint?: string): ChatDialogComponent | null {
    if (breakpoint && !this._breakpointObserver.isMatched(breakpoint)) { return null; }

    if (this._componentRef) {
      const instace = this._componentRef.instance;
      if (instace.targetUserId === userId) {
        return this._componentRef.instance;
      } else {
        this.closeCurrentDialog();
      }
    }

    this._uid = userId;

    const overlayRef = this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._positionStrategy.global().centerHorizontally().centerVertically(),
    });

    const componentRef = this._componentRef = overlayRef.attach(new ComponentPortal(ChatDialogComponent));
    componentRef.instance.targetUserId = userId;
    componentRef.instance.onClose.pipe(take(1)).subscribe(() => this.closeCurrentDialog());
    overlayRef.backdropClick().pipe(
      take(1),
      filter((e: Event) => e.target !== overlayRef.backdropElement),
      takeUntil(this.onClose)
    ).subscribe(() => this.closeCurrentDialog());

    this._isOpen = true;

    bindInputs(componentRef, this._store, this._chatEvents);

    this._store.dispatch(getChat({ targetUserId: userId, info: 'ChatDialogService - geting chat' }));

    if (breakpoint == null) { return componentRef.instance; }
    const subscription = this._subscription = this._breakpointObserver.observe(breakpoint).pipe(
      takeUntil(this.onClose)
    ).subscribe((state) => {
      if (!state.matches) {
        subscription.unsubscribe();
        this.closeCurrentDialog();
      }
    });

    this.onOpen.next()
    return componentRef.instance;
  }

  openChatDialogOnNextRoute(userId: string, breakpoint?: string): void {
    this._argsToApply = [ userId, breakpoint ];

  }
}
