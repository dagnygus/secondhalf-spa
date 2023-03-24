import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { StateStatus } from 'src/app/state/utils';

@Component({
  selector: 'app-single-member-images[urls][imageStateStatus]',
  templateUrl: './single-member-images.component.html',
  styleUrls: ['./single-member-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMemberImagesComponent {

  readonly StateStatus = StateStatus;
  readonly selectedIndexChange = new Subject<number>();

  private _selectedIndex = 0;
  public get selectedIndex(): number {
    return this._selectedIndex;
  }
  public set selectedIndex(value: number) {
    if (this._selectedIndex === value) { return; }
    this._selectedIndex = value;
    this.selectedIndexChange.next(value);
  }

  get nextButtonDisabled(): boolean { return this.urls === null || this._selectedIndex === this.urls.length - 1 }
  get prevButtonDisabled(): boolean { return this._selectedIndex === 0 }

  @Input() urls: readonly string[] | null = null;
  @Input() imageStateStatus!: StateStatus;

  constructor() {}


  onNextBtnClick(): void {
    if (!this.urls || this._selectedIndex === this.urls.length - 1) { return; }
    this.selectedIndex++;
    this.selectedIndexChange.next(this._selectedIndex);

  }

  onPrevBtnClick(): void {
    if (!this.urls || this._selectedIndex === 0) { return; }
    this.selectedIndex--;
    this.selectedIndexChange.next(this._selectedIndex);
  }
}
