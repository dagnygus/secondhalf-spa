/* eslint-disable @typescript-eslint/no-shadow */
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentReference } from '@angular/fire/firestore';
import { Action, createAction, props } from '@ngrx/store';
import { ChatModel } from 'src/app/models/chat-model';
import { ChatState } from './chat.state';

export enum ChatActionNames {
  sendMessageStart = '[Chat] Send message start',
  sendMessageSuccess = '[Chat] Send message success',
  sendMessageFailed = '[Chat] Send message failed',
  leaveChat = '[Chat] leave chat',
  update = '[Chat] Update chat state.',
  getChat = '[Chat] Get chat.',
  error = '[Chat] chat state error,'
}

export const getChat = createAction(ChatActionNames.getChat, props<{ targetUserId: string, info: string }>())
export const updateChatState = createAction(ChatActionNames.update, props<{ newState: ChatState, prevAction?: Action, info?: string, chatId?: string }>())
export const sendMessageStart = createAction(ChatActionNames.sendMessageStart, props<{ content: string }>());
export const sendMessageSuccess = createAction(ChatActionNames.sendMessageSuccess);
export const sendMessageFailed = createAction(ChatActionNames.sendMessageFailed);
export const leaveChat = createAction(ChatActionNames.leaveChat);
export const chatError = createAction(ChatActionNames.error, props<{ httpError: HttpErrorResponse, prevAction: Action }>())
