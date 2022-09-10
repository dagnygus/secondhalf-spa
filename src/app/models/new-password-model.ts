import { compare, minLength, required } from '@rxweb/reactive-form-validators';
import { environment } from 'src/environments/environment';

export interface NewPasswordModel {
  readonly oldPassword: string;
  readonly newPassword: string;
  readonly confirmNewPassword: string;
}

export class NewPasswordModelImpl implements NewPasswordModel {

  @required({ message: 'Old password is required!!' })
  oldPassword = '';

  @required({ message: 'New password is required!!' })
  @minLength({ value: 5, message: 'Password must contain minimum 5 characters!!' })
  newPassword = '';

  @required({ message: 'New password confirmation is required!!' })
  @compare({ fieldName: 'newPassword', message: 'Password confirmation not match password!!' })
  confirmNewPassword = '';

  toReadonlyPlainJSObj(): Immutable<NewPasswordModel> {
    return Object.freeze(Object.assign({}, this));
  }

  asReadonly(): NewPasswordModel {
    if (environment.production) {
      return this;
    }

    return Object.freeze(Object.assign({}, this));
  }
}
