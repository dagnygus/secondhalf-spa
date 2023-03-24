import { Directive, HostBinding } from '@angular/core';

@Directive()
export class PageComponent {
  @HostBinding('class.page-component') pageComponent = true;
}
