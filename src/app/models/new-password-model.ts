// export interface INewPasswordModel {
//   readonly oldPassword: string;
//   readonly newPassword: string;
//   readonly confirmNewPassword: string;
// }

// export class NewPasswordModel implements INewPasswordModel {

//   @required({ message: 'Old password is required!!' })
//   oldPassword = '';

//   @required({ message: 'New password is required!!' })
//   @minLength({ value: 5, message: 'Password must contain minimum 5 characters!!' })
//   newPassword = '';

//   @required({ message: 'New password confirmation is required!!' })
//   @compare({ fieldName: 'newPassword', message: 'Password confirmation not match password!!' })
//   confirmNewPassword = '';
// }

export interface NewPasswordModel {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
