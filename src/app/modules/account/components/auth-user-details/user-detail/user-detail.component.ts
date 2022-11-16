/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { AsyncValidationService } from '../../../../../services/validation.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { Observable, pipe, Subject } from 'rxjs';
import { animate, group, query, state, style, transition, trigger, animateChild } from '@angular/animations';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

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

const userDetailAnimationMetadata = trigger('userDetail', [
  transition('false => true', [
    group([
      query('@*', animateChild()),
      style({height: '{{onEditOffHeight}}px' }),
      animate('300ms ease-out', style({ height: '{{onEditOnHeight}}px' })),
    ]),
  ]),
  transition('true => false', [
    group([
      style({ height: '{{onEditOnHeight}}px' }),
      animate('300ms ease-out', style({ height: '{{onEditOffHeight}}px'  })),
      query('@*', animateChild())
    ]),
  ])
]);

const labelAnimationMetadata = trigger('label', [
  state('false', style({
    opacity: 1,
    visibility: 'visible'
  })),
  state('true', style({
    opacity: 0,
    visibility: 'hidden'
  })),
  transition('false <=> true', animate('300ms ease-out'))
]);

const editFormAnimationMetadata = trigger('editForm', [
  state('false', style({
    opacity: 0,
    visibility: 'hidden'
  })),
  state('true', style({
    opacity: 1,
    visibility: 'visible'
  })),
  transition('false <=> true', animate('300ms ease-out'))
]);

const FIRST_NAME = 'firstName';
const LAST_NAME = 'lastName';
const NICK_NAME = 'nickName';
const EMAIL = 'email';
const CITY = 'city';
const STREET = 'street';
const STATE = 'state';
const COUNTRY = 'country';
const ABOUT_MY_SEFL = 'aboutMySelf';

type FieldNamesLiterals = 'firstName' | 'lastName' | 'nickName' | 'email' | 'city' | 'street' | 'state' | 'country';

const _getFieldNameForValidation = (originalFieldName: FieldNamesLiterals) => {
  switch (originalFieldName) {
    case FIRST_NAME:
      return 'Firts name';
    case LAST_NAME:
      return 'Last name';
    case NICK_NAME:
      return 'Nick name';
    case EMAIL:
      return 'Address E-mail';
    case CITY:
      return 'City';
    case STREET:
      return 'Street';
    case COUNTRY:
      return 'Country';
    default:
      return 'State';
  }
};

