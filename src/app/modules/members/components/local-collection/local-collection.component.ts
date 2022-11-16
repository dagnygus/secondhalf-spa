/* eslint-disable @typescript-eslint/member-ordering */
import { LocalForDirective, LocalForOfContext } from '../../directives/local-for.directive';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, OnDestroy,ChangeDetectorRef, ViewChild, ViewContainerRef, AfterViewInit, ContentChild, IterableChanges, IterableChangeRecord, EmbeddedViewRef, Input, DoCheck, NgZone, AfterViewChecked } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, skip } from 'rxjs/operators';

class LocalForOfContextImpl<T, U extends ReadonlyArray<T> = ReadonlyArray<T>> implements LocalForOfContext<T, U> {

  _indexRead = false;

  constructor(public $implicit: T,
              public _index: number) {}

  get index(): number {
    this._indexRead = true;
    return this._index;
  }

}

@Component({
  selector: 'app-local-collection',
  templateUrl: './local-collection.component.html',
  styleUrls: ['./local-collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line max-len
export class LocalCollectionComponent<T, U extends ReadonlyArray<T> = ReadonlyArray<T>> implements DoCheck, AfterViewChecked, AfterViewInit {

  private _dirty = false;
  private _init = false;

  @Input()
  public set deps(value: { [key: string]: number | boolean | string } | undefined) {
    this._dirty = true;
  }

  @ViewChild('localCollectionContainer', { read: ViewContainerRef }) _localCollectionContainerRef!: ViewContainerRef;
  @ContentChild(LocalForDirective) private _localForDirective?: LocalForDirective<T, U>;


  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {}

  ngDoCheck(): void {
    if (!this._dirty || !this._init) { return; }
    this._changeDetectorRef.reattach();
  }

  ngAfterViewChecked(): void {
    this._changeDetectorRef.detach();
  }

  ngAfterViewInit(): void {
    if (this._localForDirective == null) { return; }

    this._localForDirective.applyChangesCallback = this._applyChanges.bind(this);
    this._localForDirective.checkArray();
    this._init = true;
  }

  private _applyChanges(changes: IterableChanges<T>): void {
    const viewContainer = this._localCollectionContainerRef;
    const template = this._localForDirective!._template;

    changes.forEachOperation(
        (item: IterableChangeRecord<T>, adjustedPreviousIndex: number|null,
         currentIndex: number|null) => {
          if (item.previousIndex == null) {
            // localForOf is never "null" or "undefined" here because the differ detected
            // that a new item needs to be inserted from the iterable. This implies that
            // there is an iterable value for "_localForOf".

            const context = new LocalForOfContextImpl<T, U>(
              item.item,
              -1
            );

            viewContainer.createEmbeddedView(
              template,
              context,
              currentIndex === null ? undefined : currentIndex
            );

          } else if (currentIndex == null) {

            viewContainer.remove(
                adjustedPreviousIndex === null ? undefined : adjustedPreviousIndex);

          } else if (adjustedPreviousIndex !== null) {

            const view = viewContainer.get(adjustedPreviousIndex)!;
            viewContainer.move(view, currentIndex);

            _applyViewChange(view as EmbeddedViewRef<LocalForOfContext<T, U>>, item);
          }
        });

      for (let i = 0, ilen = viewContainer.length; i < ilen; i++) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const viewRef = <EmbeddedViewRef<LocalForOfContextImpl<T, U>>> viewContainer.get(i);
        const context = viewRef.context;
        if (context._index === -1 || (context._index !== i && context._indexRead)) {
          context._index = i;
          viewRef.detectChanges();
        }
    }

    changes.forEachIdentityChange((record: IterableChangeRecord<T>) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const viewRef = <EmbeddedViewRef<LocalForOfContext<T, U>>> viewContainer.get(record.currentIndex!);
      _applyViewChange(viewRef, record);
      viewRef.detectChanges();
    });
  }

}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function _applyViewChange<T>(view: EmbeddedViewRef<LocalForOfContext<T>>, record: IterableChangeRecord<T>): void {
  view.context.$implicit = record.item;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function _isDepsChandes(prev: any, next: any) {
  if ((next && !prev) || (!next && prev)) {
    return true;
  }

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) { return true; }

  for (const key of nextKeys) {
    if (prev[key] !== next[key]) { return true; }
  }

  return false;
}
