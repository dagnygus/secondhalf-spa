import { MembersState } from './members.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MemberModel } from 'src/app/models/member-model';
import { AppState } from 'src/app/app.ngrx.utils';
import { emptyArr } from 'src/app/utils/constans';

export const selectMemebersState = createFeatureSelector<MembersState>('members');
export const selectMembers = (state: AppState) => state.members.members;
export const feater = createFeatureSelector<MembersState>('members');

export const selectMembersAsArr = createSelector(
  selectMembers,
  (members) => {
    if (members.ids.length === 0) {
      return emptyArr as readonly Readonly<MemberModel>[];
    }
    return members.ids.map((id) => members.entities[id]) as readonly Readonly<MemberModel>[];
  }
);
