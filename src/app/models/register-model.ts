// import { alpha, compare, email, minLength, prop, required, rule } from '@rxweb/reactive-form-validators';
import * as moment from 'moment';
import { AuthModel } from './auth-model';

// export class RegisterModel {

  // @required({ message: 'First name is required!' })
  // @minLength({value: 3, message: 'First name is to short. Minimum count of characters is 3!' })
  // @alpha({ message: 'First name must contain alphabetic charactrs!' })
  // firstName = '';

  // @required({ message: 'Last name is required!' })
  // @minLength({value: 3, message: 'Last name is to short. Minimum count of characters is 3!' })
  // @alpha({ message: 'Last name must contain alphabetic charactrs!' })
  // lastName = '';

  // @required({ message: 'Your nick name is required!' })
  // @minLength({value: 3, message: 'Your nick name is to short. Minimum count of characters is 3!' })
  // @alpha({ message: 'Your nick name must contain alphabetic charactrs!' })
  // nickName = '';

  // @required({ message: 'E-mail address is required!' })
  // @email({ message: 'Incorect format of address e-mail!' })
  // email = '';

  // @required({ message: 'Your date of birth name is required!' })
  // @rule({ customRules: [minAgeValidator] })
  // dateOfBirth = '';

  // @prop()
  // @rule({ customRules: [genderValidator] })
  // gender: 'male' | 'female' = 'male';

  // @required({ message: 'Password is required!' })
  // @minLength({ value: 5, message: 'Your password is to short! It must contain minimum 5 characters' })
  // password = '';

  // @required({ message: 'Password confirmation is required!' })
  // @minLength({ value: 5, message: 'Your password confirmation is to short! It must contain minimum 5 characters' })
  // @compare({ fieldName: 'password', message: 'Password confimation does not match password!' })
  // confirmPassword = '';

  // @prop()
  // aboutMySelf = '';

  // constructor(authModel?: AuthModel) {
  //   if (authModel) {
  //     this.firstName = authModel.firstName;
  //     this.lastName = authModel.lastName;
  //     this.nickName = authModel.nickName;
  //     this.email = authModel.email;
  //     this.gender = this.gender;
  //     this.dateOfBirth = this.dateOfBirth;
  //     this.aboutMySelf = this.aboutMySelf;
  //   }
  // }
// }

// const minAgeValidationError = {
//   minAge: {
//     message: 'You must be at least 18 years old to hava an accout on this webside!'
//   }
// };

// const genderValidationError = {
//   gander: {
//     message: 'Invalid value of gender'
//   }
// };

// function minAgeValidator(registerModel: RegisterModel): { [key: string]: any } | null {

//   if (!registerModel.dateOfBirth) { return null; }

//   if (moment(registerModel.dateOfBirth, 'YYYY-MM-DD').isBefore(moment(new Date()).subtract(18, 'years'))) {
//     return null;
//   }

//   return minAgeValidationError;
// }

// function genderValidator(registerModel: RegisterModel): any {
//   if (registerModel.gender === 'male' || registerModel.gender === 'female') {
//     return null;
//   }
//   return genderValidationError;
// }

export interface RegisterModel {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  password: string;
  confirmPassword: string;
  aboutMySelf: string;
}
