import { fadeInAnimation, fadeOutAnimation } from './../../utils/ng-animations';
import { GlobalLoadingSpinnerService } from './../../services/global-loading-spinner.service';
import { OnDestroy } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { signinFailed, signinSuccess } from './../../state/auth/auth.actions';
import { AsyncValidationService } from './../../services/validation.service';
import { SignInModel, SignInModelImpl } from './../../models/sign-in-model';
import { FormComponent } from '../../my-package/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store } from '@ngrx/store';
import { signinStart } from 'src/app/state/auth/auth.actions';
import { Observable, Subscription, merge } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { FirebaseError } from '@angular/fire/app';
import { FormPageComponent } from 'src/app/directives/page.component';
import { transition, group, query, trigger, stagger, animateChild } from '@angular/animations';
// eslint-disable-next-line max-len
import { bounceInAnimation, bounceOutAnimation, fadeInLeftAnimation, fadeInRightAnimation, fadeOutLeftAnimation, fadeOutRightAnimation } from 'src/app/utils/ng-animations';

const formAnimationMetadata = trigger('form', [
  transition(':enter', [
    group([
      query('mat-form-field:nth-of-type(odd)', [
        fadeInLeftAnimation.startState,
        stagger(150, [
          fadeInLeftAnimation('300ms', '300ms')
        ])
      ], { optional: true }),
      query('mat-form-field:nth-of-type(even)', [
        fadeInRightAnimation.startState,
        stagger(150, [
          fadeInRightAnimation('300ms', '450ms')
        ])
      ], { optional: true }),
      query('@*', animateChild())
    ])
  ]),
  transition(':leave', [
    group([
      query('mat-form-field:nth-of-type(odd)', [
        fadeOutLeftAnimation('300ms', '0ms')
      ], { optional: true }),
      query('mat-form-field:nth-of-type(even)', [
          fadeOutRightAnimation('300ms', '0ms')
      ], { optional: true }),
      query('@*', animateChild())
    ])
  ]),
]);

const btnGroupAnimationMetadata = trigger('btnGroup', [
  transition(':enter', [
    bounceInAnimation.startState,
    bounceInAnimation('600ms', '400ms')
  ]),
  transition(':leave', [
    bounceOutAnimation('600ms', '400ms')
  ]),
]);

const formHeaderAnimationMetadata = trigger('formHeader', [
  transition(':enter', [
    fadeInAnimation.startState,
    fadeInAnimation('400ms', '800ms')
  ]),
  transition(':leave', [
    fadeOutAnimation('400ms', '0ms')
  ])
]);

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    formAnimationMetadata,
    btnGroupAnimationMetadata,
    formHeaderAnimationMetadata
  ]
})
export class SignInFormComponent extends FormPageComponent<SignInModel> implements OnInit, OnDestroy {

  protected model = new SignInModelImpl();

  signInError = false;
  currentWrittenEmail = '';

  private subscription: Subscription;
  readonly signInHttpErrorResponse$: Observable<FirebaseError>;

  constructor(private formBuilder: RxFormBuilder,
              private store: Store<AppState>,
              private actions$: Actions,
              private spinnerService: GlobalLoadingSpinnerService) {
    super();
    this.signInHttpErrorResponse$ = this.actions$.pipe(
      ofType(signinFailed),
      map(({ error }) => {
        this.signInError = true;
        this.currentWrittenEmail = this.form!.controls.email.value;
        return error;
      })
    );


    this.subscription = merge<boolean, boolean, boolean>(
      this.actions$.pipe(ofType(signinStart), map(() => true)),
      this.actions$.pipe(ofType(signinSuccess), map(() => false)),
      this.actions$.pipe(ofType(signinFailed), map(() => false)),
    ).subscribe((value) => {
      if (value) {
        this.spinnerService.attach();
      } else {
        this.spinnerService.detach();
      }
    });
  }

  ngOnInit(): void {
    this.setForm(this.formBuilder.formGroup(this.model));
    this.setTrimSanitizor('email');
    this.setTrimSanitizor('password');
    // this.setAsyncValidator('email', this.asyncValidationService.hasEmail(changeDetectionCallback));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit(): void {
    if (this.form!.invalid) {
      this.markAllAsTouchedAndDirty();
      return;
    }

    // this.authService.login(this.model.toReadonlyPlainObj());
    this.store.dispatch(signinStart({ signInModel: this.model.toReadonlyPlainObj() }));
  }

}
