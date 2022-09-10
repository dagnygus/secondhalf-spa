import { StateStatus } from './../../app.ngrx.utils';
import { emptyArr, emptyObj } from './../../utils/array-immutable-actions';
import { MemberModel } from './../../models/member-model';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface MembersState {
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly gender?: string | null | undefined;
  readonly members: Immutable<EntityState<MemberModel>>;
}

export const initialMembersEntityState: Immutable<EntityState<MemberModel>> = {
  ids: emptyArr,
  entities: emptyObj
};

export const initialState: MembersState =  {
  page: 1,
  limit: 0,
  totalPages: -1,
  gender: null,
  members: initialMembersEntityState
};

export const membersAdapter = createEntityAdapter<MemberModel>(
  {
    selectId: (memberModel) => memberModel.userId,
  },
);
