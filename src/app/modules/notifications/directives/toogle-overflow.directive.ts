import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Inject, PLATFORM_ID, NgZone, DoCheck, OnDestroy } from '@angular/core';
import { Subject, observeOn, asyncScheduler } from 'rxjs';

@Directive({ selector: '[appToogleOverflow]' })
export class ToogleOverflowDirective implements DoCheck, OnDestroy {

  private _afterCheck = new Subject<void>;

  constructor(hostElRef: ElementRef<HTMLElement>,
              ngZone: NgZone,
              @Inject(PLATFORM_ID) private _platformId: object) {
    ngZone.runOutsideAngular(() => {
      this._afterCheck.pipe(
        observeOn(asyncScheduler),
      ).subscribe(() => {
        const element = hostElRef.nativeElement;
        const parentElement = element.parentElement!;
        if (element.clientHeight > parentElement.clientHeight) {
          parentElement.style.overflowY = 'scroll';
        } else {
          parentElement.style.overflowY = '';
        }
      });
    });
  }

  ngDoCheck(): void {
    if (!isPlatformBrowser(this._platformId)) { return; }
    this._afterCheck.next();
  }

  ngOnDestroy(): void {
    this._afterCheck.complete();
  }
}
