import { fadeInAnimation, fadeOutAnimation } from '../../../../utils/ng-animations';
// eslint-disable-next-line max-len
import { bounceInAnimation, bounceOutAnimation, fadeInLeftAnimation, fadeInRightAnimation, zoomInAnimation, zoomOutAnimation, fadeOutRightAnimation, fadeOutLeftAnimation } from '../../../../utils/ng-animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { signinSuccess, signinFailed } from 'src/app/state/auth/auth.actions';
import { GlobalLoadingSpinnerService } from '../../../../services/global-loading-spinner.service';
import { signupFailed } from '../../../../state/auth/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { signupStart } from '../../../../state/auth/auth.actions';
import { Store } from '@ngrx/store';
import { AsyncValidationService } from '../../../../services/validation.service';
import { RegisterModelImpl } from '../../../../models/register-model';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component,
         HostBinding,
         OnDestroy,
         OnInit } from '@angular/core';
import * as moment from 'moment';
import { animate, style, transition, trigger, query, group, stagger } from '@angular/animations';
// import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/app/app.ngrx.utils';
import { Subscription, merge } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { FirebaseError } from '@angular/fire/app';
import { FormPageComponent } from 'src/app/modules/shared/directives/page.component';


const calendarContainerAnimationMetadata = trigger('calendarContainer', [
  transition(':enter', [

    group([
      query('.calendar-backdrop', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      query('.calendar-card', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])

  ]),
  transition(':leave', [
    group([
      query('.calendar-backdrop', [
        style({ opacity: 1 }),
        animate('300ms ease-out', style({ opacity: 0 }))
      ]),
      query('.calendar-card', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ])
]);

const btnGroupEnterAnimation = query('.register-form__btn-group', bounceInAnimation('600ms', '400ms'), { optional: true });

const btnGroupLeaveAnimation = query('.register-form__btn-group', bounceOutAnimation('600ms', '0ms'), { optional: true });

const formHeaderEnterAnimation = query('.register-form__header', fadeInAnimation('400ms', '300ms'), { optional: true });

const formHeaderLeaveAnimation = query('.register-form__header', fadeOutAnimation('400ms', '0ms'), { optional: true });

const formAnimationMetadata = trigger('registerForm', [
  transition('void => small_view_port', [
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
      btnGroupEnterAnimation,
      formHeaderEnterAnimation
    ])
  ]),
  transition('void => big_view_port', [
    group([
      query('.register-form__regular:nth-of-type(odd)', [
        fadeInLeftAnimation.startState,
        stagger(150, [
          fadeInLeftAnimation('300ms', '300ms')
        ])
      ], { optional: true }),
      query('.register-form__regular:nth-of-type(even)', [
        fadeInRightAnimation.startState,
        stagger(150, [
          fadeInRightAnimation('300ms', '450ms')
        ])
      ], { optional: true }),
      query('.register-form__last', [
        fadeInRightAnimation.startState,
        stagger(150, [
          zoomInAnimation('300ms', '1050ms')
        ])
      ], { optional: true }),
      btnGroupEnterAnimation,
      formHeaderEnterAnimation
    ])
  ]),
  transition('small_view_port => void', [
    group([
      query('mat-form-field:nth-of-type(odd)', [
        fadeOutRightAnimation('300ms', '0ms')
      ], { optional: true }),
      query('mat-form-field:nth-of-type(even)', [
        fadeOutLeftAnimation('300ms', '0ms')
      ], { optional: true }),
      btnGroupLeaveAnimation,
      formHeaderLeaveAnimation
    ])
  ]),
  transition('big_view_port => void', [
    group([
      query('.register-form__regular:nth-of-type(odd)', [
        fadeOutLeftAnimation('300ms', '0ms')
      ], { optional: true }),
      query('.register-form__regular:nth-of-type(even)', [
          fadeOutRightAnimation('300ms', '0ms')
      ], { optional: true }),
      query('.register-form__last', [
        zoomOutAnimation('300ms', '0ms')
      ], { optional: true }),
      btnGroupLeaveAnimation,
      formHeaderLeaveAnimation
    ])
  ])
]);

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  animations: [
    calendarContainerAnimationMetadata,
    formAnimationMetadata
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent extends FormPageComponent<RegisterModelImpl> implements OnInit, OnDestroy {

  @HostBinding('@registerForm') animationState!: string;

  calendarOpened = false;
  error: FirebaseError | null = null;
  passwordHidden = true;
  protected model = new RegisterModelImpl();

  private _subscription?: Subscription;
  private _takeErrorResponse = false;

  constructor(private readonly _chandeDetectorRef: ChangeDetectorRef,
              private readonly _rxFormBuilder: RxFormBuilder,
              private readonly _asyncValidationService: AsyncValidationService,
              private readonly _store: Store<AppState>,
              private readonly _actions$: Actions,
              private readonly _loadingSpinnerService: GlobalLoadingSpinnerService,
              private readonly _breakpointObserver: BreakpointObserver) {
    super();
  }

  ngOnInit(): void {
    this.setForm(this._rxFormBuilder.formGroup(this.model));
    this.setSanitizors();
    this.setAsyncValidator('email', this._asyncValidationService.email(() => {
      this._chandeDetectorRef.markForCheck();
    }));

    this._subscription = merge(
      this._actions$.pipe(
        ofType(signupStart),
        tap(() => this._loadingSpinnerService.attach())
      ),
      this._actions$.pipe(
        ofType(signinSuccess),
        tap(() => this._loadingSpinnerService.detach())
      ),
      this._actions$.pipe(
        ofType(signinFailed),
        tap(() => this._loadingSpinnerService.detach())
      ),
      this._actions$.pipe(
        ofType(signupFailed),
        tap(() => this._loadingSpinnerService.detach())
      ),
      this._breakpointObserver.observe('(min-width: 840px)').pipe(
        tap((state) => {
          if (state.matches) {
            this.animationState = 'big_view_port';
          } else {
            this.animationState = 'small_view_port';
          }
        })
      ),
      this._actions$.pipe(
        ofType(signupFailed),
        filter(() => this._takeErrorResponse),
        map(({ error }) => {
          this.error = error;
          this._takeErrorResponse = false;
          this._chandeDetectorRef.markForCheck();
        }),
      )
    ).subscribe();
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  onFormSubmit(): void {
    if (this.form!.invalid) {
      this.markAllAsTouchedAndDirty();
      return;
    }
    this._takeErrorResponse = true;
    this._store.dispatch(signupStart({ registerModel: this.model.toReadonlyPlainJSObj() }));
  }

  onSelected(selectedDate: Date): void {
    const dateStr = moment(selectedDate).format('YYYY-MM-DD');
    this.form!.controls.dateOfBirth.setValue(dateStr);
    this.closeCalendar();
  }

  openCalendar(): void {
    this.calendarOpened = true;
  }

  closeCalendar(): void {
    this.calendarOpened = false;
  }

  toggleCalendar(): void {
    this.calendarOpened = !this.calendarOpened;
  }

  private setSanitizors(): void {
    this.setTrimAndTitleSanitizor('firstName', 'lastName', 'nickName');
    this.setTrimSanitizor('gender', 'password', 'confirmPassword', 'dateOfBirth');
  }
}
