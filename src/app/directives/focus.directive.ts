/* eslint-disable @typescript-eslint/member-ordering */
import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Inject, Input, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {

  private _getFocus?: () => void;

  @Input('appFocus') set focus(value: boolean) {
    if (!isPlatformBrowser(this.platformId)) { return; }
    if (!value) { return; }

    this.hostRef.nativeElement.focus();

  }

  constructor(private hostRef: ElementRef<HTMLElement>,
              @Inject(PLATFORM_ID) private platformId: object) { }

}
