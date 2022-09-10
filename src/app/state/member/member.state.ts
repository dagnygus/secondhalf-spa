import { StateStatus } from './../../app.ngrx.utils';
import { MemberModel } from 'src/app/models/member-model';

export interface MemberState {
  readonly member: MemberModel | null;
}

export const initialState: MemberState = {
  member: null
};
