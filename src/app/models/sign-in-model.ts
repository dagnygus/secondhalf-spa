// import { email, required, minLength } from '@rxweb/reactive-form-validators';

// export class SignInModel  {

//   @required({ message: 'Address e-mail is required!' })
//   @email({ message: 'This address e-mail has incorect format!' })
//   email = '';

//   @required({ message: 'Your password is required!' })
//   @minLength({ value: 5, message: 'Password must contain minimum 5 characters!' })
//   password = '';

// }

export interface SignInModel  {
  email: string;
  password: string;
}
