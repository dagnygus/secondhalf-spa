import { alpha, alphaNumeric, required } from '@rxweb/reactive-form-validators';
import { environment } from 'src/environments/environment';

export interface AddressInfoModel {
  readonly city: string;
  readonly state: string;
  readonly street: string;
  readonly country: string;
}

export class AddressInfoModelImpl implements AddressInfoModel {

  @required({ message: 'City is required!' })
  @alpha({ message: 'City must contain alphabetick characters!', allowWhiteSpace: true, })
  city = '';

  @required({ message: 'Street is required!' })
  @alphaNumeric({ allowWhiteSpace: true,  message: 'Street can contain only alphanumeric or numeric characters, incuding white spaces. No dots allowed!!' })
  street = '';

  @required({ message: 'State is required!' })
  @alpha({ allowWhiteSpace: true, message: 'Street must contain alphabetick characters!' })
  state = '';

  @required({ message: 'Country is required!' })
  @alpha({ allowWhiteSpace: true, message: 'Country must contain alphabetick characters!' })
  country = '';

  toReadonlyPlainJSObj(): Immutable<AddressInfoModel> {
    return Object.freeze(Object.assign({}, this));
  }

  asReadonly(): AddressInfoModel {
    if (environment.production) {
      return this;
    }

    return Object.freeze({...this});
  }

}
