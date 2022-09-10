import { email, required, minLength } from '@rxweb/reactive-form-validators';

export interface SignInModel {
  readonly email: string;
  readonly password: string;
}

export class SignInModelImpl implements SignInModel {

  @required({ message: 'Address e-mail is required!' })
  @email({ message: 'This address e-mail has incorect format!' })
  email = '';

  @required({ message: 'Your password is required!' })
  @minLength({ value: 5, message: 'Password must contain minimum 5 characters!' })
  password = '';

  toReadonlyPlainObj(): Immutable<SignInModel> {
    return Object.freeze(Object.assign({}, this));
  }

}
