import { assertNotNullAuthState, AuthStateRef } from './../auth/auth.state';
import { UrlService } from 'src/app/services/url.service';
import { ChatModel } from 'src/app/models/chat-model';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store } from '@ngrx/store';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StateSnapshotService } from 'src/app/services/state-snapshot.service';
import { leaveChat, sendMessageStart, sendMessageSuccess, sendMessageFailed, getChat, updateChatState, chatError } from './chat.actions';
import { exhaustMap, tap, takeUntil, map, catchError, retry, switchMap, filter, distinctUntilChanged, share, shareReplay, startWith, take } from 'rxjs/operators';
import { Firestore, doc, getDoc, DocumentReference, DocumentSnapshot, docSnapshots } from '@angular/fire/firestore';
import { ChatState, ChatStateRef } from './chat.state';
import { firstValueFrom, of, merge, Subscription, Observable, ReplaySubject, lastValueFrom } from 'rxjs';
import { isActionTypeOf, AsyncActionStatus, isPrevActionTypeOf, StateStatus } from '../utils';
import { logout } from '../auth/auth.actions';

@Injectable()
export class ChatEffects {

  private _currentChatDocRef: DocumentReference<ChatModel> | null = null;

  getChat$ = createEffect(() => this._actions$.pipe(
    ofType(getChat),
    exhaustMap(async (action) => {
      const { targetUserId } = action
      const sourceUserId = this._authStateRef.state.userData!.userId;
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

        try {
          await lastValueFrom(this._httpClient.put<void>(this._urlService.chatUrl, body));
          docSnap = await getDoc<ChatModel>(docRef);
        } catch (httpError: any) {
          return chatError({ httpError, prevAction: action })
        }
      }

      const newState: ChatState = {
        targetUserId,
        messages: docSnap.data()!.messages
      };

      return updateChatState({ newState, chatId, prevAction: action  });
    })
  ));

  subscrubeToChat$ = createEffect(() => this._actions$.pipe(
    ofType(updateChatState),
    filter(({ newState,  chatId }) => newState.targetUserId != null && chatId != null),
    switchMap((action) => {
        const docRef = doc(this._firestore, `chats/${action.chatId!}`) as DocumentReference<ChatModel>;
        return docSnapshots<ChatModel>(docRef!).pipe(map((chatSnap) => {

        const messages = chatSnap.data()!.messages;
        const targetUserId = this._chatStateRef.state.targetUserId;
        const newState: ChatState = {
          targetUserId,
          messages
        };

        return updateChatState({ newState, prevAction: action, info: 'Websocket push' });
      }),
      takeUntil(this._actions$.pipe(ofType(leaveChat, getChat, logout))))
    }),
  ));

  sendMessage$ = createEffect(() => this._actions$.pipe(
    ofType(sendMessageStart),
    exhaustMap(({ content }) => {
      const authState = this._authStateRef.state;

      assertNotNullAuthState(authState)

      const sourceUserId = authState.userData.userId;
      const targetUserId = this._chatStateRef.state.targetUserId;

      const body = {
        sourceUserId,
        targetUserId,
        content
      };

      return this._httpClient.post<void>(this._urlService.messageUrl, body).pipe(
        map(() => sendMessageSuccess()),
        tap(({ error: (error) => console.log(error) })),
        catchError(() => of(sendMessageFailed()))
      );
    })
  ));

  constructor(private readonly _actions$: Actions,
              private readonly _firestore: Firestore,
              private readonly _httpClient: HttpClient,
              private readonly _chatStateRef: ChatStateRef,
              private readonly _authStateRef: AuthStateRef,
              private readonly _urlService: UrlService) {
  }

}

@Injectable({ providedIn: 'root' })
export class ChatEvents {

  private _subscription: Subscription;

  status$: Observable<StateStatus>;

  pending$ = this._actions$.pipe(
    ofType(getChat, updateChatState, sendMessageStart, sendMessageSuccess, sendMessageFailed),
    map((action) => {
      if (isActionTypeOf(action, getChat, sendMessageStart)) {
        return true;
      }
      return false;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  messageSended$ = this._actions$.pipe(
    ofType(sendMessageSuccess),
    shareReplay(1)
  );

  sendingMessage$ = this._actions$.pipe(
    ofType(sendMessageStart, sendMessageSuccess, sendMessageFailed),
    map((action) => {
      if (isActionTypeOf(action, sendMessageSuccess)) {
        return AsyncActionStatus.resolved;
      }
      if (isActionTypeOf(action, sendMessageFailed)) {
        return AsyncActionStatus.rejected
      }
      return AsyncActionStatus.awaiting
    }),
    share()
  );

  getingMessages$ = this._actions$.pipe(
    filter((action) => isActionTypeOf(action, getChat) || isPrevActionTypeOf(action, getChat)),
    map((action) => {
      if (isActionTypeOf(action, getChat)) {
        return AsyncActionStatus.awaiting;
      }
      if (isActionTypeOf(action, updateChatState)) {
        return AsyncActionStatus.resolved;
      }
      return AsyncActionStatus.rejected;
    })
  )

  sendingFailed$ = this._actions$.pipe(
    ofType(sendMessageFailed),
    shareReplay(1)
  );

  constructor(private _actions$: Actions,
              chatStateRef: ChatStateRef) {

    const conectingSubject = new ReplaySubject<StateStatus>(1);
    this.status$ = new Observable((observer) => conectingSubject.subscribe(observer));

    this._subscription = merge(
      this._actions$.pipe(
        ofType(updateChatState),
        map(() => chatStateRef.state),
        startWith(chatStateRef.state),
        map((state) => state.messages.length > 0 ? StateStatus.complete : StateStatus.empty)
      ),
      this._actions$.pipe(
        ofType(getChat),
        map(() => StateStatus.pending)
      ),
      this._actions$.pipe(
        ofType(chatError),
        map(() => StateStatus.error)
      )
    ).pipe(distinctUntilChanged()).subscribe(conectingSubject);
  }
}
