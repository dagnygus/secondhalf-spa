import { Subject, Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { ChatDialogComponent } from '../modules/shared/components/chat-dialog/chat-dialog.component';

@Injectable({ providedIn: 'root' })
export class ChatDialogService {
  onBreakpointLeave = new Subject<void>();
  onClose = new Subject<void>();

  private _overlayRef: OverlayRef | null = null;
  private _subscription: Subscription | null = null;

  constructor(private readonly _overlay: Overlay,
              private readonly _positionStrategy: OverlayPositionBuilder,
              private readonly _breakpointObserver: BreakpointObserver) {}

  openChatDialog(userId: string, nickName: string, photoUrl: string | null | undefined, breakpoint?: string): void {
    if (this._overlayRef) { return; }

    const overlayRef = this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._positionStrategy.global().centerHorizontally().centerVertically(),
    });

    const componentRef = overlayRef.attach(new ComponentPortal(ChatDialogComponent));
    componentRef.instance.memberNickName = nickName;
    componentRef.instance.imageUrl = photoUrl;
    componentRef.instance.targetUserId = userId;
    componentRef.instance.onClose.subscribe(() => {
      overlayRef.detach();
      this._overlayRef = null;
      this._subscription?.unsubscribe();
      this.onClose.next();
    });
    overlayRef.backdropClick().subscribe(() => {
      overlayRef.detach();
      this._overlayRef = null;
      this._subscription?.unsubscribe();
      this.onClose.next();
    });

    if (breakpoint == null) { return; }
    this._setBeakpoint(breakpoint);
  }

   private _setBeakpoint(breakpoint: string) {
    if (!this._breakpointObserver.isMatched(breakpoint)) {
      this._overlayRef?.detach();
      this._overlayRef = null;

      setTimeout(() => {
        this.onBreakpointLeave.next();
        this.onBreakpointLeave.complete();
        this.onClose.next();
      });
      return;
    }

    const subscription = this._subscription = this._breakpointObserver.observe(breakpoint).subscribe((state) => {
      if (!state.matches) {
        this._overlayRef?.detach();
        this._overlayRef = null;
        subscription.unsubscribe();
        this._subscription = null;
        this.onBreakpointLeave.next();
        this.onBreakpointLeave.complete();
      }
    });
  }
}
