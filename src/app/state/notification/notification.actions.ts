/* eslint-disable @typescript-eslint/no-shadow */
import { Action, createAction, props } from '@ngrx/store';
import { NotificationState } from './notification.state';

export enum NotificationActionNames {
  update = '[Notification] Update notification state.',
  removeNotification = '[Notification] Remove notification.',
  deletionConfirmed = '[Notification] Successful removed from backend.',
  httpError = '[Notification] Http error.',
  setNotifications = '[Firebase] Get and update notifications after authentication',
  removeTemporaryNotification = '[Notification] remove temporary notification',
  setInitialState = 'clear notification state',
}

export const updateNotificationState = createAction(NotificationActionNames.update, props<{ newState: NotificationState, prevAction?: Action, info?: string }>());
export const removeNotification = createAction(NotificationActionNames.removeNotification, props<{ index: number, info: string }>());
export const deletionConfirmed = createAction(NotificationActionNames.deletionConfirmed);
export const notificationHttpError = createAction(NotificationActionNames.httpError, props<{ oldState: NotificationState, prevAction: Action, info: string }>());

export const setInitialNotificationState = createAction(
  NotificationActionNames.setInitialState
);

export const removeTemporaryNotification = createAction(
  NotificationActionNames.removeTemporaryNotification,
  props<{ newState: NotificationState }>()
);

