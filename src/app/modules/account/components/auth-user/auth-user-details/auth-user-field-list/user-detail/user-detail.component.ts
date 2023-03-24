import { validationWithMessage, noNumbersAndSpecialCharactersValidator, streetValidator, FormSubmitter } from '../../../../../../../utils/form-helper';
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { AsyncValidationService } from '../../../../../../../services/validation.service';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, AbstractControl, AsyncValidatorFn, Validators, NonNullableFormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, pipe, Subject } from 'rxjs';
import { animate, group, query, state, style, transition, trigger, animateChild } from '@angular/animations';
import { format } from 'date-fns';

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

@Component({
  selector: 'app-user-detail[name][isDate][multiline][label][control]',
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
export class UserDetailComponent implements OnChanges, OnDestroy {

  private static _onEdit = new Subject<string>();
  private _destroy$ = new Subject<void>();

  readonly form: FormGroup;
  readonly formSubmitter: FormSubmitter

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
  @Input() name: string = null!;
  @Input() label: string = null!;
  @Input() multiline: boolean = null!;
  @Input() isDate: boolean = null!;
  @Input() control: FormControl<string> = null!;

  @Output() detailSubmit = new EventEmitter<string>();
  @Output() detailCancel = new EventEmitter<string>();


  constructor(formBuilder: NonNullableFormBuilder,
              changeDetectorRef: ChangeDetectorRef,) {
    this.form = formBuilder.group({});
    UserDetailComponent._onEdit.pipe(takeUntil(this._destroy$)).subscribe((name) => {
      if (this.name != name && this.edit) {
        this.edit = false;
        changeDetectorRef.markForCheck();
      }
    });

    this.formSubmitter = new FormSubmitter(this.form);
    this.formSubmitter.submitSuccess.subscribe(() => {
      this.detailSubmit.emit(this.name);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      if (this.control) {
        this.form.removeControl(this.name);
      }
      this.form.addControl(this.name, this.control);
    }
  }

  ngOnDestroy(): void {
    this.formSubmitter.dispose();
    this._destroy$.next();
    this._destroy$.complete();
  }

  onAnimationDone(): void {
    this.focus = this.edit;
  }

  onEditButtonClick(): void {
    UserDetailComponent._onEdit.next(this.name);
    this.edit = true;
  }

  onCancel(): void {
    this.edit = false;
    this.detailCancel.emit(this.name);
    this.control?.markAsUntouched();
    this.control?.markAsPristine();
  }

}
