import { AbstractControl, AsyncValidatorFn, FormGroup } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { UnaryFunction } from 'rxjs';
import { OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Destroyable } from './../core/destroyable';

type ConstructorFn<T = any> = new (...args: any[]) => T;

type MixedConstructorFunctin<T1, T2> = new (...args: any[]) => T1 & T2;

type OperatorType = OperatorFunction<string, string> |
                    UnaryFunction<Observable<string>, Observable<string>>;

declare abstract class FormComponentFunctionality<TModel> extends Destroyable {

  protected abstract model: TModel;

  private _onceSubmited: boolean;

  public get disableSubmit(): boolean;

  private _form?: FormGroup;
  public get form(): FormGroup | undefined;

  // Trim operators;
  private get _trimOperator(): OperatorType;
  private get _ltrimOperator(): OperatorType;
  private get _rtrimOperator(): OperatorType;

  // First operator to entry
  private get _toStringMap(): OperatorType;

  // Trim and titile maps
  private get _trimTitleOperator(): OperatorType;
  private get _ltrimTitleOperator(): OperatorType;
  private get _rtrimTitleOperator(): OperatorType;

  private get _upperOperator(): OperatorType;
  private get _lowerOperator(): OperatorType;

  protected setForm(formGroup: FormGroup): void;

  protected setAsyncValidator(controlName: keyof TModel, asyncValidator: AsyncValidatorFn): void;

  protected setTrimSanitizor(...controlNames: (keyof TModel)[]): void;
  protected setLTrimSanitizor(...controlNames: (keyof TModel)[]): void;
  protected setRTrimSanitizor(...controlNames: (keyof TModel)[]): void;
  protected setTrimAndTitleSanitizor(...controlNames: (keyof TModel)[]): void;
  protected setLTrimAndTitleSanitizor(...controlNames: (keyof TModel)[]): void;
  protected setRTrimAndTitleSanitizor(...controlNames: (keyof TModel)[]): void;
  protected setToUpperSanitizor(...controlNames: (keyof TModel)[]): void;
  protected setToLowerSanitizor(...controlNames: (keyof TModel)[]): void;

  private _toTitle(value: string): string;

  private _setSanitizer(controlName: keyof TModel, operator: OperatorType): void;

  private _setSanitizerForControler(control: AbstractControl, operator: OperatorType): void;
}

// eslint-disable-next-line max-len
export function formComponentMixin<T extends new(...args: any) => Destroyable, TModel>(constructorFn: T): new (...args: any[]) => T & FormComponentFunctionality<TModel>  {

  return class extends constructorFn {

    private _onceSubmited = false;

    public get disableSubmit(): boolean {
      return !this._onceSubmited ? false : !this._form ? false : this._form!.invalid || this._form!.pending;
    }

    private _form?: FormGroup;
    public get form(): FormGroup | undefined {
      return this._form;
    }

    // Trim operators;
    private get _trimOperator(): OperatorType { return map((value: string) => value.trim()); }
    private get _ltrimOperator(): OperatorType { return map((value: string) => value.trimLeft()); }
    private get _rtrimOperator(): OperatorType { return map((value: string) => value.trimRight()); }

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
      ).listen(this, value => control.setValue(value));
    }
  } as any;
}
