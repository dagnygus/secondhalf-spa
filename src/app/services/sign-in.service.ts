import { Subscription } from 'rxjs';
import { SignInModel } from './../models/sign-in-model';
import { NonNullableFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SignInModule } from './../modules/sign-in/sign-in.module';
import { Injectable } from '@angular/core';
import { setTrimSanitizer, validationWithMessage } from '../utils/form-helper';

type SignInFormGroup = FormGroup<{ [key in keyof SignInModel]: FormControl<SignInModel[key]> }>

export interface SignInFormGroupRef {
  formGroup: SignInFormGroup;
  dispose: () => void;
}

@Injectable({ providedIn: 'root' })
export class SignInService {
  constructor(private _formBuilder: NonNullableFormBuilder) {}

  getFormGroup(): SignInFormGroupRef {
    const subscription = new Subscription()
    const formGroup = this._formBuilder.group({
      email: this._formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'E-mail address is required!'),
          validationWithMessage(Validators.email, 'Incorect format of e-mail address!')
        ],
      ),
      password: this._formBuilder.control(
        '',
        validationWithMessage(Validators.required, 'Your password is required!')
      )
    });

    subscription.add(setTrimSanitizer(formGroup.controls.email));
    subscription.add(setTrimSanitizer(formGroup.controls.password));

    return { formGroup, dispose: () => subscription.unsubscribe() };
  }
}

