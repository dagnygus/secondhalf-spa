import { ChangeDetectorRef, EventEmitter, NgZone } from '@angular/core';
import { Subject } from 'rxjs';


export class UnstableSubject<T> extends Subject<T> {

  constructor(private readonly _ngZone: NgZone) { super(); }

  override next(value?: T): void {
    if (this.observers.length === 0) { return; }

    if (NgZone.isInAngularZone()) {
      super.next(value);
    } else {
      this._ngZone.run(() => super.next(value));
    }
  }

  override complete(): void {
    if (this.observers.length === 0) { return; }

    if (NgZone.isInAngularZone()) {
      super.complete();
    } else {
      this._ngZone.run(() => super.complete());
    }
  }

  override error(err: any): void {
    if (this.observers.length === 0) { return; }

    if (NgZone.isInAngularZone()) {
      super.error(err);
    } else {
      this._ngZone.run(() => super.error(err));
    }
  }
}

export class EventEmitter2<T> extends EventEmitter<T> {
  constructor(private readonly _cdRef: ChangeDetectorRef, private readonly _ngZone: NgZone) { super(); }

  override emit(value?: T): void {
    if (this.observers.length === 0) { return; }
    if (NgZone.isInAngularZone()) {
      super.emit(value);
      this._cdRef.markForCheck();
    } else {
      this._ngZone.run(() => {
        super.emit(value);
        this._cdRef.markForCheck();
      });
    }
  }
}
