import { GlobalLoadingSpinnerService } from '../../../../../services/global-loading-spinner.service';
import { signinSuccess } from '../../../../../state/auth/auth.actions';
import { Subscription, merge } from 'rxjs';
/* eslint-disable @typescript-eslint/member-ordering */
import { fadeInLeftAnimation, fadeInRightAnimation, fadeInUpAnimation, zoomInAnimation } from '../../../../../utils/ng-animations';
import { SignInModel, SignInModelImpl } from 'src/app/models/sign-in-model';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormComponent } from 'src/app/my-package';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { Observable } from 'rxjs';
import { signinFailed, signinStart } from 'src/app/state/auth/auth.actions';
import { FirebaseError } from '@angular/fire/app';
import { map, filter } from 'rxjs/operators';
import { transition, trigger } from '@angular/animations';

const firstInputAnimationMetadata = trigger('firstInput', [
  transition(':enter', fadeInRightAnimation('400ms', '1s'))
]);

const secondInputAnimationMetadata = trigger('secondInput', [
  transition(':enter', fadeInLeftAnimation('400ms', '1s'))
]);

const buttonsWrapperAnimationMetadata = trigger('btnsWrapper', [
  transition(':enter', fadeInUpAnimation('400ms', '1s'))
]);

const errorBoxAnimationMetadata = trigger('errorBox', [
  transition(':enter', zoomInAnimation('400ms', '0ms'))
]);

@Component({
  selector: 'app-header-sign-in-form',
  templateUrl: './header-sign-in-form.component.html',
  styleUrls: ['./header-sign-in-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    firstInputAnimationMetadata,
    secondInputAnimationMetadata,
    buttonsWrapperAnimationMetadata,
    errorBoxAnimationMetadata
  ]
})
export class HeaderSignInFormComponent extends FormComponent<SignInModel> implements OnInit, OnDestroy {

  model = new SignInModelImpl();

  readonly signInHttpErrorResponse$: Observable<FirebaseError>;

  signInError = false;
  currentWrittenEmail = '';
  passwordHidden = true;

  private _subscription: Subscription;
  private _takeErrorResponse = false;

  constructor(private readonly _formBuilder: RxFormBuilder,
              private readonly _actions$: Actions,
              private readonly _store: Store<AppState>,
              private readonly _spinnerService: GlobalLoadingSpinnerService) {
    super();
    this.signInHttpErrorResponse$ = this._actions$.pipe(
      ofType(signinFailed),
      filter(() => this._takeErrorResponse),
      map(({ error }) => {
        this._takeErrorResponse = false;
        this.signInError = true;
        this.currentWrittenEmail = this.form!.controls.email.value;
        return error;
      })
    );

    this._subscription = merge<boolean, boolean, boolean>(
      this._actions$.pipe(ofType(signinStart), map(() => true)),
      this._actions$.pipe(ofType(signinSuccess), map(() => false)),
      this._actions$.pipe(ofType(signinFailed), map(() => false)),
    ).subscribe((value) => {
      if (value) {
        this._spinnerService.attach();
      } else {
        this._spinnerService.detach();
      }
    });
  }

  ngOnInit(): void {

    this.setForm(this._formBuilder.formGroup(this.model));
    this.setTrimSanitizor('email');
    this.setTrimSanitizor('password');

  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onSubmitHandler(): void {
    this._takeErrorResponse = true;

    if (this.form!.invalid) {
      this.markAllAsTouchedAndDirty();
      return;
    }
    this._store.dispatch(signinStart({ signInModel: this.model.toReadonlyPlainObj() }));
  }

}
