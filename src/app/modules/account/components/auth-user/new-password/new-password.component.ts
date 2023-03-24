import { AuthStateEvents } from '../../../../../state/auth/auth.effects';
import { validationWithMessage, compareValidator, distinctValidator, setTrimSanitizer, markAllAsTouchedAndDirty } from '../../../../../utils/form-helper';
import { FormGroup, FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { PageComponent } from '../../../../shared/directives/page.component';
// eslint-disable-next-line max-len
import { bounceInUpAnimation, fadeInLeftAnimation, fadeInRightAnimation, fadeOutLeftAnimation, fadeOutRightAnimation, zoomOutAnimation } from '../../../../../utils/ng-animations';
import { group, query, animateChild, trigger, stagger, transition } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
/* eslint-disable @typescript-eslint/member-ordering */
import { changePasswordSuccess, changePasswordFailed } from '../../../../../state/auth/auth.actions';
import { NewPasswordModel } from '../../../../../models/new-password-model';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store } from '@ngrx/store';
import { changePasswordStart } from 'src/app/state/auth/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { merge, Subject } from 'rxjs';
import { GlobalLoadingSpinnerService } from 'src/app/services/global-loading-spinner.service';
import { AsyncActionStatus } from 'src/app/state/utils';
const formAnimationMetadata = trigger('form', [
  transition(':enter', [
    group([
      query('@*', animateChild()),
      query('mat-form-field:nth-of-type(odd)', [
        fadeInRightAnimation.startState,
        stagger(200, [
          fadeInRightAnimation('500ms', '200ms')
        ])
      ], { optional: true }),
      query('mat-form-field:nth-of-type(even)', [
        fadeInLeftAnimation.startState,
        stagger(200, [
          fadeInLeftAnimation('500ms', '400ms')
        ])
      ], { optional: true })
    ])
  ]),
  transition(':leave', [
    group([
      query('@*', animateChild()),
      query('mat-form-field:nth-of-type(odd)', [
          fadeOutLeftAnimation('500ms', '0ms')
      ], { optional: true }),
      query('mat-form-field:nth-of-type(even)', [
          fadeOutRightAnimation('500ms', '0ms')
      ], { optional: true })
    ])
  ])
]);

const btnGroupAnimationMetadata = trigger('btnGroup', [
  transition(':enter', [
    bounceInUpAnimation.startState,
    bounceInUpAnimation('800ms', '300ms')
  ]),
  transition(':leave', [ zoomOutAnimation('500ms', '0ms') ])
]);

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ formAnimationMetadata, btnGroupAnimationMetadata ]
})
export class NewPasswordComponent extends PageComponent implements OnDestroy {

  passwordUpdated = false;
  formGroup: FormGroup<{ [key in keyof NewPasswordModel]: FormControl<NewPasswordModel[key]> }>;

  public get submitBtnDisabled(): boolean {
    return this._onceSubmited && (this.formGroup.invalid || this.formGroup.pending);
  }

  private _destroy$ = new Subject<void>();
  private _onceSubmited = false;

  constructor(formBuilder: NonNullableFormBuilder,
              authEvents: AuthStateEvents,
              private readonly _store: Store<AppState>,
              changeDetectorRef: ChangeDetectorRef,
              spinnerService: GlobalLoadingSpinnerService) {
    super();

    const formGroup = this.formGroup = formBuilder.group({
      oldPassword: formBuilder.control(
        '',
        validationWithMessage(Validators.required, 'Old password is required!')
      ),
      newPassword: formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'New password is required!'),
          validationWithMessage(Validators.minLength(5), 'New password must contain minimum 5 characters!'),
          distinctValidator('oldPassword', 'New password and old password can not be the same!')
        ]
      ),
      confirmNewPassword: formBuilder.control(
        '',
        [
          validationWithMessage(Validators.required, 'Password confirmation is required!'),
          validationWithMessage(Validators.minLength(5), 'Password confirmation must contain minimum 5 characters!'),
          compareValidator('newPassword', 'Password confirmation must match with newly provided password!')
        ]
      )
    });

    setTrimSanitizer(formGroup.controls.oldPassword);
    setTrimSanitizer(formGroup.controls.newPassword);
    setTrimSanitizer(formGroup.controls.confirmNewPassword);


    authEvents.changingPassword$.pipe(
      takeUntil(this._destroy$)
    ).subscribe((status) => {
      switch (status) {
        case AsyncActionStatus.awaiting:
          spinnerService.attach();
          break;
        case AsyncActionStatus.resolved:
          this.passwordUpdated = true;
          formGroup.reset();
          formGroup.markAsUntouched();
          changeDetectorRef.markForCheck();
          spinnerService.detach();
          break;
        case AsyncActionStatus.rejected:
          spinnerService.detach();
          break;
      }
    });

  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onSubmit(): void {

    if (!this._onceSubmited) {
      markAllAsTouchedAndDirty(this.formGroup);
      this._onceSubmited = true;
    }

    if (this.formGroup.invalid) { return; }

    this._store.dispatch(changePasswordStart({ newPasswordModel: this.formGroup.getRawValue() }));
  }

  onUpdateAgainButtonClick(): void {
    this.passwordUpdated = false;
  }

}
