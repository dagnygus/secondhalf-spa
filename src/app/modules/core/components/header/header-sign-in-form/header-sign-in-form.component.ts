import { FormSubmitter } from './../../../../../utils/form-helper';
import { AuthStateEvents } from './../../../../../state/auth/auth.effects';
import { SignInService } from 'src/app/services/sign-in.service';
import { AsyncValidationService } from './../../../../../services/validation.service';
import { NonNullableFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PageComponent } from './../../../../shared/directives/page.component';
import { GlobalLoadingSpinnerService } from '../../../../../services/global-loading-spinner.service';
import { Subscription, merge } from 'rxjs';
/* eslint-disable @typescript-eslint/member-ordering */
import { fadeInLeftAnimation, fadeInRightAnimation, fadeInUpAnimation, zoomInAnimation } from '../../../../../utils/ng-animations';
import { SignInModel } from 'src/app/models/sign-in-model';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { Observable } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';
import { map, filter, tap, share } from 'rxjs/operators';
import { transition, trigger } from '@angular/animations';
import { markAllAsTouchedAndDirty, setTrimSanitizer, validationWithMessage } from 'src/app/utils/form-helper';
import { signIn } from 'src/app/state/auth/auth.actions';
import { AsyncActionStatus } from 'src/app/state/utils';

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
  host: {
    'class': 'block',
  },
  animations: [
    firstInputAnimationMetadata,
    secondInputAnimationMetadata,
    buttonsWrapperAnimationMetadata,
    errorBoxAnimationMetadata
  ]
})
export class HeaderSignInFormComponent extends PageComponent implements OnDestroy {

  currentWrittenEmail = '';
  passwordHidden = true;
  readonly formGroup: FormGroup<{ [key in keyof SignInModel]: FormControl<SignInModel[key]> }>;
  readonly formSubmitter: FormSubmitter;
  readonly submitDisabled$: Observable<boolean>;
  readonly error$: Observable<FirebaseError | null>;

  private readonly _subscription = new Subscription();

  private _pickError = false;

  constructor(asyncValidationService: AsyncValidationService,
              changeDetectorRef: ChangeDetectorRef,
              signInService: SignInService,
              authEvents: AuthStateEvents,
              spinnerService: GlobalLoadingSpinnerService,
              private readonly _store: Store<AppState>) {
    super();
    const { formGroup, dispose } = signInService.getFormGroup();
    this.formGroup = formGroup;
    this._subscription.add(dispose);
    this.formGroup.controls.email.addAsyncValidators(asyncValidationService.hasEmail(() => changeDetectorRef.markForCheck()));
    this.formGroup.statusChanges.subscribe(() => changeDetectorRef.markForCheck());
    this.formSubmitter = new FormSubmitter(formGroup);

    this.submitDisabled$ = merge(
      this.formSubmitter.submitDisabled$,
      authEvents.signingIn$.pipe(
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

    this.error$ = authEvents.signingIn$.pipe(
      map((status) => status === AsyncActionStatus.rejected ? authEvents.getError() as any : null),
      filter((error) => this._pickError && error && error instanceof FirebaseError),
      tap(() => {
        this.currentWrittenEmail = this.formGroup.controls.email.value;
        this._pickError = false;
      }),
      share()
    )

    this._subscription.add(() => this.formSubmitter.dispose());
  }

  onSubmit(): void {
    this._pickError = true;
    this.formSubmitter.trySubmit(() => {
      this._store.dispatch(signIn({
        signInModel: this.formGroup.getRawValue(),
        info: 'Sign in from app-sign-in-form component.'
      }));
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
