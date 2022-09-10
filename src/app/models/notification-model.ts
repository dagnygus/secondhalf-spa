export interface NotificationsModel {
  size: number;
  notifications: NotificationModel[];
}

export type NotificationModel = LikeNotificationModel | ChatNotificationModel;
export type NotificationType = 'like-notification' | 'chat-notification';

export interface MutableLikeNotificationModel {
  type: 'like-notification';
  uid: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  createdAt: string;
  photoUrl?: string | null | undefined;
}

export type LikeNotificationModel = Readonly<MutableLikeNotificationModel>;

export interface MutableChatNotificationModel {
  type: 'chat-notification';
  uid: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  createdAt: string;
  messageContent: string;
  photoUrl?: string | null | undefined;
}

export type ChatNotificationModel = Readonly<MutableChatNotificationModel>;
