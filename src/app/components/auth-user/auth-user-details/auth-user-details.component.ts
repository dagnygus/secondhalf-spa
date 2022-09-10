import { PageComponent } from './../../../directives/page.component';
import { zoomInUpAnimation, zoomOutUpAnimation, fadeInAnimation, fadeOutAnimation } from './../../../utils/ng-animations';
// eslint-disable-next-line max-len
import { fadeInLeftAnimation, fadeInRightAnimation, fadeOutLeftAnimation, fadeOutRightAnimation, zoomInDownAnimation } from './../../../utils/ng-animations';
import { BreakpointObserver } from '@angular/cdk/layout';
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { PatchUserModel } from './../../../models/patch-user-model';
import { StateSnapshotService } from './../../../services/state-snapshot.service';
import { postAvatarStart, postAvatarSuccess, patchUserStart, patchUserSuccess, patchAddressInfoStart, patchAddressInfoSuccess, postAvatarFailed } from '../../../state/auth/auth.actions';
import { map, sample, takeUntil } from 'rxjs/operators';
import { AddressInfoModel } from './../../../models/address-info-model';
// import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy, Renderer2, ElementRef, HostBinding } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { Actions, ofType } from '@ngrx/effects';
import { trigger, query, transition, stagger, group, animateChild } from '@angular/animations';

const USER_ID_KEY = 'userId';
const HAS_ADDRESS_INFO_KEY = 'hasAddressInfo';
const fieldNames = [
  'firstName',
  'lastName',
  'nickName',
  'email',
  'dateOfBirth',
  'aboutMySelf',
];

const addressInfoFieldNames = [
  'city',
  'street',
  'state',
  'country',
];

const labels = [
  'First name',
  'Last name',
  'Nick name',
  'Address e-mail',
  'Date of birth',
  'About Your self'
];

const addressInfoLabels = addressInfoFieldNames.map(label => label[0].toUpperCase() + label.substr(1));

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
  animations: [ detailsAnimationMetadata, avataAnimationMetadata, checkboxAnimationMetadata ]
})
export class AuthUserDetailsComponent extends PageComponent implements OnInit, OnDestroy {

  private _currentUserId!: string;
  private _showSubmitButtonForAvatar = false;
  private _destroy$ = new Subject<void>();
  private _noPatching$ = new Subject<string>();

  get fieldNames(): string[] { return fieldNames; }
  get labels(): string[] { return labels; }
  get addressInfoFieldNames(): string[] { return addressInfoFieldNames; }
  get addressInfoLabels(): string[] { return addressInfoLabels; }
  get showSubmitButtonForAvatar(): boolean { return this._showSubmitButtonForAvatar; }


  avatarFile: File | null = null;
  some = '';
  firstName = '';
  lastName = '';
  nickName = '';
  email = '';
  dateOfBirth = '';
  aboutMySelf = '';

  street = '';
  city = '';
  state = '';
  country = '';

  animationState: string;

  hasAddressInfo = false;
  fileDataUrl: string | null = null;
  avatarPending = false;


  readonly patchUserStart$: Observable<string>;
  readonly patchUserSuccess$: Observable<string>;


  addAdrressInformation = false;

  get imageUrl(): string | null | undefined {
    return this._stateSnapshotService.getAuthState().userData?.mainPhotoUrl;
  }

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef,
              private readonly _store: Store<AppState>,
              private readonly _actions$: Actions,
              private readonly _stateSnapshotService: StateSnapshotService,
              private readonly _breakpointObserver: BreakpointObserver,) {
    super();
    this.patchUserStart$ = this._actions$.pipe(
      ofType(patchUserStart),
      map((action) => action.data.fieldName)
    );

    this.patchUserSuccess$ = merge(
      this.patchUserStart$.pipe(sample(this._actions$.pipe(ofType(patchUserSuccess)))),
      this._noPatching$
    );

    this._actions$.pipe(
      ofType(postAvatarSuccess),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this._showSubmitButtonForAvatar = false;
      this._changeDetectorRef.markForCheck();
    });

    if (this._breakpointObserver.isMatched('(min-width: 650px)')) {
      this.animationState = 'enter_to_big_view';
    } else {
      this.animationState = 'enter_to_small_view';
    }

    this._breakpointObserver.observe('(min-width: 650px)').pipe(
      takeUntil(this._destroy$)
    ).subscribe((state) => {
      if (state.matches) {
        this.animationState = 'enter_to_big_view';
      } else {
        this.animationState = 'enter_to_small_view';
      }
      this._changeDetectorRef.markForCheck();
    });

  }

  ngOnInit(): void {

    this._currentUserId = this._stateSnapshotService.getAuthState().userData!.userId;

    this._store.pipe(
      select((state) => state.auth.userData),
      takeUntil(this._destroy$)
    ).subscribe((userData) => {
      if (!userData) { return; }
      Object.keys(userData).forEach((key) => {
        if (key === USER_ID_KEY) { return; }
        if (key === HAS_ADDRESS_INFO_KEY) {
          this.hasAddressInfo = (userData as any)[key];
          return;
        }
        if (!userData!.hasAddressInfo && addressInfoFieldNames.includes(key)) {
          return;
        }
        (this as any)[key] = (userData as any)[key];
      });
      this._changeDetectorRef.markForCheck();
    });

    this._actions$.pipe(
      ofType(postAvatarSuccess),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this.fileDataUrl = null;
      this.avatarFile = null;
      this._changeDetectorRef.markForCheck();
    });

    this._actions$.pipe(
      ofType(patchAddressInfoSuccess),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this.addAdrressInformation = false;
      this._changeDetectorRef.markForCheck();
    });

    merge<boolean, boolean, boolean>(
      this._actions$.pipe(ofType(postAvatarStart), map(() => true)),
      this._actions$.pipe(ofType(postAvatarSuccess), map(() => false)),
      this._actions$.pipe(ofType(postAvatarFailed), map(() => false)),
    ).pipe(takeUntil(this._destroy$)).subscribe((value) => {
      this.avatarPending = value;
      this._changeDetectorRef.markForCheck();
    });

    // this._renderer.setProperty(
    //   this._hosElRef.nativeElement,
    //   '@authUser',
    //   this.animationState
    // );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onAvatarFormSubmit(): void {
    if (!this.avatarFile) { return; }
    this._store.dispatch(postAvatarStart({ file: this.avatarFile }));
  }

  onAddressFormSubmited(addressInfoModel: Immutable<AddressInfoModel>): void {
    this._store.dispatch(patchAddressInfoStart({ data: addressInfoModel  }));
  }

  onFileDataChange(data: string | null): void {
    this.fileDataUrl = data;
    this._showSubmitButtonForAvatar = true;
  }

  onDetailCancel(name: string): void {
    (this as any)[name] = (this._stateSnapshotService.getAuthState().userData as any)[name];
  }

  onDetailSubmit(name: string): void {
    const currnetStateValue = (this._stateSnapshotService.getAuthState().userData as any)[name];

    if ((this as any)[name] === currnetStateValue) {
      this._noPatching$.next(name);
      return;
    }

    const data: PatchUserModel = {
      userId: this._currentUserId,
      fieldName: name,
      newValue: (this as any)[name]
    };
    this._store.dispatch(patchUserStart({ data }));
  }

}
