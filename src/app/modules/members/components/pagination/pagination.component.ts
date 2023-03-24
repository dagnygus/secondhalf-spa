/* eslint-disable max-len */
import { ChangeDetectorRef, EmbeddedViewRef } from '@angular/core';
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AfterViewInit, ViewChild, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Component, Input, OnChanges} from '@angular/core';

const _inputNames = [
  'currentPage',
  'range',
  'totalPages',
  'edgeRange'
];

@Component({
  selector: 'app-pagination[currentPage][range][totalPages]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges, AfterViewInit {

  private _elipsisViewIndex1 = -1;
  private _elipsisViewIndex2 = -1;
  private _isInit = false;

  @Input() currentPage!: number;
  @Input() range!: number;
  @Input() totalPages!: number;
  @Input() edgeRange = 1;

  @Output() pageSelected = new EventEmitter<number>();

  @ViewChild('btnTemplate') btnTemplate!: TemplateRef<any>;
  @ViewChild('elipsisTemplate') elipsisTemplate!: TemplateRef<any>;
  @ViewChild('btnTemplate', { read: ViewContainerRef }) contentViewContainter!: ViewContainerRef;

  constructor(private _cd: ChangeDetectorRef) {}

  ngOnChanges(_: SimpleChanges): void {
    if (!this._isInit) { return; }

    _throwErrorIfInputsAreInvalid(this);

    if (this.totalPages === 0 && this.contentViewContainter.length > 0) {
      this.contentViewContainter.clear();
      return;
    }
    const leftOverlap = this.edgeRange + 1 >= this.currentPage - this.range;
    const rightOverlap = this.totalPages - this.edgeRange <= this.currentPage + this.range;
    let elipsis1: ViewRef | null | undefined;
    let elipsis2: ViewRef | null | undefined;
    let sideCount = 0;
    let totalBtnCount = 0;

    if (leftOverlap && rightOverlap) {
      totalBtnCount = this.totalPages;

      if (this._elipsisViewIndex1 > -1) {
        this.contentViewContainter.remove(this._elipsisViewIndex1);
      }

      if (this._elipsisViewIndex2 > -1) {
        this.contentViewContainter.remove(this._elipsisViewIndex2 - 1);
      }

    } else if (leftOverlap) {
      sideCount = Math.max(this.edgeRange, this.currentPage + this.range);
      totalBtnCount = sideCount + this.edgeRange;

      if (this._elipsisViewIndex1 > -1) {
        elipsis1 = this.contentViewContainter.detach(this._elipsisViewIndex1);
      }

      if (this._elipsisViewIndex2 > -1) {
        if (elipsis1) {
          this.contentViewContainter.remove(this._elipsisViewIndex2 - 1);
        } else {
          elipsis1 = this.contentViewContainter.detach(this._elipsisViewIndex2);
        }
      }

    } else if (rightOverlap) {
      sideCount = Math.max(this.edgeRange, this.totalPages - this.currentPage + this.range + 1);
      totalBtnCount = sideCount + this.edgeRange;

      if (this._elipsisViewIndex1 > -1) {
        elipsis1 = this.contentViewContainter.detach(this._elipsisViewIndex1);
        this._elipsisViewIndex1 = -1;
      }

      if (this._elipsisViewIndex2 > -1) {
        if (elipsis1) {
          this.contentViewContainter.remove(this._elipsisViewIndex2 - 1);
        } else {
          elipsis1 = this.contentViewContainter.detach(this._elipsisViewIndex2);
        }
      }

    } else {
      totalBtnCount = 2 * this.range + 2 * this.edgeRange + 1;

      if (this._elipsisViewIndex1 > -1) {
        elipsis1 = this.contentViewContainter.detach(this._elipsisViewIndex1);
      }

      if (this._elipsisViewIndex2 > -1) {
        elipsis2 = this.contentViewContainter.detach(this._elipsisViewIndex2 - 1);
      }
    }

    this._elipsisViewIndex1 = -1;
    this._elipsisViewIndex2 = -1;

    const containerLength = this.contentViewContainter.length;

    if (containerLength > totalBtnCount) {
      for (let i = containerLength - 1; i >= totalBtnCount; i--) {
        this.contentViewContainter.remove(i);
      }
    } else {
      for (let i = containerLength; i < totalBtnCount; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: -1 });
      }
    }

    if (leftOverlap && rightOverlap) {
      for (let i = 0; i < this.totalPages; i++) {
        (this.contentViewContainter.get(i) as EmbeddedViewRef<any>).context.$implicit = i + 1;
      }
    } else if (leftOverlap) {
      for (let i = 0; i < sideCount; i++) {
        (this.contentViewContainter.get(i) as EmbeddedViewRef<any>).context.$implicit = i + 1;
      }

      for (let i = sideCount; i < totalBtnCount; i++) {
        (this.contentViewContainter.get(i) as EmbeddedViewRef<any>).context.$implicit = this.totalPages - this.edgeRange + i - sideCount + 1;
      }

      this._elipsisViewIndex1 = totalBtnCount - this.edgeRange;
      if (elipsis1) {
        this.contentViewContainter.insert(elipsis1, this._elipsisViewIndex1);
      } else {
        this.contentViewContainter.createEmbeddedView(this.elipsisTemplate, undefined, this._elipsisViewIndex1);
      }
    } else if (rightOverlap) {
      for (let i = 0; i < this.edgeRange; i++) {
        (this.contentViewContainter.get(i) as EmbeddedViewRef<any>).context.$implicit = i + 1;
      }

      for (let i = this.edgeRange; i < totalBtnCount; i++) {
        (this.contentViewContainter.get(i) as EmbeddedViewRef<any>).context.$implicit = this.totalPages - sideCount + 1 + i - this.edgeRange;
      }

      this._elipsisViewIndex1 = this.edgeRange;
      if (elipsis1) {
        this.contentViewContainter.insert(elipsis1, this._elipsisViewIndex1);
      } else {
        this.contentViewContainter.createEmbeddedView(this.elipsisTemplate, undefined,this._elipsisViewIndex1);
      }
    } else {
      for (let i = 0; i < this.edgeRange; i++) {
        (this.contentViewContainter.get(i) as EmbeddedViewRef<any>).context.$implicit = i + 1;
      }

      for (let i = this.edgeRange; i < totalBtnCount - this.edgeRange; i++) {
        (this.contentViewContainter.get(i) as EmbeddedViewRef<any>).context.$implicit = this.currentPage - this.range + i - this.edgeRange;
      }

      for (let i = totalBtnCount - this.edgeRange; i < totalBtnCount; i++) {
        (this.contentViewContainter.get(i) as EmbeddedViewRef<any>).context.$implicit = this.totalPages + 1 + i - totalBtnCount;
      }

      this._elipsisViewIndex1 = this.edgeRange;
      if (elipsis1) {
         this.contentViewContainter.insert(elipsis1, this._elipsisViewIndex1);
      } else {
        this.contentViewContainter.createEmbeddedView(this.elipsisTemplate, undefined, this._elipsisViewIndex1);
      }

      this._elipsisViewIndex2 = totalBtnCount + 1 - this.edgeRange;
      if (elipsis2) {
        this.contentViewContainter.insert(elipsis2, this._elipsisViewIndex2);
      } else {
        this.contentViewContainter.createEmbeddedView(this.elipsisTemplate, undefined, this._elipsisViewIndex2);
      }
    }

  }

  ngAfterViewInit(): void {

    _throwErrorIfInputsAreInvalid(this);
    this._isInit = true;
    const leftOverlap = this.edgeRange + 1 >= this.currentPage - this.range;
    const rightOverlap = this.totalPages - this.edgeRange <= this.currentPage + this.range;

    if (this.totalPages === 0) { return; }

    if (leftOverlap && rightOverlap) {

      for (let i = 1; i <= this.totalPages; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: i });
      }

    } else if (leftOverlap) {

      for (let i = 1; i <= this.currentPage + this.range; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: i });
      }

      this.contentViewContainter.createEmbeddedView(this.elipsisTemplate);
      this._elipsisViewIndex1 = this.contentViewContainter.length - 1;

      for (let i = this.totalPages - this.edgeRange + 1; i <= this.totalPages; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: i });
      }

    } else if (rightOverlap) {

      for (let i = 1; i <= this.edgeRange; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: i });
      }

      this.contentViewContainter.createEmbeddedView(this.elipsisTemplate);
      this._elipsisViewIndex1 = this.contentViewContainter.length - 1;

      for (let i = this.currentPage - this.range; i <= this.totalPages; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: i });
      }

    } else {

      for (let i = 1; i <= this.edgeRange; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: i });
      }

      this.contentViewContainter.createEmbeddedView(this.elipsisTemplate);
      this._elipsisViewIndex1 = this.contentViewContainter.length - 1;
      console.log(this._elipsisViewIndex1);

      for (let i = this.currentPage - this.range; i <= this.currentPage + this.range; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: i });

      }

      this.contentViewContainter.createEmbeddedView(this.elipsisTemplate);
      this._elipsisViewIndex2 = this.contentViewContainter.length - 1;
      console.log(this._elipsisViewIndex2);

      for (let i = this.totalPages - this.edgeRange + 1; i <= this.totalPages; i++) {
        this.contentViewContainter.createEmbeddedView(this.btnTemplate, { $implicit: i });
      }
    }

    this._cd.detectChanges();
  }

}

function _throwErrorIfInputsAreInvalid(component: any): void | never {
  _inputNames.forEach((key) => {
    if (typeof component[key] === 'number' && (!Number.isInteger(component[key]) || component[key] < 0)) {
      throw new Error('[PaginationComponent] Component input must be a integer greather then -1');
    }

    if (key === 'edgeRange' && component[key] < 1) {
      throw new Error('[PaginationComponent] Component input [edgeRange] must be a integer greather then 0');
    }
  });
}
