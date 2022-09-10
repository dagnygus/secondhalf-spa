/* eslint-disable @typescript-eslint/no-shadow */
import { createAction, props } from '@ngrx/store';
import { MessageModel } from 'src/app/models/chat-model';
import { ChatState } from './chat.state';

export enum ChatActionNames {
  getChatStart = '[Member Page - Chat tab] get chat start',
  getChatSuccess = '[Member Page - Chat tab] get chat success',
  getChatFailed = '[Member Page - Chat tab] get chat failed',
  sendMessageStart = '[Member Page - Chat tab] send message start',
  sendMessageSuccess = '[Member Page - Chat tab] send message success',
  sendMessageFailed = '[Member Page - Chat tab] send message start',
  leaveChat = '[Member Page - Chat tab] leave chat',
  updateChat = '[Server] update chat'
}

export const getChatStart = createAction(
  ChatActionNames.getChatStart,
  props<{ targetUserId: string }>()
);

export const getChatSuccess = createAction(
  ChatActionNames.getChatSuccess,
  props<{ newState: ChatState }>()
);

export const getChatFailed = createAction(
  ChatActionNames.getChatFailed,
);

export const sendMessageStart = createAction(
  ChatActionNames.sendMessageStart,
  props<{ content: string }>()
);

export const sendMessageSuccess = createAction(
  ChatActionNames.sendMessageSuccess,
);

export const sendMessageFailed = createAction(
  ChatActionNames.sendMessageFailed,
);

export const leaveChat = createAction(ChatActionNames.leaveChat);

export const updateChat = createAction(ChatActionNames.updateChat, props<{ messages: MessageModel[] }>());
