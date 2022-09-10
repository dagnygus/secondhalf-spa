/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, Input, TemplateRef, ViewContainerRef, DoCheck } from '@angular/core';
import { AbstractControl, AbstractControlDirective, ValidationErrors } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dnng-errors-for]'
})
export class DnngErrorsForDirective implements DoCheck {

  private viewCreated = false;

  private errors?: ValidationErrors | null;
  private dirty?: boolean | null;
  private touched?: boolean | null;

  @Input('dnng-errors-for') input!: AbstractControlDirective | AbstractControl;

  constructor(private templateRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef) { }

  ngDoCheck(): void {

    if (this.input.errors === this.errors &&
        this.input.dirty === this.dirty &&
        this.input.touched === this.touched ) {
          return;
    }
    this.errors = this.input.errors;
    this.dirty = this.input.dirty;
    this.touched = this.input.touched;

    if (this.dirty && this.touched && this.errors) {
      if (this.viewCreated) { this.viewContainerRef.clear(); }

      Object.values(this.errors).forEach(error => {
        this.viewContainerRef.createEmbeddedView(this.templateRef, {
          $implicit: error
        });
      });

      this.viewCreated = true;
    } else {
      if (this.viewCreated) { this.viewContainerRef.clear(); }
      this.viewCreated = false;
    }
  }
}
