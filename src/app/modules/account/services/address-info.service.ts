import { setTrimSanitizer } from 'src/app/utils/form-helper';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AddressInfoModel } from '../../../models/address-info-model';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { validationWithMessage, noNumbersAndSpecialCharactersValidator, noSpecialCharactersValidator } from '../../../utils/form-helper';

type AddressInfoFormGroup = FormGroup<{ [key in keyof AddressInfoModel]: FormControl<AddressInfoModel[key]> }>

export interface AddressInfoFormGroupRef {
  formGroup: AddressInfoFormGroup;
  dispose: () => void;
}

@Injectable()
export class AddressInfoService {

  constructor(private _formBuilder: NonNullableFormBuilder) {}

  getFormGroup(sanitizationTrigger: Observable<unknown | void>): AddressInfoFormGroupRef {
    const formGroup: AddressInfoFormGroup = this._formBuilder.group({
      city: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'City is required!'),
          noNumbersAndSpecialCharactersValidator('City must contain alphabetick characters!', true)
        ]
      ),
      street: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'Street is required!'),
          noSpecialCharactersValidator('Street can contain only alphanumeric or numeric characters, incuding white spaces. No dots allowed!', true)
        ]
      ),
      state: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'State is required!'),
          noNumbersAndSpecialCharactersValidator('State must contain alphabetick characters!', true)
        ]
      ),
      country: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'Conutry is required!'),
          noNumbersAndSpecialCharactersValidator('Country must contain alphabetick characters!', true)
        ]
      )
    });

    const subscription = new Subscription();

    subscription.add(setTrimSanitizer(formGroup.controls.city, sanitizationTrigger));
    subscription.add(setTrimSanitizer(formGroup.controls.street, sanitizationTrigger));
    subscription.add(setTrimSanitizer(formGroup.controls.state, sanitizationTrigger));
    subscription.add(setTrimSanitizer(formGroup.controls.country, sanitizationTrigger));

    return { formGroup, dispose: () => subscription.unsubscribe() }
  }
}
