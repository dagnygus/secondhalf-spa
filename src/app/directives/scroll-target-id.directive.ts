/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, Input, ElementRef, OnDestroy } from '@angular/core';
import { ScrollManager } from '../services/scroll-manager';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[scrollTargetId]',
})
export class ScrollTargetIdDirective implements OnDestroy {

  private _id!: string;

  @Input() set scrollTargetId(value: string) {
    this._scrollManager.removeTarget(this._id);
    this._id = value;
    this._scrollManager.setTarget(value, this._hostElRef.nativeElement);
  }

  constructor(private readonly _scrollManager: ScrollManager,
              private readonly _hostElRef: ElementRef) { }

  ngOnDestroy(): void {
    this._scrollManager.removeTarget(this._id);
  }

}
