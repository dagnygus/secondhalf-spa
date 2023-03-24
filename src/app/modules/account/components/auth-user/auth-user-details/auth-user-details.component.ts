import { AsyncValidationService } from '../../../../../services/validation.service';
import { UserDetailsService, DetailsControls, DetailsKeys } from '../../../services/user-details.service';
import { assertNotNull } from 'src/app/utils/others';
import { AuthStateRef } from '../../../../../state/auth/auth.state';
import { AuthStateEvents } from '../../../../../state/auth/auth.effects';
import { zoomOutUpAnimation, fadeInAnimation, fadeOutAnimation } from '../../../../../utils/ng-animations';
import { fadeInLeftAnimation, fadeInRightAnimation, fadeOutLeftAnimation, fadeOutRightAnimation, zoomInDownAnimation } from '../../../../../utils/ng-animations';
import { PatchUserModel } from '../../../../../models/patch-user-model';
import { postAvatar, addAddressInfo, updateUser } from '../../../../../state/auth/auth.actions';
import { filter, map, tap } from 'rxjs/operators';
import { AddressInfoModel } from '../../../../../models/address-info-model';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { trigger, query, transition, stagger, group, animateChild } from '@angular/animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { AsyncActionStatus } from 'src/app/state/utils';


const detailsAnimationMetadata = trigger('authUser', [
  transition('void => enter_to_small_view', [
    group([
      query('@*', [animateChild()]),
      query('app-user-detail:nth-of-type(even)', [
      fadeInLeftAnimation.startState,
      stagger(300, [
        fadeInLeftAnimation('300ms', '300ms')
      ])
    ], { optional: true }),
    query('app-user-detail:nth-of-type(odd)', [
      fadeInRightAnimation.startState,
      stagger(300, [
        fadeInRightAnimation('300ms', '150ms')
      ])
    ], { optional: true }),
  ])]),
  transition('enter_to_small_view => void', [
    group([
      query('@*', [animateChild()]),
      query('app-user-detail:nth-of-type(even)', [
      stagger(300, [
        fadeOutRightAnimation('300ms', '300ms'),
      ])
    ], { optional: true }),
    query('app-user-detail:nth-of-type(odd)', [
      stagger(300, [
        fadeOutLeftAnimation('300ms', '150ms'),
      ])
    ], { optional: true }),
  ])]),
  transition('void => enter_to_big_view', [
    query('app-user-detail', [
      fadeInRightAnimation.startState,
      stagger(150, [
        fadeInRightAnimation('300ms', '600ms')
      ])
    ])
  ]),
  transition('enter_to_big_view => void', [
    query('app-user-detail', [
      fadeOutRightAnimation('600ms', '0ms'),
    ])
  ]),
]);

const authAdressInfoAnimationMetadata = trigger('authAddressInfo', [
  transition('void => enter_to_small_view', [
    group([
      query('@*', [animateChild()]),
      query('app-user-detail:nth-of-type(even)', [
      fadeInLeftAnimation.startState,
      stagger(300, [
        fadeInLeftAnimation('300ms', '1200ms')
      ])
    ], { optional: true }),
    query('app-user-detail:nth-of-type(odd)', [
      fadeInRightAnimation.startState,
      stagger(300, [
        fadeInRightAnimation('300ms', '1050ms')
      ])
    ], { optional: true }),
  ])]),
  transition('enter_to_small_view => void', [
    group([
      query('@*', [animateChild()]),
      query('app-user-detail:nth-of-type(even)', [
      stagger(300, [
        fadeOutRightAnimation('300ms', '1200ms'),
      ])
    ], { optional: true }),
    query('app-user-detail:nth-of-type(odd)', [
      stagger(300, [
        fadeOutLeftAnimation('300ms', '1050ms'),
      ])
    ], { optional: true }),
  ])]),
  transition('void => enter_to_big_view', [
    query('app-user-detail', [
      fadeInRightAnimation.startState,
      stagger(150, [
        fadeInLeftAnimation('300ms', '1350ms')
      ])
    ])
  ]),
  transition('enter_to_big_view => void', [
    query('app-user-detail', [
      fadeOutRightAnimation('600ms', '0ms'),
    ])
  ]),
]);

const avataAnimationMetadata = trigger('avatar', [
  transition(':enter', [
    zoomInDownAnimation.startState,
    zoomInDownAnimation('600ms', '500ms')
  ]),
  transition('enter_to_small_view => void', [
    zoomOutUpAnimation('600ms', '0ms')
  ]),
  transition('enter_to_big_view => void', [
    fadeOutLeftAnimation('600ms', '0ms')
  ]),
]);

