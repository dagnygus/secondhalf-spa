import { updateChat , getChatSuccess, leaveChat } from './chat.actions';
import { createReducer, on } from '@ngrx/store';
import { ChatState, initialState } from './chat.state';

export const chatReducer = createReducer<ChatState>(
  initialState,
  on(getChatSuccess, (_, action) => action.newState),
  on(updateChat, (state, { messages }) => ({ ...state, messages })),
  on(leaveChat, () => initialState)
);
