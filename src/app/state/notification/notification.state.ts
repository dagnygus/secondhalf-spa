import { emptyArr } from 'src/app/utils/array-immutable-actions';
import { NotificationModel } from './../../models/notification-model';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface NotificationState {
  readonly notifications: readonly NotificationModel[];
}

export const initialState: NotificationState = {
  notifications: emptyArr,
};
