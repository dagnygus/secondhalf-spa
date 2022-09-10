/* eslint-disable @typescript-eslint/member-ordering */
import { Destroyable } from './destroyable';
import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

type OperatorType = OperatorFunction<string, string> |
                    UnaryFunction<Observable<string>, Observable<string>>;

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class FormComponent<TModel extends object> {
  protected abstract model: TModel;

  private _onceSubmited = false;

  public get disableSubmit(): boolean {
    return !this._onceSubmited ? false : !this._form ? false : this._form!.invalid || this._form!.pending;
  }

  private _form?: FormGroup;
  public get form(): FormGroup | undefined {
    return this._form;
  }

  // Trim operators;
  private get _trimOperator(): OperatorType { return map((value: string) => value ? value.trim() : value); }
  private get _ltrimOperator(): OperatorType { return map((value: string) => value ? value.trimLeft() : value); }
  private get _rtrimOperator(): OperatorType { return map((value: string) => value ? value.trimRight() : value); }

  // First operator to entry
  private get _toStringMap(): OperatorType { return map(value => value == null ? '' : String(value)); }

  // Trim and titile maps
  private get _trimTitleOperator(): OperatorType { return pipe(this._trimOperator, map(value => this._toTitle(value))); }
  private get _ltrimTitleOperator(): OperatorType { return pipe(this._ltrimOperator, map(value => this._toTitle(value))); }
  private get _rtrimTitleOperator(): OperatorType { return pipe(this._rtrimOperator, map(value => this._toTitle(value))); }

  private get _upperOperator(): OperatorType { return map((value: string) => value.toUpperCase()); }
  private get _lowerOperator(): OperatorType { return map((value: string) => value.toUpperCase()); }

  protected setForm(formGroup: FormGroup): void {
    if (!this._form) {
      this._form = formGroup;
    }
  }

  protected markAllAsTouchedAndDirty(): void {
    if (!this._onceSubmited && this._form!.invalid) {
      this._markAllAsTouchedAndDirty(this._form!);
      this._onceSubmited = true;
    }
  }

  protected setAsyncValidator(controlName: keyof TModel, asyncValidator: AsyncValidatorFn): void {
    if (!this._form) { return; }
    this._form.controls[controlName as string].setAsyncValidators(asyncValidator);
  }

  protected setTrimSanitizor(...controlNames: (keyof TModel)[]): void {
    if (!this._form) { return; }
    controlNames.forEach(cn => this._setSanitizer(cn, this._trimOperator));
  }
  protected setLTrimSanitizor(...controlNames: (keyof TModel)[]): void {
    if (!this._form) { return; }
    controlNames.forEach(cn => this._setSanitizer(cn, this._ltrimOperator));
  }
  protected setRTrimSanitizor(...controlNames: (keyof TModel)[]): void {
    if (!this._form) { return; }
    controlNames.forEach(cn => this._setSanitizer(cn, this._rtrimOperator));
  }
  protected setTrimAndTitleSanitizor(...controlNames: (keyof TModel)[]): void {
    if (!this._form) { return; }
    controlNames.forEach(cn => this._setSanitizer(cn, this._trimTitleOperator));
  }
  protected setLTrimAndTitleSanitizor(...controlNames: (keyof TModel)[]): void {
    if (!this._form) { return; }
    controlNames.forEach(cn => this._setSanitizer(cn, this._ltrimTitleOperator));
  }
  protected setRTrimAndTitleSanitizor(...controlNames: (keyof TModel)[]): void {
    if (!this._form) { return; }
    controlNames.forEach(cn => this._setSanitizer(cn, this._rtrimTitleOperator));
  }
  protected setToUpperSanitizor(...controlNames: (keyof TModel)[]): void {
    if (!this._form) { return; }
    controlNames.forEach(cn => this._setSanitizer(cn, this._upperOperator));
  }
  protected setToLowerSanitizor(...controlNames: (keyof TModel)[]): void {
    if (!this._form) { return; }
    controlNames.forEach(cn => this._setSanitizer(cn, this._lowerOperator));
  }

  private _toTitle(value: string): string {
    return value.replace(/\w\S*/, txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase());
  }

  private _setSanitizer(controlName: keyof TModel, operator: OperatorType): void {
    const control = this._form!.controls[controlName as any];
    this._setSanitizerForControler(control, operator);
  }

  private _setSanitizerForControler(control: AbstractControl, operator: OperatorType): void {
    control.valueChanges.pipe(
      this._toStringMap,
      operator,
      filter(value => value !== '' && control.value !== value)
    ).subscribe(value => control.setValue(value));
  }

  private _markAllAsTouchedAndDirty(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
      control.markAsDirty();
      control.markAsTouched();

      if ((control as any).controls) {
        this._markAllAsTouchedAndDirty(((control as any).controls) as any);
      }

    });
  }
}
