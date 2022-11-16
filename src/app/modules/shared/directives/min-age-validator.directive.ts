import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[appMinAgeValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinAgeValidatorDirective, multi: true }]
})
export class MinAgeValidatorDirective implements Validator {

  constructor() { }
  validate(control: AbstractControl): ValidationErrors | null {

    if (moment(control.value, 'DD/MM/YYYY').isBefore(moment(new Date()).subtract(18, 'years'))) {
      return null;
    }

    return minAgeValidationError;
  }

}

const minAgeValidationError = {
  minAge: {
    message: 'You must be at least 18 years old to hava an accout on this webside!'
  }
};
