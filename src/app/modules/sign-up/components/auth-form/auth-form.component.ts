import { AuthStateEvents } from './../../../../state/auth/auth.effects';
import { FormSubmitter } from './../../../../utils/form-helper';
import { PageComponent } from './../../../shared/directives/page.component';
import { fadeInAnimation, fadeOutAnimation } from '../../../../utils/ng-animations';
// eslint-disable-next-line max-len
import { bounceInAnimation, bounceOutAnimation, fadeInLeftAnimation, fadeInRightAnimation, zoomInAnimation, zoomOutAnimation, fadeOutRightAnimation, fadeOutLeftAnimation } from '../../../../utils/ng-animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GlobalLoadingSpinnerService } from '../../../../services/global-loading-spinner.service';
import { Store } from '@ngrx/store';
import { AsyncValidationService } from '../../../../services/validation.service';
import { RegisterModel } from '../../../../models/register-model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component,
         HostBinding,
         OnDestroy } from '@angular/core';
import { animate, style, transition, trigger, query, group, stagger } from '@angular/animations';
// import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/app/app.ngrx.utils';
import { filter, map, merge, Observable, Subscription, tap } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';
import { FormControl, FormGroup } from '@angular/forms';
import { signUp } from 'src/app/state/auth/auth.actions';
import { SignUpService } from 'src/app/modules/sign-up/services/sign-up.service';
import { AsyncActionStatus } from 'src/app/state/utils';


const btnGroupEnterAnimation = query('.btn-group', bounceInAnimation('600ms', '400ms'), { optional: true });

const btnGroupLeaveAnimation = query('.btn-group', bounceOutAnimation('600ms', '0ms'), { optional: true });

const formHeaderEnterAnimation = query('.header', fadeInAnimation('400ms', '300ms'), { optional: true });

const formHeaderLeaveAnimation = query('.header', fadeOutAnimation('400ms', '0ms'), { optional: true });

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
      query('.regular:nth-of-type(odd)', [
        fadeInLeftAnimation.startState,
        stagger(150, [
          fadeInLeftAnimation('300ms', '300ms')
        ])
      ], { optional: true }),
      query('.regular:nth-of-type(even)', [
        fadeInRightAnimation.startState,
        stagger(150, [
          fadeInRightAnimation('300ms', '450ms')
        ])
      ], { optional: true }),
      query('.last', [
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
      query('.regular:nth-of-type(odd)', [
        fadeOutLeftAnimation('300ms', '0ms')
      ], { optional: true }),
      query('.regular:nth-of-type(even)', [
          fadeOutRightAnimation('300ms', '0ms')
      ], { optional: true }),
      query('.last', [
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
    formAnimationMetadata
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent extends PageComponent implements OnDestroy {

  @HostBinding('@registerForm') animationState!: string;

  calendarOpened = false;
  passwordHidden = true;
  readonly formGroup: FormGroup<{ [key in keyof RegisterModel]: FormControl<RegisterModel[key]> }>;
  readonly formSubmitter: FormSubmitter;
  readonly submitDisabled$: Observable<boolean>;
  readonly error$: Observable<FirebaseError | null>;

  get diss(): boolean {
    return false;
  }

  private _subscription = new Subscription();
  // private _takeErrorResponse = false;

  constructor(signUpService: SignUpService,
              authStateEvents: AuthStateEvents,
              asyncValidationService: AsyncValidationService,
              store: Store<AppState>,
              loadingSpinnerService: GlobalLoadingSpinnerService,
              breakpointObserver: BreakpointObserver) {
    super();

    this._subscription.add(breakpointObserver.observe('(min-width: 840px)').subscribe((state) => {
      if (state.matches) {
        this.animationState = 'big_view_port';
      } else {
        this.animationState = 'small_view_port';
      }
    }));

    const { formGroup, dispose } = signUpService.getFormGroup();
    this.formGroup = formGroup;
    this.formGroup.controls.email.addAsyncValidators(asyncValidationService.email());
    this._subscription.add(dispose);

    this.formSubmitter = new FormSubmitter(this.formGroup);

    this.formSubmitter.submitSuccess.subscribe(() => {
      store.dispatch(
        signUp({ registerModel: this.formGroup.getRawValue(), info: 'Signing in from auth-form component.' })
      );
    });

    this._subscription.add(() => this.formSubmitter.dispose());

    this.submitDisabled$ = merge(
      this.formSubmitter.submitDisabled$,
      authStateEvents.signingUp$.pipe(
        filter((status) => status === AsyncActionStatus.awaiting || status === AsyncActionStatus.rejected),
        map((status) => status === AsyncActionStatus.awaiting),
        tap((value) => {
          if (value) {
            loadingSpinnerService.attach();
          } else {
            loadingSpinnerService.detach();
          }
        })
      ),
      authStateEvents.signingIn$.pipe(
        filter((status) => status === AsyncActionStatus.resolved || status === AsyncActionStatus.rejected),
        map(() => false),
        tap(() => loadingSpinnerService.detach())
      )
    )

    this.error$ = merge(
      authStateEvents.signingUp$.pipe(
        map((status) => status === AsyncActionStatus.rejected ? authStateEvents.getError() as any : null),
        filter((error) => error instanceof FirebaseError)
      ),
      authStateEvents.signingIn$.pipe(
        map((status) => status === AsyncActionStatus.rejected ? authStateEvents.getError() as any : null),
        filter((error) => error instanceof FirebaseError)
      )
    );
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }
}
