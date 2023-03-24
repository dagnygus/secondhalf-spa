import { Injectable } from "@angular/core";
import { FormControl, NonNullableFormBuilder, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { AuthModel } from "../../../models/auth-model";
import { validationWithMessage, noNumbersAndSpecialCharactersValidator, dateFormatValidator, minAgeValidator, noSpecialCharactersValidator, setTrimSanitizer, setTrimTitleSanitizer } from "../../../utils/form-helper";

export type DetailsKeys = keyof Required<Omit<AuthModel, 'hasAddressInfo' | 'userId' | 'mainPhotoUrl' | 'gender'>>
export type DetailsControls = { [key in DetailsKeys]: FormControl<string> }

export interface DetailsControlsRef {
  controls: DetailsControls;
  dispose: () => void;
}

@Injectable()
export class UserDetailsService {
  constructor(private _formBuilder: NonNullableFormBuilder) {}

  getControls(authModel: AuthModel, lateSanitizationNotifier: Observable<unknown | void>): DetailsControlsRef {
    const controls: DetailsControls = {
      firstName: this._formBuilder.control(
        authModel.firstName,
        [
          validationWithMessage(Validators.required, 'First Name is required!'),
          validationWithMessage(Validators.minLength(3), 'First Name must contain minimum 3 characters!'),
          noNumbersAndSpecialCharactersValidator('First name must contain alphabetic charactrs!')
        ]
      ),
      lastName: this._formBuilder.control(
        authModel.lastName,
        [
          validationWithMessage(Validators.required, 'Last Name is required!'),
          validationWithMessage(Validators.minLength(3), 'Last Name must contain minimum 3 characters!'),
          noNumbersAndSpecialCharactersValidator('Last name must contain alphabetic charactrs!')
        ]
      ),
      nickName: this._formBuilder.control(
        authModel.nickName,
        [
          validationWithMessage(Validators.required, 'Your nick name is required!'),
          validationWithMessage(Validators.minLength(3), 'Your nick name is to short. Minimum count of characters is 3!'),
          noNumbersAndSpecialCharactersValidator('Your nick name must contain alphabetic charactrs!')
        ]
      ),
      email: this._formBuilder.control(
        authModel.email,
        [
          validationWithMessage(Validators.required, 'E-mail address is required!'),
          validationWithMessage(Validators.email, 'Incorect format of address e-mail!')
        ]
      ),
      dateOfBirth: this._formBuilder.control(
        authModel.dateOfBirth,
        [
          validationWithMessage(Validators.required, 'Your date of birth is required!'),
          dateFormatValidator('yyyy-MM-dd', 'Invalid format of data!'),
          minAgeValidator(18, 'yyyy-MM-dd', 'You must be at least 18 years old to hava an accout on this webside!')
        ]
      ),
      aboutMySelf: this._formBuilder.control(
        authModel.aboutMySelf ?? '',
      ),
      city: this._formBuilder.control(
        authModel.city ?? '',
        [
          validationWithMessage(Validators.required, 'City is required!'),
          noNumbersAndSpecialCharactersValidator('City must contain alphabetick characters!', true)
        ]
      ),
      street: this._formBuilder.control(
        authModel.street ?? '',
        [
          validationWithMessage(Validators.required, 'Street is required!'),
          noSpecialCharactersValidator('Street can contain only alphanumeric or numeric characters, incuding white spaces. No dots allowed!', true)
        ],
      ),
      state: this._formBuilder.control(
        authModel.state ?? '',
        [
          validationWithMessage(Validators.required, 'State is required!'),
          noNumbersAndSpecialCharactersValidator('State must contain alphabetick characters!', true)
        ]
      ),
      country: this._formBuilder.control(
        authModel.country ?? ''
      )
    };

    const subscription = new Subscription();

    subscription.add(setTrimTitleSanitizer(controls.firstName));
    subscription.add(setTrimTitleSanitizer(controls.lastName));
    subscription.add(setTrimTitleSanitizer(controls.nickName));
    subscription.add(setTrimSanitizer(controls.email));
    subscription.add(setTrimSanitizer(controls.city, lateSanitizationNotifier));
    subscription.add(setTrimSanitizer(controls.street, lateSanitizationNotifier));
    subscription.add(setTrimSanitizer(controls.state, lateSanitizationNotifier));
    subscription.add(setTrimSanitizer(controls.country, lateSanitizationNotifier));

    return { controls, dispose: () => subscription.unsubscribe() }
  }

  getBasicFiledNames(): readonly DetailsKeys[] {
    return [
      'firstName',
      'lastName',
      'nickName',
      'email',
      'dateOfBirth',
      'aboutMySelf'
    ];
  }

  getBasicLabels(): readonly string[] {
    return [
      'First name',
      'Last name',
      'Nick name',
      'Address e-mail',
      'Date of birth',
      'About my self',
    ]
  }

  getAddressInfoFiledNames(): readonly DetailsKeys[] {
    return [
      'city',
      'street',
      'state',
      'country'
    ]
  }

  getAddressInfoLabels(): readonly string[] {
    return [
      'City',
      'Street',
      'State',
      'Country'
    ]
  }

  update(controls: DetailsControls, model: AuthModel): void {
    if (controls.firstName.value !== model.firstName) {
      controls.firstName.setValue(model.firstName);
    }
    if (controls.lastName.value !== model.lastName) {
      controls.firstName.setValue(model.lastName);
    }
    if (controls.nickName.value !== model.nickName) {
      controls.nickName.setValue(model.nickName);
    }
    if (controls.email.value !== model.email) {
      controls.email.setValue(model.email);
    }
    if (controls.dateOfBirth.value !== model.dateOfBirth) {
      controls.dateOfBirth.setValue(model.dateOfBirth);
    }
    if (controls.aboutMySelf.value !== model.aboutMySelf) {
      controls.aboutMySelf.setValue(model.aboutMySelf ?? '');
    }
    if (controls.city.value !== model.city) {
      controls.city.setValue(model.city ?? '');
    }
    if (controls.street.value !== model.street) {
      controls.street.setValue(model.street ?? '');
    }
    if (controls.state.value !== model.state) {
      controls.state.setValue(model.state ?? '');
    }
    if (controls.country.value !== model.country) {
      controls.country.setValue(model.country ?? '');
    }
  }
}
