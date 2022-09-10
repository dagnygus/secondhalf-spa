/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line max-len
import { Directive, Input, IterableChanges, IterableDiffer, IterableDiffers, TemplateRef, TrackByFunction, OnChanges, SimpleChanges } from '@angular/core';
declare const ngDevMode: any;


export interface LocalForOfContext<T, U extends ReadonlyArray<T> = ReadonlyArray<T>> {
  $implicit: T;
  get index(): number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export class LocalForOfContextImpl<T, U extends ReadonlyArray<T> = ReadonlyArray<T>> implements LocalForOfContext<T, U> {

  _indexRead = false;

  constructor(public $implicit: T,
              public _index: number) {}

  get index(): number {
    this._indexRead = true;
    return this._index;
  }

}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[localFor]'
})
export class LocalForDirective<T, U extends ReadonlyArray<T> = ReadonlyArray<T>> implements OnChanges {

  private _localForOf: U|undefined|null = null;
  private _differ: IterableDiffer<T>|null = null;
  private _trackByFn!: TrackByFunction<T>;

  public applyChangesCallback?: (changes: IterableChanges<T>) => void;

  @Input()
  set localForOf(localForOf: U&ReadonlyArray<T>|undefined|null) {
    this._localForOf = localForOf;
  }

  @Input()
  set localForTrackBy(fn: TrackByFunction<T>) {
    this._trackByFn = fn;
  }

  get localForTrackBy(): TrackByFunction<T> {
    return this._trackByFn;
  }

  constructor(public readonly _template: TemplateRef<LocalForOfContext<T, U>>,
              private readonly _differs: IterableDiffers) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.localForOf.isFirstChange()) { return; }
    this.checkArray();
  }

  checkArray(): void {

    const value = this._localForOf;
    if (!this._differ && value) {
      this._differ = this._differs.find(value).create(this.localForTrackBy);
    }
    if (this._differ) {
      const changes = this._differ.diff(this._localForOf);
      if (changes && this.applyChangesCallback) { this.applyChangesCallback(changes); }
    }

  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static ngTemplateContextGuard<T, U extends readonly T[] = readonly[]>(dir: LocalForDirective<T, U>, ctx: any):
      ctx is LocalForOfContext<T, U> {
    return true;
  }
}
