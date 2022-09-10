// eslint-disable-next-line max-len
import { bounceInUpAnimation, fadeInLeftAnimation, fadeInRightAnimation, fadeOutLeftAnimation, fadeOutRightAnimation, zoomOutAnimation } from './../../../utils/ng-animations';
import { group, query, animateChild, trigger, stagger, transition } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
/* eslint-disable @typescript-eslint/member-ordering */
import { changePasswordSuccess, changePasswordFailed } from './../../../state/auth/auth.actions';
import { NewPasswordModelImpl } from './../../../models/new-password-model';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormComponent } from 'src/app/my-package';
import { AppState } from 'src/app/app.ngrx.utils';
import { Store } from '@ngrx/store';
import { changePasswordStart } from 'src/app/state/auth/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { unsubscribeWith } from 'src/app/my-package/core/rxjs-operators';
import { merge, Subject } from 'rxjs';
import { GlobalLoadingSpinnerService } from 'src/app/services/global-loading-spinner.service';
import { FormPageComponent } from 'src/app/directives/page.component';

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
export class NewPasswordComponent extends FormPageComponent<NewPasswordModelImpl> implements OnInit, OnDestroy {

  private _destroy$ = new Subject<void>();
  protected model!: NewPasswordModelImpl;

  passwordUpdated = false;


  constructor(private readonly _formBuilder: RxFormBuilder,
              private readonly _store: Store<AppState>,
              private readonly _changeDetectorRef: ChangeDetectorRef,
              private readonly _actions$: Actions,
              private readonly _spinnerService: GlobalLoadingSpinnerService) {
    super();

    this._actions$.pipe(
      ofType(changePasswordSuccess),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this.passwordUpdated = true;
      this.form!.reset();
      this.form!.markAsUntouched();
      this._changeDetectorRef.markForCheck();
    });

    this._actions$.pipe(
      ofType(changePasswordStart),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this._spinnerService.attach();
    });

    merge(
      this._actions$.pipe(ofType(changePasswordSuccess)),
      this._actions$.pipe(ofType(changePasswordFailed)),
    ).pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._spinnerService.detach();
    });

  }

  ngOnInit(): void {

    this.model = new NewPasswordModelImpl();
    this.setForm(this._formBuilder.formGroup(this.model));
    this.setTrimSanitizor('oldPassword', 'newPassword', 'confirmNewPassword');

  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onSubmit(): void {

    this.markAllAsTouchedAndDirty();
    if (this.form!.invalid) { return; }
    this._store.dispatch(changePasswordStart({ newPasswordModel: this.model.toReadonlyPlainJSObj() }));

  }

  onUpdateAgainButtonClick(): void {
    this.passwordUpdated = false;
  }

}
