export interface MutableChatModel {
  size: number;
  createdAt: string;
  UIDs: string[];
  messages: MessageModel[];
}

export type ChatModel = Readonly<MutableChatModel>;

export interface MutableMessageModel {
  ownerID: string;
  content: string;
  createdAt: string;
}

export type MessageModel = Readonly<MutableMessageModel>;

export enum ChatModelFieldNames {
  size = 'size',
  createdAt = 'createdAt',
  UIDs = 'UIDs',
  messages = 'messages'
}

export enum MessageModelFieldNames {
  ownerID = 'ownerID',
  content = 'content',
  createdAt = 'createdAt'
}
