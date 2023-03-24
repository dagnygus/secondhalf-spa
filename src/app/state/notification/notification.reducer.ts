import {removeTemporaryNotification, setInitialNotificationState, updateNotificationState } from './notification.actions';
import { initialState } from './notification.state';
import { createReducer, on } from '@ngrx/store';

export const notificationReducer = createReducer(
  initialState,
  on(removeTemporaryNotification, (_, { newState }) =>  newState),
  on(setInitialNotificationState, () => initialState),
  on(updateNotificationState, (_, { newState }) => newState),
);
