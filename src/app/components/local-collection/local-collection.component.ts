import { LocalForDirective, LocalForOfContext } from './../../directives/local-for.directive';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, ViewChild, ViewContainerRef, AfterViewInit, ContentChild, IterableChanges, IterableChangeRecord, EmbeddedViewRef } from '@angular/core';

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
export class LocalCollectionComponent<T, U extends ReadonlyArray<T> = ReadonlyArray<T>> implements  AfterViewInit {

  @ViewChild('localCollectionContainer', { read: ViewContainerRef }) _localCollectionContainerRef!: ViewContainerRef;
  @ContentChild(LocalForDirective) private _localForDirective?: LocalForDirective<T, U>;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this._changeDetectorRef.detach();

    if (this._localForDirective == null) { return; }

    this._localForDirective.applyChangesCallback = this._applyChanges.bind(this);
    this._localForDirective.checkArray();
  }

  private _applyChanges(changes: IterableChanges<T>): void {
    const viewContainer = this._localCollectionContainerRef;
    const template = this._localForDirective!._template;
    let operationMade = false;

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

          operationMade = true;
        });

    if (operationMade) {
      for (let i = 0, ilen = viewContainer.length; i < ilen; i++) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const viewRef = <EmbeddedViewRef<LocalForOfContextImpl<T, U>>> viewContainer.get(i);
        const context = viewRef.context;
        if (context._index === -1 || (context._index !== i && context._indexRead)) {
          context._index = i;
          viewRef.detectChanges();
        }
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
