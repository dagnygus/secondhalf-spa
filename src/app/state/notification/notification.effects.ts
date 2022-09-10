/* eslint-disable max-len */
import { AppState } from 'src/app/app.ngrx.utils';
import { autoLogin, autoLogout, logoutFromUser } from './../auth/auth.actions';
import { deleteNotificationFailed, deleteNotificationStart, deleteNotificationSuccess, removeTemporaryNotification, setInitialNotificationState, setNotifications } from './notification.actions';
import { map, mergeMap, takeUntil, exhaustMap, catchError } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { signinSuccess } from '../auth/auth.actions';
import { Firestore, doc, docSnapshots } from '@angular/fire/firestore';
import { NotificationsModel, NotificationType } from 'src/app/models/notification-model';
import { NotificationState } from './notification.state';
import { merge, of } from 'rxjs';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { NOTIFICATION_URL } from 'src/app/utils/constans';

export interface DeleteNotificationReqBody {
  sourceUserId: string;
  targetUserId: string;
  createdAt: string;
  type: NotificationType;
}


@Injectable()
export class NotificationEffects {

  getOrUpdateNotifications$ = createEffect(() => merge(
    this._actions$.pipe(ofType(signinSuccess)),
    this._actions$.pipe(ofType(autoLogin)),
  ).pipe(
    mergeMap(() => {

      const userId = this._stateSnapshotService.getAuthState().userData!.userId;
      const docRef = doc(this._firestore, `notifications/${userId}`);

      return docSnapshots<NotificationsModel>(docRef as any).pipe(
        map((ntfSnap) => {

          if (!ntfSnap.exists()) {
            return setInitialNotificationState();
          }

          const newState: NotificationState = {
            notifications: ntfSnap.data().notifications
          };

          return setNotifications({ newState });
        }),
        takeUntil(merge(
          this._actions$.pipe(ofType(autoLogout)),
          this._actions$.pipe(ofType(logoutFromUser))
        ))
      );
    }),
  ));

  clearNotificationState$ = createEffect(() => merge(
    this._actions$.pipe(ofType(autoLogout)),
    this._actions$.pipe(ofType(logoutFromUser))
  ).pipe(
    map(() => setInitialNotificationState())
  ));

  deleteNotification = createEffect(() => this._actions$.pipe(
    ofType(deleteNotificationStart),
    exhaustMap(({ index }) => {
      const oldState = this._stateSnapshotService.getNotificationState();
      const authUserData = this._stateSnapshotService.getAuthState().userData!;
      const notificationToRemove = oldState.notifications[index];
      const newNotifications = oldState.notifications.slice();
      newNotifications.splice(index, 0);
      const newState: NotificationState = {
        notifications: newNotifications
      };

      this._store.dispatch(removeTemporaryNotification({ newState }));

      const reqBody: DeleteNotificationReqBody = {
        sourceUserId: authUserData.userId,
        targetUserId: notificationToRemove.uid,
        createdAt: notificationToRemove.createdAt,
        type: notificationToRemove.type
      };

      return this._httpClient.delete<void>(NOTIFICATION_URL, { body: reqBody }).pipe(
        map(() => deleteNotificationSuccess()),
        catchError(() => of(deleteNotificationFailed({ oldState })))
      );
    })
  ));

  constructor(private readonly _actions$: Actions,
              private readonly _firestore: Firestore,
              private readonly _stateSnapshotService: StateSnapshotService,
              private readonly _httpClient: HttpClient,
              private readonly _store: Store<AppState>) {}
}
