/* eslint-disable max-len */

// export class AddressInfoModel  {

//   @required({ message: 'City is required!' })
//   @alpha({ message: 'City must contain alphabetick characters!', allowWhiteSpace: true, })
//   city = '';

//   @required({ message: 'Street is required!' })
//   @alphaNumeric({ allowWhiteSpace: true,  message: 'Street can contain only alphanumeric or numeric characters, incuding white spaces. No dots allowed!!' })
//   street = '';

//   @required({ message: 'State is required!' })
//   @alpha({ allowWhiteSpace: true, message: 'Street must contain alphabetick characters!' })
//   state = '';

//   @required({ message: 'Country is required!' })
//   @alpha({ allowWhiteSpace: true, message: 'Country must contain alphabetick characters!' })
//   country = '';

// }

export interface AddressInfoModel {
  city: string;
  street: string;
  state: string;
  country: string;
}
