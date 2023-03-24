import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, ElementRef, NgZone, Inject, PLATFORM_ID, Input, ChangeDetectorRef, OnChanges, AfterViewChecked, SimpleChanges } from '@angular/core';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { SingleMemberImagesComponent } from '../single-member-images.component';

@Component({
  selector: 'app-images-banner[urls]',
  templateUrl: './images-banner.component.html',
  styleUrls: ['./images-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'keen-slider'
  }
})
export class ImagesBannerComponent implements OnChanges, AfterViewChecked, OnDestroy {

  private _keenSlider: KeenSliderInstance = null!;
  private _selectedIndex = 0;

  @Input() urls!: readonly string[]

  constructor(hostElementRef: ElementRef<HTMLElement>,
              ngZone: NgZone,
              parenntComponentModel: SingleMemberImagesComponent,
              private _cdRef: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private _platformId: object) {
    parenntComponentModel.selectedIndexChange.subscribe((index) => this._updateSelection(index))
    if (!isPlatformBrowser(this._platformId)) { return; }
    ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._keenSlider = new KeenSlider(hostElementRef.nativeElement);
        this._keenSlider.on('animationStarted', (main) => {
          this._selectedIndex = main.track.absToRel(main.animator.targetIdx || 0);
          parenntComponentModel.selectedIndex = this._selectedIndex;
        })
      })
    });
  }

  ngOnChanges(_: SimpleChanges): void {
    this._cdRef.reattach()
  }

  ngAfterViewChecked(): void {
    this._cdRef.detach()
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this._platformId)) { return; }
    setTimeout(() => {
      this._keenSlider.destroy();
    }, 1001);
  }

  private _updateSelection(index: number): void {
    if (this._selectedIndex === index) { return; }
    this._keenSlider.moveToIdx(index);
  }

}
