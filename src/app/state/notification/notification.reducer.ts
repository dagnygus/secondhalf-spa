import { removeAt } from './../../utils/array-immutable-actions';
import { deleteNotificationFailed, removeTemporaryNotification, setInitialNotificationState, setNotifications } from './notification.actions';
import { initialState, NotificationState } from './notification.state';
import { createReducer, on } from '@ngrx/store';

export const notificationReducer = createReducer(
  initialState,
  on(setNotifications, removeTemporaryNotification, (_, { newState }) =>  newState),
  on(deleteNotificationFailed, (_, { oldState }) => oldState),
  on(setInitialNotificationState, () => initialState)
);