const checkboxAnimationMetadata = trigger('checkbox', [
  transition(':enter', [fadeInAnimation.startState, fadeInAnimation('300ms', '150ms')]),
  transition(':leave', [fadeOutAnimation('300ms', '0ms')]),
]);

@Component({
  selector: 'app-auth-user-details',
  templateUrl: './auth-user-details.component.html',
  styleUrls: ['./auth-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ detailsAnimationMetadata, avataAnimationMetadata, checkboxAnimationMetadata, authAdressInfoAnimationMetadata ]
})
export class AuthUserDetailsComponent extends PageComponent implements OnDestroy {

  private _currentUserId!: string;
  private _sanitizationSampler = new Subject<void>();
  private _subscription = new Subscription();
  private _destroy$ = new Subject<void>();

  file: File | null = null;
  fileData: string | null = null;

  readonly avatarPending$: Observable<boolean>;
  readonly hasAddressInfo$: Observable<boolean>;
  readonly uploadAvatarFailed$: Observable<boolean>;
  readonly pendingFieldName$ = new BehaviorSubject<string | null>(null);
  readonly addAddressInfomation$ = new BehaviorSubject(false);
  readonly controls: DetailsControls;
  readonly addressFieldNames: readonly DetailsKeys[];
  readonly fieldNames: readonly DetailsKeys[];
  readonly labels: readonly string[];
  readonly addressLabels: readonly string[];

  get imageUrl(): string | null | undefined {
    return this._authStateRef.state.userData?.mainPhotoUrl;
  }

  constructor(private readonly _store: Store<AppState>,
              private readonly _authStateRef: AuthStateRef,
              private readonly _detailsService: UserDetailsService,
              asyncValidationService: AsyncValidationService,
              authStateEvents: AuthStateEvents,) {
    super();
    assertNotNull(this._authStateRef.state.userData);

    this.addressFieldNames = this._detailsService.getAddressInfoFiledNames();
    this.fieldNames = this._detailsService.getBasicFiledNames();
    this.labels = this._detailsService.getBasicLabels();
    this.addressLabels = this._detailsService.getAddressInfoLabels();
    this.avatarPending$ = authStateEvents.postingAvatar$.pipe(
      tap((status) => {
        if (status === AsyncActionStatus.resolved) {
          this.file = null;
        }
      }),
      map((status) => status === AsyncActionStatus.awaiting)
    );
    this.uploadAvatarFailed$ = authStateEvents.postingAvatar$.pipe(map((status) => status === AsyncActionStatus.rejected));
    this.hasAddressInfo$ = _store.pipe(select(({ auth }) => auth.userData?.hasAddressInfo ?? false));
    this._subscription.add(authStateEvents.updatingUser$.pipe(
      filter((status) => status === AsyncActionStatus.resolved),
      map(() => null)
    ).subscribe(this.pendingFieldName$));
    this._subscription.add(authStateEvents.addingAddressInfo$.pipe(
      map((status) => status === AsyncActionStatus.resolved)
    ).subscribe(this.addAddressInfomation$));

    const { controls, dispose } = this._detailsService.getControls(
      this._authStateRef.state.userData,
      this._sanitizationSampler
    );
    this.controls = controls;
    this._subscription.add(dispose);
    this.controls.email.addAsyncValidators(asyncValidationService.hasEmail());

    this._currentUserId = this._authStateRef.state.userData.userId;

    this._subscription.add(() => {
      this._destroy$.next();
      this._destroy$.complete();
      this._sanitizationSampler.complete();
    });

  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onAvatarFormSubmit(file: File | null): void {
    if (file == null) { return; }
    this._store.dispatch(postAvatar({ file, info: 'Posting avatar from auth-user-details component.' }));
  }

  onAddressFormSubmited(addressInfoModel: AddressInfoModel): void {
    this._store.dispatch(addAddressInfo({ data: addressInfoModel, info: 'Adding address info from auth-user-details component.' }));
  }

  onDetailCancel(): void {
    assertNotNull(this._authStateRef.state.userData)
    this._detailsService.update(this.controls, this._authStateRef.state.userData);
  }

  onDetailSubmit(name: DetailsKeys): void {
    this._sanitizationSampler.next();
    const value = this.controls[name].value;
    assertNotNull(this._authStateRef.state.userData);

    if (value === this._authStateRef.state.userData[name]) {
      return;
    }

    this.pendingFieldName$.next(name);

    const data: PatchUserModel = {
      userId: this._currentUserId,
      fieldName: name,
      newValue: value
    };
    this._store.dispatch(updateUser({ data, info: 'Updating user from auth-user-details component.' }));
  }

}
