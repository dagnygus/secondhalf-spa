import { ChangeDetectorRef } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgIfContext } from '@angular/common';
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, EmbeddedViewRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mediaIf]'
})
export class MediaIfDirective<T = unknown> implements OnInit, OnDestroy {

  private _breakpoint!: number;
  private _thenView: EmbeddedViewRef<unknown> | null = null;
  private _elseView: EmbeddedViewRef<unknown> | null = null;
  private _elseTemplate: TemplateRef<unknown> | null = null;
  private _subscription!: Subscription;
  private _ifAnd: boolean | null = null;

  @Input() set mediaIf(value: number | `${number}`) {
    this._breakpoint = typeof value === 'number' ? value : +value;
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
              private _cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const mediaValue = `(min-width: ${this._breakpoint}px)`;
    this._subscription = this._breakpointObs.observe(mediaValue).subscribe((brkpointState) => {

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

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
