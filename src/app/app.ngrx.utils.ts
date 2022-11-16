import { ImageEffects } from './state/image/image.effects';
import { ChatEffects } from './state/chat/chat.effects';
import { NotificationState } from './state/notification/notification.state';
import { MembersEffects } from './state/members/members.effects';
import { authReducer } from './state/auth/auth.reducer';
import { AuthState } from './state/auth/auth.state';
import { memberReducer } from './state/member/member.reducer';
import { MemberState } from './state/member/member.state';
import { membersReducer } from './state/members/members.reducer';
import { MembersState } from './state/members/members.state';
import { AuthEffects } from './state/auth/auth.effects';
import { MemberEffects } from './state/member/member.effects';
import { chatReducer } from './state/chat/chat.reducer';
import { ChatState } from './state/chat/chat.state';
import { notificationReducer } from './state/notification/notification.reducer';
import { NotificationEffects } from './state/notification/notification.effects';
import { ImageState } from './state/image/image.state';
import { imageReducer } from './state/image/image.reducer';

export interface AppState {
  auth: AuthState;
  members: MembersState;
  member: MemberState;
  chat: ChatState;
  notification: NotificationState;
  image: ImageState;
}

export const appRootReducers = {
  auth: authReducer,
  notification: notificationReducer,
  chat: chatReducer,
  image: imageReducer
};

export const appReducers = {
  auth: authReducer,
  members: membersReducer,
  member: memberReducer,
  chat: chatReducer,
  notification: notificationReducer,
  image: imageReducer
};

export const effects = [
  AuthEffects,
  MembersEffects,
  MemberEffects,
  ChatEffects,
  NotificationEffects,
  ImageEffects,
  NotificationEffects
];

export const rootEffects = [
  AuthEffects,
  ChatEffects,
  NotificationEffects
];

export type StateStatus = 'empty' | 'pending' | 'complete' | 'error';
