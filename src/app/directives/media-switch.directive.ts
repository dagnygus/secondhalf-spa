/* eslint-disable @typescript-eslint/member-ordering */
import { Subscription } from 'rxjs';
import { MediaSwitchCaseDirective } from './media-switch-case.directive';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterContentInit, Directive, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MediaSwitchDefaultDirective } from './media-switch-default.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mediaSwitch]'
})
export class MediaSwitchDirective implements AfterContentInit, OnDestroy {

  private _switchCases = new Map<number, MediaSwitchCaseDirective>();
  private _defaultCase?: MediaSwitchDefaultDirective;
  private _brkPointsStr = new Map<number, string>();
  private _brkPoints: number[] = [];
  private _subscription!: Subscription;
  private _lastBreakpoint = 0;
  private _contentInit = false;

  @Output() breakpointEnter = new EventEmitter<number>();
  @Output() breakpointLeave = new EventEmitter<number>();

  constructor(private _breakpointObserver: BreakpointObserver) { }

  ngAfterContentInit(): void {

    const brkPointsStrsArr: string[] = [];

    this._brkPoints.sort().forEach((value) => {
      const valueStr = `(min-width: ${value}px)`;
      this._brkPointsStr.set(value, valueStr);
      brkPointsStrsArr.push(valueStr);
    });

    if (brkPointsStrsArr.length === 0) {
      this._defaultCase?.createView();
      return;
    }

    this._subscription = this._breakpointObserver.observe(brkPointsStrsArr).subscribe((breakpointState) => {
      let machedBrkPoint: number | undefined;

      this._brkPoints.forEach((value) => {
        if (breakpointState.breakpoints[this._brkPointsStr.get(value)!]) {
          machedBrkPoint = value;
        }
      });

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < this._brkPoints.length; i++) {
        this._switchCases.get(this._brkPoints[i])!.clearView();
      }

      if (this._defaultCase) { this._defaultCase.clearView(); }
      if (machedBrkPoint != null) {

        if (machedBrkPoint >= this._lastBreakpoint) {
          this.breakpointEnter.emit(machedBrkPoint);
        } else {
          this.breakpointLeave.emit(this._lastBreakpoint);
        }

        this._lastBreakpoint = machedBrkPoint;

        this._switchCases.get(machedBrkPoint)!.createView();
      } else if (this._defaultCase) {

        if (this._lastBreakpoint > 0) {
          this.breakpointLeave.emit(this._lastBreakpoint);
          this._lastBreakpoint = 0;
        }

        this._defaultCase.createView();
      }
    });

    this._contentInit = true;
  }

  isContentInit(): boolean { return this._contentInit; }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  addCase(mediaCase: MediaSwitchCaseDirective): void {
    if (this._contentInit) { return; }

    const brkPnt = mediaCase.getBreakpoint();

    if (!this._switchCases.has(brkPnt)) {
      this._brkPoints.push(brkPnt);
    }

    this._switchCases.set(brkPnt, mediaCase);
  }

  setDefault(mediaDefautl: MediaSwitchDefaultDirective): void {
    if (this._contentInit) { return; }
    this._defaultCase = mediaDefautl;
  }

}
