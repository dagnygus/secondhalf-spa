/* eslint-disable @typescript-eslint/no-shadow */
import { createAction, props } from '@ngrx/store';
import { NotificationState } from './notification.state';

export enum NotificationActionNames {
  setNotifications = '[Firebase] Get and update notifications after authentication',
  deleteNotificationStart = '[Notification] delete notification start',
  deleteNotificationSuccess = '[Notification] delete notification success',
  deleteNotificationFailed = '[Notification] delete notification failed',
  removeTemporaryNotification = '[Notification] remove temporary notification',
  setInitialState = 'clear notification state',
}

export const setNotifications = createAction(
  NotificationActionNames.setNotifications,
  props<{ newState: NotificationState }>()
);

export const setInitialNotificationState = createAction(
  NotificationActionNames.setInitialState
);

export const deleteNotificationStart = createAction(
  NotificationActionNames.deleteNotificationStart,
  props<{ index: number }>()
);

export const removeTemporaryNotification = createAction(
  NotificationActionNames.removeTemporaryNotification,
  props<{ newState: NotificationState }>()
);

export const deleteNotificationSuccess = createAction(
  NotificationActionNames.deleteNotificationSuccess
);

export const deleteNotificationFailed = createAction(
  NotificationActionNames.deleteNotificationFailed,
  props<{ oldState: NotificationState }>()
);
