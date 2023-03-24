import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef, EmbeddedViewRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mediaQuery]'
})
export class MediaQueryDirective implements OnDestroy {
  private _subscription?: Subscription;
  private _view: EmbeddedViewRef<unknown> | null = null;

  @Input() set mediaQuery(value: string) {
    if (!isPlatformBrowser(this._platformId)) { return; }

    this._subscription?.unsubscribe()

    this._subscription = this._brkpointObs.observe(value).subscribe((state) => {
      if (state.matches) {
        if (this._view) {
          this._viewContainer.clear();
        }
        this._view = this._viewContainer.createEmbeddedView(this._template);
      } else {
        if (this._view) {
          this._viewContainer.clear();
          this._view = null;
        }
      }
    });
  }

  constructor(private _brkpointObs: BreakpointObserver,
              private _viewContainer: ViewContainerRef,
              private _template: TemplateRef<unknown>,
              @Inject(PLATFORM_ID) private _platformId: object) {
    if (isPlatformServer(this._platformId)) {
      this._viewContainer.createEmbeddedView(this._template);
    }
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

}
