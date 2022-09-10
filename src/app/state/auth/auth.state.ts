import { AuthModel } from '../../models/auth-model';


// eslint-disable-next-line @typescript-eslint/naming-convention
export  interface AuthState {
  readonly token: string | null;
  readonly role: string | null;
  readonly userData: AuthModel | null;
}

export const initialState: AuthState = {
  token: null,
  role: null,
  userData: null,
};
