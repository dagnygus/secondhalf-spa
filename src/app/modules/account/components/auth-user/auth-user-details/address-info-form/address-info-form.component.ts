import { validationWithMessage, noNumbersAndSpecialCharactersValidator, noSpecialCharactersValidator, markAllAsTouchedAndDirty, FormSubmitter } from '../../../../../../utils/form-helper';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
// eslint-disable-next-line max-len
import { fadeInLeftAnimation, fadeInRightAnimation, backInDownAnimation, fadeOutRightAnimation, fadeOutLeftAnimation, backOutUpAnimation, zoomOutAnimation } from '../../../../../../utils/ng-animations';
import { query, transition, stagger, group, animateChild } from '@angular/animations';
/* eslint-disable @typescript-eslint/member-ordering */
import { AddressInfoModel } from '../../../../../../models/address-info-model';
import { ChangeDetectionStrategy, Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { trigger } from '@angular/animations';
import { AddressInfoService } from 'src/app/modules/account/services/address-info.service';

const formAnimationMetadata = trigger('form', [
  transition(':enter', [
    group([
      query('@*', [animateChild()]),
      query('mat-form-field:nth-of-type(odd)', [
        fadeInRightAnimation.startState,
        stagger(150, fadeInRightAnimation('300ms', '0ms'))
      ], { optional: true }),
      query('mat-form-field:nth-of-type(even)', [
        fadeInLeftAnimation.startState,
        stagger(150, fadeInLeftAnimation('300ms', '150ms'))
      ], { optional: true }),
    ])
  ]),
  transition(':leave', [
    group([
      query('@*', [animateChild()]),
      query('mat-form-field:nth-of-type(odd)', [
        fadeOutRightAnimation.startState,
        stagger(150, fadeOutRightAnimation('300ms', '0ms'))
      ], { optional: true }),
      query('mat-form-field:nth-of-type(even)', [
        fadeOutLeftAnimation.startState,
        stagger(150, fadeOutLeftAnimation('300ms', '150ms'))
      ], { optional: true }),
    ])
  ]),
]);

const btnGroupAnimationMetadata = trigger('btnGroup', [
  transition(':enter', backInDownAnimation('800ms', '150ms')),
  transition(':leave', zoomOutAnimation('800ms', '150ms'))
]);

@Component({
  selector: 'app-address-info-form',
  templateUrl: './address-info-form.component.html',
  styleUrls: ['./address-info-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ formAnimationMetadata, btnGroupAnimationMetadata ]
})
export class AddressInfoFormComponent implements OnDestroy {
  private _subscrition = new Subscription();

  readonly formGroup: FormGroup<{ [key in keyof AddressInfoModel]: FormControl<AddressInfoModel[key]> }>;
  readonly formSubmitter: FormSubmitter

  @Output() readonly addressFormSubmited = new EventEmitter<AddressInfoModel>();

  constructor(addressInfoService: AddressInfoService) {
    const sampler = new Subject<void>();

    const { formGroup, dispose } = addressInfoService.getFormGroup(sampler)
    this.formGroup = formGroup;
    this._subscrition.add(dispose);

    this.formSubmitter = new FormSubmitter(this.formGroup);
    this.formSubmitter.submitSuccess.subscribe(() => {
      sampler.next();
      this.addressFormSubmited.emit(this.formGroup.getRawValue());
    })
  }

  ngOnDestroy(): void {
    this._subscrition.unsubscribe();
  }
}
