import { CHAT_URL, MESSAGE_URL } from './../../utils/constans';
import { ChatModel } from 'src/app/models/chat-model';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
// eslint-disable-next-line max-len
import { getChatStart, getChatSuccess, leaveChat, updateChat, sendMessageStart, sendMessageSuccess, sendMessageFailed } from './chat.actions';
import { exhaustMap, tap, takeUntil, map, catchError } from 'rxjs/operators';
// eslint-disable-next-line max-len
import { Firestore, doc, getDoc, DocumentReference, DocumentSnapshot, docSnapshots } from '@angular/fire/firestore';
import { ChatState } from './chat.state';
import { of } from 'rxjs';

@Injectable()
export class ChatEffects {

  getChat$ = createEffect(() => this._actions$.pipe(
    ofType(getChatStart),
    exhaustMap(async ({ targetUserId }) => {

      const sourceUserId = this._stateSnapshotService.getAuthState().userData!.userId;
      const chatId = sourceUserId < targetUserId ? `${sourceUserId}_${targetUserId}` : `${targetUserId}_${sourceUserId}`;
      const docRef = doc(this._firestore, `chats/${chatId}`) as DocumentReference<ChatModel>;
      let docSnap: DocumentSnapshot<ChatModel>;

      try {
        docSnap = await getDoc<ChatModel>(docRef);
      } catch {
        const body = {
          sourceUserId,
          targetUserId,
        };
        await this._httpClient.put<void>(CHAT_URL, body).toPromise();
        docSnap = await getDoc<ChatModel>(docRef);
      }

      const newState: ChatState = {
        targetUserId,
        messages: docSnap.data()!.messages
      };

      return { chatId, newState, docRef  };
    }),
    tap({
      next: ({ newState, docRef }) => {
        this._store.dispatch(getChatSuccess({ newState }));

        docSnapshots<ChatModel>(docRef).pipe(
          takeUntil(this._actions$.pipe(ofType(leaveChat))),
        ).subscribe((chatSnap) => {
          const messages = chatSnap.data()!.messages;
          this._store.dispatch(updateChat({ messages }));
        });
      }
    })
  ), { dispatch: false });

  sendMessage$ = createEffect(() => this._actions$.pipe(
    ofType(sendMessageStart),
    exhaustMap(({ content }) => {
      const sourceUserId = this._stateSnapshotService.getAuthState().userData!.userId;
      const targetUserId = this._stateSnapshotService.getChatState().targetUserId;

      const body = {
        sourceUserId,
        targetUserId,
        content
      };

      return this._httpClient.post<void>(MESSAGE_URL, body).pipe(
        map(() => sendMessageSuccess()),
        catchError(() => of(sendMessageFailed()))
      );
    })
  ));

  constructor(private readonly _actions$: Actions,
              private readonly _firestore: Firestore,
              private readonly _store: Store<AppState>,
              private readonly _httpClient: HttpClient,
              private readonly _stateSnapshotService: StateSnapshotService) {
  }

}


