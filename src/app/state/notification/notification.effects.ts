import { ChatDialogService } from 'src/app/services/chat-dialog.service';
import { assertNotNullAuthState, AuthStateRef } from './../auth/auth.state';
import { initialState, NotificationStateRef } from './notification.state';
import { UrlService } from 'src/app/services/url.service';
import { logout, signIn, updateAuthState } from './../auth/auth.actions';
import { deletionConfirmed, removeNotification, notificationHttpError , setInitialNotificationState, updateNotificationState } from './notification.actions';
import { map, takeUntil, exhaustMap, catchError, switchMap, startWith, filter } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Firestore, doc, docSnapshots } from '@angular/fire/firestore';
import { NotificationsModel, NotificationType } from 'src/app/models/notification-model';
import { NotificationState } from './notification.state';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { assertNotNull } from 'src/app/utils/others';
import { isPrevActionTypeOf, isActionTypeOf } from '../utils';

export interface DeleteNotificationReqBody {
  sourceUserId: string;
  targetUserId: string;
  createdAt: string;
  type: NotificationType;
}


@Injectable()
export class NotificationEffects {

  getOrUpdateNotifications$ = createEffect(() => this._actions$.pipe(
    ofType(updateAuthState),
    filter((action) => isPrevActionTypeOf(action, signIn) || action.info === 'Autologin.'),
    switchMap((action) => {

      assertNotNullAuthState(this._authStateRef.state);

      const userId = this._authStateRef.state.userData.userId;
      const docRef = doc(this._firestore, `notifications/${userId}`);

      return docSnapshots<NotificationsModel>(docRef as any).pipe(
        map((ntfSnap) => {

          if (!ntfSnap.exists()) {
            return setInitialNotificationState();
          }

          let newNotifications = ntfSnap.data().notifications
            .filter((not) => not.type === 'like-notification' || not.uid !== this._chatDialogService.currentChatUserId);

          const newState: NotificationState = {
            notifications: newNotifications
          };

          return updateNotificationState({ newState, prevAction: action });
        }),
        takeUntil(this._actions$.pipe(
          filter((action) => isActionTypeOf(action, updateAuthState) && isPrevActionTypeOf(action, logout)))
        )
      );
    })
  ));

  clearNotificationState$ = createEffect(() => this._actions$.pipe(
    ofType(updateAuthState),
    filter((action) => isPrevActionTypeOf(action, logout)),
    map(() => updateNotificationState({ newState: initialState, info: 'Notification state cleaned after user logout.' })
  )));

  deleteNotification$ = createEffect(() => this._actions$.pipe(
    ofType(removeNotification),
    exhaustMap((action) => {
      const oldState = this._notificationStateRef.state;
      const authUserData = this._authStateRef.state.userData;

      assertNotNull(authUserData);

      const notificationToRemove = oldState.notifications[action.index];
      const newNotifications = oldState.notifications.slice();
      newNotifications.splice(action.index, 0);
      const newState: NotificationState = {
        notifications: newNotifications
      };

      const reqBody: DeleteNotificationReqBody = {
        sourceUserId: authUserData.userId,
        targetUserId: notificationToRemove.uid,
        createdAt: notificationToRemove.createdAt,
        type: notificationToRemove.type
      };

      return this._httpClient.delete<void>(this._urlServcie.notificationUrl, { body: reqBody }).pipe(
        map(() => deletionConfirmed()),
        catchError(() => of(notificationHttpError({ oldState, prevAction: action, info: 'Failed to remove from backend.' }))),
        startWith(updateNotificationState({ newState, prevAction: action, info: 'Removind and waiting for conirmation.' }))
      );
    })
  ));

  restoreOldState$ = createEffect(() => this._actions$.pipe(
    ofType(notificationHttpError),
    filter((action) => isPrevActionTypeOf(action, removeNotification)),
    map((action) => updateNotificationState({ newState: action.oldState, prevAction: action, info: 'Restoring old state aflter deletion faild.' }))
  ));

  constructor(private readonly _actions$: Actions,
              private readonly _firestore: Firestore,
              private readonly _notificationStateRef: NotificationStateRef,
              private readonly _authStateRef: AuthStateRef,
              private readonly _httpClient: HttpClient,
              private readonly _urlServcie: UrlService,
              private readonly _chatDialogService: ChatDialogService) {}
}
