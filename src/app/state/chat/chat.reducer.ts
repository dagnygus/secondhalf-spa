import { leaveChat, updateChatState } from './chat.actions';
import { createReducer, on } from '@ngrx/store';
import { ChatState, initialState } from './chat.state';

export const chatReducer = createReducer<ChatState>(
  initialState,
  on(updateChatState, (_, { newState }) => newState),
  on(leaveChat, () => initialState)
);
