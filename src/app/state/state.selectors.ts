import { selectImageState } from './image/image.selectors';
import { selectNotificationState, selectNotifications } from './notification/notification.selectors';
import { selectChatState } from './chat/chat.selectors';
import { createSelector } from '@ngrx/store';
import { selectAuthState, selectAuthUser } from './auth/auth.selectors';
import { selectMemberState } from './member/member.selectors';
import { membersStateSelector, selectMembers } from './members/members.selectors';

export const selectMembersStateAndAuthState = createSelector(
  selectAuthState,
  membersStateSelector,
  (authState, membersState) => ({ authState, membersState })
);

export const selectMemberStateWithMembersState = createSelector(
  selectMemberState,
  membersStateSelector,
  (memberState, membersState) => ({ memberState, membersState })
);

export const selectAuthAndMemberAndMemberStates = createSelector(
  selectAuthState,
  selectMemberState,
  membersStateSelector,
  (authState, memberState, membersState) => ({ authState, memberState, membersState })
);

export const selectChatStateWithAuthState = createSelector(
  selectChatState,
  selectAuthState,
  (chatState, authState) => ({ chatState, authState })
);

export const selectNotificationAndAuthUser = createSelector(
  selectAuthUser,
  selectNotifications,
  (authUser, notifications) => ({ authUser, notifications })
);

export const selectAuthUserIdWithImageState = createSelector(
  selectAuthUser,
  selectImageState,
  (authUser, imageState) => ({ userId: authUser!.userId, imageState })
);

export const selectImageStateWithMainImageUrl = createSelector(
  selectImageState,
  selectAuthState,
  ({ userId, images }, { userData }) => ({ userId, images, mainImageUrl: userData ? userData.mainImageUrl : null })
);
