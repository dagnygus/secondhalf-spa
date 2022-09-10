import { FormComponent } from 'src/app/my-package';
import { Directive, HostBinding } from '@angular/core';

@Directive()
export class PageComponent {
  @HostBinding('class.page-component') pageComponent = true;
}

@Directive()
export abstract class FormPageComponent<T extends object> extends FormComponent<T> {
  @HostBinding('class.page-component') pageComponent = true;
  protected abstract override model: T;
}
