import { share } from 'rxjs/operators';
import { AuthStateEvents } from './../../../../state/auth/auth.effects';
import { AsyncValidationService } from './../../../../services/validation.service';
import { validationWithMessage, setTrimSanitizer, markAllAsTouchedAndDirty, FormSubmitter } from './../../../../utils/form-helper';
import { NonNullableFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PageComponent } from './../../../shared/directives/page.component';
import { fadeInAnimation, fadeOutAnimation } from '../../../../utils/ng-animations';
import { GlobalLoadingSpinnerService } from '../../../../services/global-loading-spinner.service';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { signIn } from '../../../../state/auth/auth.actions';
import { SignInModel } from '../../../../models/sign-in-model';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store } from '@ngrx/store';
import { filter, map, merge, Observable, Subscription, tap } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';
import { transition, group, query, trigger, stagger, animateChild } from '@angular/animations';
// eslint-disable-next-line max-len
import { bounceInAnimation, bounceOutAnimation, fadeInLeftAnimation, fadeInRightAnimation, fadeOutLeftAnimation, fadeOutRightAnimation } from 'src/app/utils/ng-animations';
import { SignInService } from 'src/app/services/sign-in.service';
import { AsyncActionStatus } from 'src/app/state/utils';

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
      query('mat-form-field:nth-of-type(odd)', fadeOutLeftAnimation('300ms', '0ms'), { optional: true }),
      query('mat-form-field:nth-of-type(even)', fadeOutRightAnimation('300ms', '0ms'), { optional: true }),
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
export class SignInFormComponent extends PageComponent implements OnDestroy {

  private _pickError = false;
  private _subscription = new Subscription();
  currentWrittenEmail = '';
  passwordHidden = true;
  readonly formGroup: FormGroup<{[key in keyof SignInModel]: FormControl<SignInModel[key]>}>;
  readonly formSubmitter: FormSubmitter;
  readonly submitDisabled$: Observable<boolean>;
  readonly error$: Observable<FirebaseError | null>;


  constructor(signInService: SignInService,
              asyncValidationService: AsyncValidationService,
              authStateEvents: AuthStateEvents,
              spinnerService: GlobalLoadingSpinnerService,
              private readonly _store: Store<AppState>) {
    super();

    const { formGroup, dispose } = signInService.getFormGroup();
    this.formGroup = formGroup;
    this.formGroup.controls.email.addAsyncValidators(asyncValidationService.hasEmail());
    this._subscription.add(dispose);

    this.formSubmitter = new FormSubmitter(this.formGroup);

    this._subscription.add(() => this.formSubmitter.dispose());

    this.submitDisabled$ = merge(
      this.formSubmitter.submitDisabled$,
      authStateEvents.signingIn$.pipe(
        map((status) => status === AsyncActionStatus.awaiting),
        tap((value) => {
          if (value) {
            spinnerService.attach();
          } else {
            spinnerService.detach();
          }
        })
      )
    );

    this.error$ = authStateEvents.signingIn$.pipe(
      map((status) => status === AsyncActionStatus.rejected ? authStateEvents.getError() as any : null),
      filter((error) => this._pickError && error && error instanceof FirebaseError),
      tap(() => {
        this.currentWrittenEmail = this.formGroup.controls.email.value;
        this._pickError = false;
      }),
      share()
    );
  }

  onSubmit(): void {
    this._pickError = true;
    this.formSubmitter.trySubmit(() => {
      this._store.dispatch(signIn({
        signInModel: this.formGroup.getRawValue(),
        info: 'Sign in from app-sign-in-form component.'
      }))
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
