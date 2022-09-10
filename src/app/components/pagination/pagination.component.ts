/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-pagination[currentPage][range][totalPages]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges {

  private _rangeArr!: number[];
  public get rangeArr(): number[] {
    return this._rangeArr;
  }

  @Input() currentPage!: number;
  @Input() range!: number;
  @Input() totalPages!: number;
  @Input() edgeRange = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.totalPages) {
      this._setRangeArr();
    }
  }

  private _setRangeArr(): void {
    this._rangeArr = Array(this.totalPages).fill(null).map((_, index) => index + 1);
  }

}
