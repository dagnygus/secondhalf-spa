/* eslint-disable @typescript-eslint/member-ordering */
import { NgControl, AsyncValidatorFn } from '@angular/forms';
import { Directive, HostListener, OnInit } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[async-validation-on-blur]',
})
export class AsyncValidationOnBlurDirective implements OnInit {

  private _asyncValidators?: AsyncValidatorFn | null;

  constructor(private controlDirective: NgControl) { }

  ngOnInit(): void {
    if (this.controlDirective.asyncValidator) { return; }
    this._asyncValidators = this.controlDirective.control?.asyncValidator;
    this.controlDirective.control?.clearAsyncValidators();
  }

  @HostListener('focus')
  onFocus(): void {
    if (!this.controlDirective.asyncValidator) { return; }
    this._asyncValidators = this.controlDirective.control?.asyncValidator;
    this.controlDirective.control?.clearAsyncValidators();
  }

  @HostListener('blur')
  onBlur(): void {
    if (!this._asyncValidators) { return; }
    this.controlDirective.control?.setAsyncValidators(this._asyncValidators);
    this.controlDirective.control?.updateValueAndValidity();
  }

}
