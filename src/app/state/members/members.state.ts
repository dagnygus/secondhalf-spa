import { AppState } from 'src/app/app.ngrx.utils';
import { Store } from '@ngrx/store';
import { OnDestroy, Injectable } from '@angular/core';

import { MemberModel } from './../../models/member-model';
import { EntityState, createEntityAdapter, Update, EntityMap, EntityMapOne, Predicate, IdSelector, Comparer } from '@ngrx/entity';
import { emptyArr, emptyObj } from 'src/app/utils/constans';
import { BaseStateRef } from '../utils';

export interface MembersState {
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly gender?: string | null | undefined;
  readonly members: MembersEntityState;
}

export interface ReadonlyEntityState<T> {
  ids: readonly string[] | readonly number[],
  entities: { [id: string]: T | undefined, [id: number]: T | undefined }
}

export interface MembersEntityState extends ReadonlyEntityState<MemberModel> { }

export interface MemebersAdapter {
  selectId: IdSelector<MemberModel>;
  sortComparer: false | Comparer<MemberModel>;
  getInitialState(): MembersEntityState;
  getInitialState<S extends object>(state: S): MembersEntityState & S;
  addOne<S extends MembersEntityState>(entity: MemberModel, state: S): S;
  addMany<S extends MembersEntityState>(entities: MemberModel[], state: S): S;
  setAll<S extends MembersEntityState>(entities: MemberModel[], state: S): S;
  setOne<S extends MembersEntityState>(entity: MemberModel, state: S): S;
  setMany<S extends MembersEntityState>(entities: MemberModel[], state: S): S;
  removeOne<S extends MembersEntityState>(key: string, state: S): S;
  removeOne<S extends MembersEntityState>(key: number, state: S): S;
  removeMany<S extends MembersEntityState>(keys: string[], state: S): S;
  removeMany<S extends MembersEntityState>(keys: number[], state: S): S;
  removeMany<S extends MembersEntityState>(predicate: Predicate<MemberModel>, state: S): S;
  removeAll<S extends MembersEntityState>(state: S): S;
  updateOne<S extends MembersEntityState>(update: Update<MemberModel>, state: S): S;
  updateMany<S extends MembersEntityState>(updates: Update<MemberModel>[], state: S): S;
  upsertOne<S extends MembersEntityState>(entity: MemberModel, state: S): S;
  upsertMany<S extends MembersEntityState>(entities: MemberModel[], state: S): S;
  mapOne<S extends MembersEntityState>(map: EntityMapOne<MemberModel>, state: S): S;
  map<S extends MembersEntityState>(map: EntityMap<MemberModel>, state: S): S;
}

export const initialMembersEntityState: EntityState<MemberModel> = {
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
) as MemebersAdapter;

@Injectable({ providedIn: 'root' })
export class MembersStateRef extends BaseStateRef<MembersState> implements OnDestroy {

  constructor(store: Store<AppState>) {
    super(store.select(({ members }) => members))
  }

}
