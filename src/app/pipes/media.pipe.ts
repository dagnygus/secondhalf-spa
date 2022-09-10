import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'media',
  pure: false,
})
export class MediaPipe<T> implements PipeTransform, OnDestroy {

  private _latestValue: T = null!;
  private _defaultValue: T = null!;
  private _bpMap: { [key: number]: T } | null = null;
  private _bpStrMap: { [key: number]: string } = {};
  private _bpArr: number[] = [];
  private _subscription!: Subscription;
  private _breakpointReached = false;

  constructor(private _bpObserver: BreakpointObserver,
              private _cd: ChangeDetectorRef) {}

  transform(defaultValue: T, queryRecord: { [key: number | `${number}`]: T }): unknown {


    this._defaultValue = defaultValue;

    if (!this._bpMap) {
      this._initialBreakpoints(queryRecord);
      this._setupListener();
    }
    return this._breakpointReached ? this._latestValue : this._defaultValue;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private _initialBreakpoints(queryRecord: { [key: number | `${number}`]: T }): void {
    this._bpMap = {};

    Object.keys(queryRecord).forEach((key) => {
      key = typeof key === 'number' ? key : +key as any;
      this._bpMap![key as any] = queryRecord[key as any];
      this._bpStrMap[key as any] = `(min-width: ${key}px)`;
      this._bpArr.push(typeof key === 'number' ? key : +key);
    });

    this._bpArr.sort();
  }

  private _setupListener(): void {
    const mediaQueryArr = Object.values(this._bpStrMap);
    this._subscription = this._bpObserver.observe(mediaQueryArr).subscribe((state) => {
      let currBreakpoint = 0;

      this._bpArr.forEach((value) => {
        if (state.breakpoints[this._bpStrMap[value]]) {
          currBreakpoint = value;
        }
      });

      this._breakpointReached = currBreakpoint !== 0;
      this._latestValue = this._breakpointReached ? this._bpMap![currBreakpoint] : null!;
      this._cd.markForCheck();
    });
  }

}
