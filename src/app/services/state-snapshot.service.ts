/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { State } from '@ngrx/store';
import { AuthState } from '../state/auth/auth.state';
import { ChatState } from '../state/chat/chat.state';
import { ImageState } from '../state/image/image.state';
import { MemberState } from '../state/member/member.state';
import { MembersState } from '../state/members/members.state';
import { NotificationState } from '../state/notification/notification.state';
import { AppState } from './../app.ngrx.utils';

@Injectable({
  providedIn: 'root',
})
export class StateSnapshotService {


  getAuthState(): AuthState { return (this.state.getValue() as AppState).auth; }
  getMembersState(): MembersState | undefined { return (this.state.getValue() as AppState).members; }
  getMemberState(): MemberState | undefined { return (this.state.getValue() as AppState).member; }
  getChatState(): ChatState { return (this.state.getValue() as AppState).chat; }
  getNotificationState(): NotificationState { return (this.state.getValue() as AppState).notification; }
  getImageState(): ImageState { return (this.state.getValue() as AppState).image; }

  constructor(private state: State<AppState>) {}
}

export class AppStateRef {

  state!: AppState;

  constructor(state$: State<AppState>) {
    state$.subscribe((value) => this.state = value)
  }
}
