
import { AppState } from 'src/app/app.ngrx.utils';
import { Injectable, OnDestroy } from '@angular/core';
import { emptyArr } from 'src/app/utils/constans';
import { MessageModel } from '../../models/chat-model';
import { Store } from '@ngrx/store';
import { BaseStateRef } from '../utils';


export interface ChatState {
  readonly targetUserId: string | null;
  readonly messages: readonly MessageModel[];
}

export const initialState: ChatState = {
  targetUserId: null,
  messages: emptyArr
};

@Injectable({ providedIn: 'root' })
export class ChatStateRef extends BaseStateRef<ChatState> implements OnDestroy {

  constructor(store: Store<AppState>) {
    super(store.select(({ chat }) => chat))
  }

}
