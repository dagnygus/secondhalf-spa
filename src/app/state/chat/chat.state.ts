import { emptyArr } from 'src/app/utils/array-immutable-actions';
import { MessageModel } from '../../models/chat-model';


export interface ChatState {
  readonly targetUserId: string | null;
  readonly messages: readonly Readonly<MessageModel>[];
}

export const initialState: ChatState = {
  targetUserId: null,
  messages: emptyArr
};