const SPECIAL_FIELD_NAMES = [ 'firstName', 'lastName', 'nickName' ];
const UNIQ_FIELD_NAME = 'street';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    calendarContainerAnimationMetadata,
    userDetailAnimationMetadata,
    labelAnimationMetadata,
    editFormAnimationMetadata
  ]
})
export class UserDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  private static _onEdit = new Subject<string>();
  private _formControl!: AbstractControl;
  private _asyncValidators?: AsyncValidatorFn;
  private _submited = false;
  private _destroy$ = new Subject<void>();

  form!: FormGroup;

  edit = false;
  focus = false;
  calendarOpened = false;
  avatarPending = false;

  private _pending = false;
  @Input()
  public get pending() {
    return this._pending;
  }
  public set pending(value) {
    this._pending = value;
    if (!value && this.edit) {
      this.edit = false;
    }
  }
  @Input() name = '';
  @Input() label = '';
  @Input() value = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() detailSubmit = new EventEmitter<string>();
  @Output() detailCancel = new EventEmitter<string>();

  get aboutMySelfUserDetail(): boolean {
    return this.name === ABOUT_MY_SEFL && !this.edit;
  }


  constructor(private changeDetectorRef: ChangeDetectorRef,
              private asyncValidationService: AsyncValidationService) { }

  ngOnInit(): void {

    UserDetailComponent._onEdit.pipe(takeUntil(this._destroy$)).subscribe(name => {
      if (this.name !== name && this.edit) {
        this.edit = false;
        this.changeDetectorRef.detectChanges();
      }
    });

    const formControl = this._formControl =  new FormControl();

    this.form = new FormGroup({
      [this.name]: formControl
    });

    formControl.valueChanges.subscribe((val) => {
      this.value = val;
      this.valueChange.emit(this.value);
    });


    switch (this.name) {
      case FIRST_NAME:
      case LAST_NAME:
      case CITY:
      case STATE:
      case COUNTRY:
        formControl.setValidators([
          RxwebValidators.required({
            message: _getFieldNameForValidation(this.name) + ' is required!!'
          }),
          RxwebValidators.alpha({
            message: _getFieldNameForValidation(this.name) + ' must contain only aphabetick characters!!'
          })
        ]);
        break;
      case NICK_NAME:
        formControl.setValidators([
          RxwebValidators.required({
            message: _getFieldNameForValidation(this.name) + ' is required!!'
          }),
          RxwebValidators.alpha({
            message: _getFieldNameForValidation(this.name) + ' must contain only aphabetick characters!!'
          })
        ]);
        break;
      case EMAIL:
        formControl.setValidators([
          RxwebValidators.required({
            message: _getFieldNameForValidation(this.name) + ' is required!!'
          }),
          RxwebValidators.email({
            message: 'Incorrect format of ' + _getFieldNameForValidation(this.name)
          })
        ]);
        this._asyncValidators = this.asyncValidationService.otherEmial(() => {
          if (this._submited && this.form.valid) {
            this._submited = false;
          }
          this.changeDetectorRef.markForCheck();
        });
        break;
      case STREET:
        formControl.setValidators([
          RxwebValidators.required({
            message: _getFieldNameForValidation(this.name) + ' is required!!'
          }),
          RxwebValidators.alphaNumeric({
            allowWhiteSpace: true,
            message: _getFieldNameForValidation(this.name) + ' must contain only aphabetick and numeric characters, including white spaces!!'
          })
        ]);
        break;
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {

    let myPipe: any;

    if (SPECIAL_FIELD_NAMES.includes(this.name)) {
      myPipe = pipe(
        map(val => val == null ? '' : String(val)),
        map(val => val.replace(' ', '')),
        map(val => {
          if (val.length === 0) { return val; }
          return val[0].toUpperCase() + val.substr(1).toLocaleLowerCase();
        })
      );
    } else if (this.name === UNIQ_FIELD_NAME) {
      myPipe = pipe(map(val => val == null ? '' : String(val)));
    } else if (this.name !== ABOUT_MY_SEFL) {
      myPipe = pipe(
        map(val => val == null ? '' : String(val)),
        map(val => val.replace(' ', ''))
      );
    }

    if (this.name === ABOUT_MY_SEFL) {
      return;
    }

    this._formControl.valueChanges.pipe(
      myPipe,
      filter(val => val !== this._formControl.value && val !== '')
    ).subscribe((val) => {
      this._formControl.setValue(val);
    });

  }

  onAnimationDone(): void {
    this.focus = this.edit;
  }

  onInputBlur(): void {
    setTimeout(this._onInputBlurCallback);
  }

  onEditButtonClick(): void {
    UserDetailComponent._onEdit.next(this.name);
    this.edit = true;
    this._formControl.setValue(this.value);
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

  onSelected(selectedDate: Date): void {
    const dateStr = moment(selectedDate).format('YYYY-MM-DD');
    this.value = dateStr;
    this._formControl.setValue(this.value);
    this.valueChange.emit(this.value);
    console.log('selected');
    this.closeCalendar();
  }

  onSubmit(): void {

    if (this._formControl.invalid) {
      this._formControl.markAsTouched();
      this._formControl.markAsDirty();
    }

    if (this._asyncValidators) {
      this._submited = true;
      this._formControl.setAsyncValidators(this._asyncValidators);
      this._formControl.updateValueAndValidity();
      return;
    }

    if (this.form.invalid) {
      return;
    }

    if (this.name === 'street') { (this.value as string).trim(); }

    this.detailSubmit.emit(this.name);
  }

  onCancel(): void {
    this.edit = false;
    this.detailCancel.emit(this.name);
    this._formControl.clearAsyncValidators();
    this._formControl.markAsUntouched();
    this._formControl.markAsPristine();
  }

  private _onInputBlurCallback = () => {
    if (this._submited) { return; }
    if (!this._asyncValidators) { return; }
    this._formControl.setAsyncValidators(this._asyncValidators);
    this._formControl.updateValueAndValidity();
  };

}
