import { PageComponent } from './../../directives/page.component';
import { ChatDialogService } from './../../services/chat-dialog.service';
import { ChatDialogComponent } from './../chat-dialog/chat-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit, HostBinding, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/services/localstorage.service';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.ngrx.utils';
import { select, Store } from '@ngrx/store';
import { NotificationModel, NotificationType } from 'src/app/models/notification-model';
import { distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { deleteNotificationStart } from 'src/app/state/notification/notification.actions';
import { Overlay, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent extends PageComponent implements OnDestroy {

  notifications!: readonly NotificationModel[];

  private _destroy$ = new Subject<void>();

  constructor(private readonly _router: Router,
              private readonly _store: Store<AppState>,
              private readonly _chatDialogService: ChatDialogService,
              private readonly _brkpointObserver: BreakpointObserver,
              cd: ChangeDetectorRef) {
    super();
    _store.pipe(
      select((appState) => appState.notification.notifications),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.notifications = value;
      cd.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onNotificationClick(userId: string, index: number, type: NotificationType): void {

    switch (type) {
      case 'like-notification':
        this._store.dispatch(deleteNotificationStart({ index }));
        if (this._brkpointObserver.isMatched('(min-width: 580px)')) {
          this._router.navigate(['/', 'member', userId]);
        } else {
          this._router.navigate(['/', 'member', userId], { fragment: 'info' });
        }
      break;
      case 'chat-notification':
        if (this._brkpointObserver.isMatched('(min-width: 560px)')) {
          const { photoUrl, nickName } = this.notifications[index];
          this._chatDialogService.openChatDialog(userId, nickName, photoUrl, '(min-width: 580px)');
          this._store.dispatch(deleteNotificationStart({ index }));
          return;
        }
        this._router.navigate(['/', 'member', userId], { fragment: 'chat' });
      break;
    }

    this._store.dispatch(deleteNotificationStart({ index }));
  }

  trackBy(_: number, model: NotificationModel): string {
    return model.uid + model.createdAt;
  }

}
