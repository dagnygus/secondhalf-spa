import { LikeEffects } from './state/like/like.effects';
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
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './state/router/router-store-serializer';
import { RouterEffects } from './state/router/router-store.effects';

export interface AppState {
  auth: AuthState;
  members: MembersState;
  member: MemberState;
  chat: ChatState;
  notification: NotificationState;
  image: ImageState;
  router?: RouterReducerState<RouterStateUrl>
}

export const appRootReducers = {
  auth: authReducer,
  notification: notificationReducer,
  chat: chatReducer,
  image: imageReducer,
};

export const appReducers = {
  auth: authReducer,
  members: membersReducer,
  member: memberReducer,
  chat: chatReducer,
  notification: notificationReducer,
  image: imageReducer,
  router: routerReducer
};

export const effects = [
  AuthEffects,
  MembersEffects,
  MemberEffects,
  ChatEffects,
  NotificationEffects,
  ImageEffects,
  NotificationEffects,
  RouterEffects,
  LikeEffects
];

export const rootEffects = [
  AuthEffects,
  ChatEffects,
  NotificationEffects
];


