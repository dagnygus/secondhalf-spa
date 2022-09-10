// eslint-disable-next-line max-len
import { fadeInLeftAnimation, fadeInRightAnimation, backInDownAnimation, fadeOutRightAnimation, fadeOutLeftAnimation, backOutUpAnimation, zoomOutAnimation } from './../../../../utils/ng-animations';
import { query, transition, stagger, group, animateChild } from '@angular/animations';
/* eslint-disable @typescript-eslint/member-ordering */
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { AddressInfoModel, AddressInfoModelImpl } from './../../../../models/address-info-model';
import { ChangeDetectionStrategy, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormComponent } from '../../../../../app/my-package';
import { Observable } from 'rxjs';
import { trigger } from '@angular/animations';

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
export class AddressInfoFormComponent extends FormComponent<AddressInfoModelImpl> implements OnInit {

  protected model = new AddressInfoModelImpl();

  private _addressFormSubmited = new EventEmitter<AddressInfoModel>();
  @Output() get addressFormSubmited(): Observable<AddressInfoModel> { return this._addressFormSubmited; }

  constructor(private readonly _formBuider: RxFormBuilder) { super(); }

  ngOnInit(): void {
    this.setForm(this._formBuider.formGroup(this.model));
    // this.form!.statusChanges.pipe(unsubscribeWith(this)).subscribe(this.changeDetectorRef.detectChanges.bind(this.changeDetectorRef));

    this.setTrimAndTitleSanitizor('city');
    this.setTrimAndTitleSanitizor('state');
  }

  onSubmit(): void {
    if (this.form?.invalid) {
      this.markAllAsTouchedAndDirty();
      return;
    }

    this.model.street = this.model.street.trim();
    this._addressFormSubmited.emit(this.model.toReadonlyPlainJSObj());
  }

}
