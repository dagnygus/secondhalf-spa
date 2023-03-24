import { ChatDialogService } from '../../../../services/chat-dialog.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.ngrx.utils';
import { select, Store } from '@ngrx/store';
import { NotificationModel } from 'src/app/models/notification-model';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { removeNotification } from 'src/app/state/notification/notification.actions';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent extends PageComponent {

  notifications$: Observable<readonly NotificationModel[]>

  dumy: NotificationModel = {
    type: 'like-notification',
    uid: 'anjsdkjndsa',
    email: 'hasdnansd@jfasnbb.ocm',
    createdAt: '1999-02-02',
    firstName: 'Helene',
    lastName: 'Stark',
    nickName: 'Helene',
  }

  @Output() notificationClick = new EventEmitter<void>();

  constructor(private readonly _router: Router,
              private readonly _store: Store<AppState>,
              private readonly _chatDialogService: ChatDialogService,
              private readonly _brkpointObserver: BreakpointObserver,) {
    super();
    this.notifications$ = this._store.pipe(
      select(({ notification }) => notification.notifications)
    );
  }

  onNotificationClick(index: number, notification: NotificationModel): void {

    this.notificationClick.emit();

    switch (notification.type) {
      case 'like-notification':
        this._store.dispatch(removeNotification({ index, info: 'Removing notification from app-notifications component' }));
        if (this._brkpointObserver.isMatched('(min-width: 580px)')) {
          this._router.navigate(['/', 'member', notification.uid]);
        } else {
          this._router.navigate(['/', 'member', notification.uid], { fragment: 'info' });
        }
      break;
      case 'chat-notification':
        if (this._brkpointObserver.isMatched('(min-width: 560px)')) {
          const { photoUrl, nickName } = notification;
          this._chatDialogService.openChatDialogOnNextRoute(notification.uid, nickName, photoUrl, '(min-width: 580px)');
          this._store.dispatch(removeNotification({ index, info: 'Removing notification from app-notifications component' }));
          return;
        }
        this._router.navigate(['/', 'member', notification.uid], { fragment: 'chat' });
      break;
    }

    this._store.dispatch(removeNotification({ index, info: 'Removing notification from app-notifications component' }));
  }

  trackBy(_: number, model: NotificationModel): string {
    return model.uid + model.createdAt;
  }

}
