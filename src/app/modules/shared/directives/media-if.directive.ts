import { coerceNumberInput, coerceToNonNegativeInteger } from './../../../utils/coerction-and-types';
import { ChangeDetectorRef, Inject, OnChanges, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Directive, Input, TemplateRef, ViewContainerRef, EmbeddedViewRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mediaIf]'
})
export class MediaIfDirective implements OnChanges, OnDestroy {

  private _breakpoint: number = null!;
  private _thenView: EmbeddedViewRef<unknown> | null = null;
  private _elseView: EmbeddedViewRef<unknown> | null = null;
  private _elseTemplate: TemplateRef<unknown> | null = null;
  private _subscription?: Subscription;
  private _ifAnd: boolean | null = null;
  private _lessThen: number | null = null;

  @Input() set mediaIf(value: number | `${number}`) {
    this._breakpoint = coerceToNonNegativeInteger(coerceNumberInput(value));
  }

  @Input() set mediaIfLessThen(value: number | `${number}`) {
    this._lessThen = coerceToNonNegativeInteger(coerceNumberInput(value));
    if (this._lessThen > 0) { this._lessThen-- }
  }

  @Input() set mediaIfThen(template: TemplateRef<unknown>) {
    this._thenTemplate = template;

    if (this._thenView) {
      this._viewContainer.clear();
      this._thenView = this._viewContainer.createEmbeddedView(this._thenTemplate);
    }
  }

  @Input() set mediaIfElse(template: TemplateRef<unknown>) {
    this._elseTemplate = template;

    if (this._elseView) {
      this._viewContainer.clear();
      this._thenView = this._viewContainer.createEmbeddedView(this._elseTemplate);
    }
  }

  @Input() set mediaIfAnd(value: boolean) {
    const prevValue = this._ifAnd;
    this._ifAnd = value;

    if (prevValue === null) { return; }

    const mediaValue = `(min-width: ${this._breakpoint}px)`;
    if (this._breakpointObs.isMatched(mediaValue) && this._ifAnd) {
      if (!this._thenView) {
        this._elseView = null;
        this._viewContainer.clear();
        this._thenView = this._viewContainer.createEmbeddedView(this._thenTemplate);
      }
    } else  {
      this._thenView = null;
      this._viewContainer.clear();

      if (this._elseTemplate) {
        this._elseView = this._viewContainer.createEmbeddedView(this._elseTemplate);
      }
    }
  }

  constructor(private _thenTemplate: TemplateRef<unknown>,
              private _viewContainer: ViewContainerRef,
              private _breakpointObs: BreakpointObserver,
              private _cd: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private _platformId: object) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (isPlatformServer(this._platformId) && !this._thenView) {
      if (this._elseView) {
        this._viewContainer.clear();
        this._elseView = null;
      }
      this._thenView = this._viewContainer.createEmbeddedView(this._thenTemplate);
      return;
    }

    if (changes['mediaIf'] || changes['mediaIfLessThen']) {
      this._subscription?.unsubscribe()
      let pointsToObserve: string | string[]
      if (this._lessThen != null) {
        pointsToObserve = [ `(min-width: ${this._breakpoint}px)`, `(max-width: ${this._lessThen}px)` ]
      } else {
        pointsToObserve = `(min-width: ${this._breakpoint}px)`;
      }
      this._subscription = this._breakpointObs.observe(pointsToObserve).subscribe((brkpointState) => {

        this._thenView = null;
        this._elseView = null;
        this._viewContainer.clear();
        if (brkpointState.matches && (this._ifAnd === null || this._ifAnd === true)) {
          this._thenView = this._viewContainer.createEmbeddedView(this._thenTemplate);
        } else if (this._elseTemplate) {
          this._elseView = this._viewContainer.createEmbeddedView(this._elseTemplate);
        }

        this._cd.markForCheck();
      });
    }
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._platformId)) { return; }
    this._subscription!.unsubscribe();
  }
}
