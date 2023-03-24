import { Injectable } from "@angular/core";
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { RegisterModel } from "../../../models/register-model";
import { SignUpModule } from "../sign-up.module";
import { validationWithMessage, noNumbersAndSpecialCharactersValidator, dateFormatValidator, minAgeValidator, compareValidator, setTrimTitleSanitizer, setTrimSanitizer } from "../../../utils/form-helper";

type SignUpFormGroup = FormGroup<{ [key in keyof RegisterModel]: FormControl<RegisterModel[key]> }>;

export interface SignUpFormGroupRef {
  formGroup: SignUpFormGroup;
  dispose: () => void;
}

@Injectable()
export class SignUpService {
  constructor(private _formBuilder: NonNullableFormBuilder) {}

  getFormGroup(): SignUpFormGroupRef {
    const formGroup: SignUpFormGroup = this._formBuilder.group({
      firstName: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'First Name is required!'),
          validationWithMessage(Validators.minLength(3), 'First Name must contain minimum 3 characters!'),
          noNumbersAndSpecialCharactersValidator('First name must contain alphabetic charactrs!')
        ]
      ),
      lastName: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'Last Name is required!'),
          validationWithMessage(Validators.minLength(3), 'Last Name must contain minimum 3 characters!'),
          noNumbersAndSpecialCharactersValidator('Last name must contain alphabetic charactrs!')
        ]
      ),
      nickName: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'Your nick name is required!'),
          validationWithMessage(Validators.minLength(3), 'Your nick name is to short. Minimum count of characters is 3!'),
          noNumbersAndSpecialCharactersValidator('Your nick name must contain alphabetic charactrs!')
        ],
      ),
      email: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'E-mail address is required!'),
          validationWithMessage(Validators.email, 'Incorect format of address e-mail!')
        ],
      ),
      dateOfBirth: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'Your date of birth is required!'),
          dateFormatValidator('yyyy-MM-dd', 'Invalid format of data!'),
          minAgeValidator(18, 'yyyy-MM-dd', 'You must be at least 18 years old to hava an accout on this webside!')
        ]
      ),
      gender: this._formBuilder.control<'male' | 'female'>(
        'male',
        validationWithMessage(Validators.pattern('^(male|female)$'), 'Provided gender is incorect!')

      ),
      password: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'Password is required!'),
          validationWithMessage(Validators.minLength(5), 'Your password is to short! It must contain minimum 5 characters')
        ]
      ),
      confirmPassword: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'Password confirmation is required!'),
          validationWithMessage(Validators.minLength(5), 'Your password confirmation is to short! It must contain minimum 5 characters'),
          compareValidator('password', 'Password confimation does not match password!')
        ]
      ),
      aboutMySelf: this._formBuilder.control(''),
    });

    const subscription = new Subscription();

    subscription.add(setTrimTitleSanitizer(formGroup.controls.firstName));
    subscription.add(setTrimTitleSanitizer(formGroup.controls.lastName));
    subscription.add(setTrimTitleSanitizer(formGroup.controls.nickName));
    subscription.add(setTrimSanitizer(formGroup.controls.email));
    subscription.add(setTrimSanitizer(formGroup.controls.gender));
    subscription.add(setTrimSanitizer(formGroup.controls.password));
    subscription.add(setTrimSanitizer(formGroup.controls.confirmPassword));

    return { formGroup, dispose: () => subscription.unsubscribe() }
  }
}
