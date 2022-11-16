/* eslint-disable @typescript-eslint/member-ordering */

// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, Output, NgZone, } from '@angular/core';
import { EventEmitter2 } from 'src/app/utils/subjects';

@Component({
  selector: 'app-single-member-photos',
  templateUrl: './single-member-photos.component.html',
  styleUrls: ['./single-member-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: forwardRef(() => SingleMemberPhotosMediator), useClass: forwardRef(() => SingleMemberPhotosMediator) }]
})
export class SingleMemberPhotosComponent {

  private _preventSelectedIndexOutput = false;

  @Input()
  get selectedIndex(): number { return this._mediator.getSelectedIndex(); }
  set selectedIndex(value: number) {
    this._preventSelectedIndexOutput = true;
    this._mediator.setSelectedIndex(value);
    this._preventSelectedIndexOutput = false;
  }

  @Input()
  get imagesUrls(): readonly string[] { return this._mediator.getUrls(); }
  set imagesUrls(value: readonly string[]) { this._mediator.setUrls(value); }

  @Input()
  get itemsPerView(): number { return this._mediator.getItemsPerView(); }
  set itemsPerView(value: number) { this._mediator.setItemsPerView(value); }

  @Input()
  get mainImageAspectRatio(): string { return this._mediator.getMainImageAspectRatio(); }
  set mainImageAspectRatio(value: string) { this._mediator.setMainImageAspectRatio(value); }

  @Input()
  get secondaryImageAspectRatio(): string { return this._mediator.getSecondaryImageAspectRatio(); }
  set secondaryImageAspectRatio(value: string) { this._mediator.setSecondaryImageAspectRatio(value); }

  @Input()
  get rowGap(): string { return this._mediator.getRowGap(); }
  set rowGap(value: string | 0) { this._mediator.setRowGap(value); }

  @Input()
  get columnGap(): string { return this._mediator.getColumnGap(); }
  set columnGap(value: string | 0) { this._mediator.setColumnGap(value); }

  @Output() selectedIndexChange = new EventEmitter2<number>(this._cdRef, this._ngZone);


  constructor(private readonly _mediator: SingleMemberPhotosMediator,
              private readonly _cdRef: ChangeDetectorRef,
              private readonly _ngZone: NgZone) {

    _mediator.addPropListener('selectedIndex', (value) => {
      if (this._preventSelectedIndexOutput) { return; }
      this.selectedIndexChange.emit(value);
    });
  }

}


export type PropName = 'selectedIndex' |
                       'imagesUrls' |
                       'itemsPerView' |
                       'mainImageAspectRatio' |
                       'secondaryImageAspectRatio' |
                       'rowGap' |
                       'columnGap';

type PropListeners = Map<string, Set<(currentValue: any, previousValue: any) => void>>;

export class SingleMemberPhotosMediator {
  private _selectedIndex = 0;
  private _imagesUrls: readonly string[] = [];
  private _itemsPerView = 4;
  private _mainImageAspectRatio = '5 / 6';
  private _secondaryImageAspectRatio = '1 / 1';
  private _rowGap = '0px';
  private _columnGap = '0px';

  private _propListentes: PropListeners = new Map();

  addPropListener<T = any>(propName: PropName, cb: (currValue: T, prevValue: T) => void): void {
    if (!this._propListentes.has(propName)) {
      this._propListentes.set(propName, new Set());
    }

    this._propListentes.get(propName)!.add(cb);
  }

  removePropListener(propName: PropName, cb: (currValue: any, prevValue: any) => void): void {
    if (!this._propListentes.has(propName)) { return; }

    const listeners = this._propListentes.get(propName)!;

    listeners.delete(cb);

    if (listeners.size === 0) {
      this._propListentes.delete(propName);
    }
  }

  setSelectedIndex(value: number): void {
    if (this._selectedIndex === value) { return; }

    const prevValue = this._selectedIndex;
    this._selectedIndex = value;
    this._risePropListeners('selectedIndex', this._selectedIndex, prevValue);
  }

  getSelectedIndex(): number { return this._selectedIndex; }

  getNextIndex(): number {
    return this._selectedIndex < this._imagesUrls.length - 1 ? this._selectedIndex + 1 : this._imagesUrls.length - 1;
  }

  getPreviousIndex(): number {
    return this._selectedIndex > 0 ? this._selectedIndex - 1 : 0;
  }

  setUrls(value: readonly string[]): void {
    if (this._imagesUrls === value) { return; }

    const prevValue = this._imagesUrls;
    this._imagesUrls = value;
    this._risePropListeners('imagesUrls', this._imagesUrls, prevValue);
  }

  getUrls(): readonly string[] {
    return this._imagesUrls;
  }

  getItemsPerView(): number { return this._itemsPerView; }

  setItemsPerView(value: number): void {
    if (this._itemsPerView === value) { return; }

    const prevValue = this._itemsPerView;
    this._itemsPerView = value < 4 ? 4 : value;

    this._risePropListeners('itemsPerView', this._itemsPerView, prevValue);
  }

  getMainImageAspectRatio(): string { return this._mainImageAspectRatio; }
  setMainImageAspectRatio(value: string): void {
    if (this._mainImageAspectRatio === value) { return; }

    const prevValue = this._mainImageAspectRatio;
    this._mainImageAspectRatio = value;
    this._risePropListeners('mainImageAspectRatio', this._mainImageAspectRatio, prevValue);
  }

  getSecondaryImageAspectRatio(): string { return this._secondaryImageAspectRatio; }
  setSecondaryImageAspectRatio(value: string): void {
    if (this._secondaryImageAspectRatio === value) { return; }

    const prevValue = this._secondaryImageAspectRatio;
    this._secondaryImageAspectRatio = value;
    this._risePropListeners('secondaryImageAspectRatio', this._secondaryImageAspectRatio, prevValue);
  }

  getColumnGap(): string { return this._columnGap; }
  setColumnGap(value: string | 0): void {
    // eslint-disable-next-line eqeqeq
    if (value == 0) {
      value = value.toString() + 'px';
    }

    if (this._columnGap === value) { return; }

    const prevValue = this._columnGap;
    this._columnGap = value;
    this._risePropListeners('columnGap', this._columnGap, prevValue);
  }

  getRowGap(): string { return this._rowGap; }
  setRowGap(value: string | 0): void {
    // eslint-disable-next-line eqeqeq
    if (value == 0) {
      value = value.toString() + 'px';
    }

    if (this._rowGap === value) { return; }

    const prevValue = this._rowGap;
    this._rowGap = value;
    this._risePropListeners('rowGap', this._rowGap, prevValue);
  }

  private _risePropListeners(propName: PropName, currValue: any, oldValue: any): void {
    if (this._propListentes.has(propName)) {
      this._propListentes.get(propName)!.forEach((cb) => cb(currValue, oldValue));
    }
  }
}
