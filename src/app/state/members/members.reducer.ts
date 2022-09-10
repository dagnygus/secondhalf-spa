import { EntityState } from '@ngrx/entity';
import { initialState, MembersState, membersAdapter } from './members.state';
import { Action, createReducer, on } from '@ngrx/store';
import { clearMembersState,
  getMembersSuccess,
  likeMemberFromMembersPageSuccess,
  updateMembers,
  likeMemberInMembersStateFromMemberPage,
  getMembersStart,
  getMembersFailed,
  resetCurrentMembersState} from './members.actions';
import { MemberModel } from 'src/app/models/member-model';

const _membersReducer = createReducer(
  initialState,
  on(getMembersSuccess,
    likeMemberFromMembersPageSuccess,
    updateMembers,
    likeMemberInMembersStateFromMemberPage, (_, { newState }) => newState),
  on(clearMembersState, () => initialState),
  on(resetCurrentMembersState, (state) => {
    const newMembers =  membersAdapter.map((entity) => {
      const newEntity = { ...entity, liked: false };
      return newEntity;
    }, state.members as any) as Immutable<EntityState<MemberModel>>;

    return {
      ...state,
      members: newMembers
    };
  })
);

export const membersReducer = (state: MembersState | undefined, action: Action) => _membersReducer(state, action);
