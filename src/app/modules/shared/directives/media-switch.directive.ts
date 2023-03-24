import { coerceNumberInput } from './../../../utils/coerction-and-types';
import { Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef, TemplateRef, Inject, PLATFORM_ID } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Directive, Host, OnDestroy } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';


class MediaCaseView {
  private _created = false;

  constructor(private _vcRef: ViewContainerRef,
              private _template: TemplateRef<unknown>,
              public minWidth: number) {}


  _enforceState(value: number): void {
    if (this.minWidth === value) {
      this._create();
    } else  {
      this._destroy();
    }
  }

  _create(): void {
    if (this._created) { return; }
    this._vcRef.createEmbeddedView(this._template).markForCheck();
    this._created = true;
  }

  _destroy(): void {
    if (!this._created) { return; }
    this._vcRef.clear();
    this._created = false;
  }
}

@Directive({ selector: '[mediaSwitch]' })
export class MediaSwitch implements OnDestroy {

  private _changeCount = 0;
  private _defaults: MediaSwitchDefault[] = []
  private _caseViews: MediaCaseView[] = [];
  private _caseCount = 0
  private _subscription?: Subscription;

  constructor(private _breakpointObserver: BreakpointObserver) {}

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  _updateCaseCount(): void {
    this._caseCount++;
  }

  _updateChangeCount(): void {
    this._changeCount++;
  }

  _update(): void {
    if (this._caseCount === 0) { return; }
    this._changeCount--;
    if (this._changeCount === 0) {
      this._setupListiner()
    }
  }

  _addCase(caseView: MediaCaseView): void {
    if (this._caseViews.includes(caseView)) { return }

    this._caseViews.push(caseView);
    if (this._caseViews.length === this._caseCount) {
      this._setupListiner();
    }
  }

  _removeCase(caseView: MediaCaseView): void {
    const index = this._caseViews.indexOf(caseView);
    if (index > -1) {
      this._caseViews.splice(index, 1);
    }
  }

  _addDefault(defaultView: MediaSwitchDefault) {
    if (this._defaults.includes(defaultView)) { return; }
    this._defaults.push(defaultView);
  }

  _removeDefault(defaultView: MediaSwitchDefault) {
    const index = this._defaults.indexOf(defaultView)
    if (index > -1) {
      this._defaults.splice(index, 1);
    }
  }

  _setupListiner(): void {
    const breakpoints: number[] = [];
      this._caseViews.forEach((view) => {
        if (!breakpoints.includes(view.minWidth)) {
          breakpoints.push(view.minWidth);
        }
      })
    const mapedBreakpoints = breakpoints.map((value) => `(min-width: ${value}px)`);
    this._subscription?.unsubscribe();
    this._subscription = this._breakpointObserver.observe(mapedBreakpoints).subscribe((state) => {
      let minimalValue: number | undefined;
      mapedBreakpoints.forEach((breakpoint, index) => {
        if (state.breakpoints[breakpoint]) {
          minimalValue = typeof minimalValue === 'undefined' ? breakpoints[index] : Math.min(minimalValue, breakpoints[index]);
        }
      });
      if (typeof minimalValue === 'number') {
        for (const defaultView of this._defaults) {
          defaultView._destroy();
        }
        for (const caseView of this._caseViews) {
          caseView._enforceState(minimalValue);
        }
      } else {
        for (const caseView of this._caseViews) {
          caseView._destroy();
        }
        for (const defaultView of this._defaults) {
          defaultView._create();
        }
      }
    })
  }
}

@Directive({ selector: '[mediaSwitchCase]' })
export class MediaSwitchCase implements OnInit, OnChanges, OnDestroy {
  private _caseView: MediaCaseView | null = null;


  private _mediaSwitchCase: number | null = null;

  @Input()
  public set mediaSwitchCase(value: number | `${number}`) {
    this._mediaSwitchCase = Math.max(0, coerceNumberInput(value));
    if (this._caseView) {
      this._caseView.minWidth = this._mediaSwitchCase;
      this._mediaSwitch._updateChangeCount();
    }
  }

  constructor(@Host() private _mediaSwitch: MediaSwitch,
              private _vcRef: ViewContainerRef,
              private _templRef: TemplateRef<unknown>,
              @Inject(PLATFORM_ID) private _platformId: object) {
    _mediaSwitch._updateCaseCount();
  }

  ngOnChanges(_: SimpleChanges): void {
    if (this._caseView) {
      this._mediaSwitch._update();
    }
  }

  ngOnInit(): void {
  if (isPlatformServer(this._platformId) && !this._caseView) {
    this._vcRef.createEmbeddedView(this._templRef);
    return;
  }

    if (this._mediaSwitchCase == null) {
      throw new Error('[mediaSwitchCase] input not provided');
    }
    this._caseView = new MediaCaseView(this._vcRef, this._templRef, this._mediaSwitchCase);
    this._mediaSwitch._addCase(this._caseView);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._platformId)) { return; }
    this._mediaSwitch._removeCase(this._caseView!);
  }
}

@Directive({ selector: '[mediaSwitchDefault]' })
export class MediaSwitchDefault implements OnDestroy {
  private _created = false;

  constructor(private _vcRef: ViewContainerRef, private _template: TemplateRef<any>,
              @Host() private _mediaSwitch: MediaSwitch,
              @Inject(PLATFORM_ID) private _patformId: object) {
    if (isPlatformServer(this._patformId)) {
      this._vcRef.createEmbeddedView(this._template);
      return;
    }
    _mediaSwitch._addDefault(this);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._patformId)) { return; }
    this._mediaSwitch._removeDefault(this);
  }

  _create(): void {
    if (!this._created) {
      this._vcRef.createEmbeddedView(this._template).markForCheck();
    }
    this._created = true;
  }

  _destroy(): void {
    if (this._created) { this._vcRef.clear(); }
    this._created = false;
  }
}
