import { SingleMemberImagesComponent } from '../single-member-images.component';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID, Input, OnChanges, AfterViewChecked, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DestructionBag } from 'src/app/utils/destruction-bag';
import { tap } from 'rxjs';

@Component({
  selector: 'app-images-selector[urls]',
  templateUrl: './images-selector.component.html',
  styleUrls: ['./images-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ DestructionBag ],
  host: {
    class: 'keen-slider'
  }
})
export class ImagesSelectorComponent implements OnChanges, AfterViewChecked, OnDestroy {

  private _keenSlider: KeenSliderInstance = null!;
  private _selectedIndex = 0;
  private _offset = 0;

  @Input() urls!: readonly string[]

  constructor(ngZone: NgZone,
              hostElementRef: ElementRef<HTMLElement>,
              destructionBag: DestructionBag,
              private _parentComponentModel: SingleMemberImagesComponent,
              private _cdRef: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private _platformId: object) {

    destructionBag.observe(_parentComponentModel.selectedIndexChange.pipe(tap((index) => this._updateSelection(index))));

    if (!isPlatformBrowser(this._platformId)) { return; }
    ngZone.runOutsideAngular(() => setTimeout(() => {
      this._keenSlider = new KeenSlider(hostElementRef.nativeElement, {
        slides: { perView: 4, spacing: 4 }
      });

      if (this._keenSlider.slides.length > 0) {
        this._keenSlider.slides[0].classList.add('selected');
      }

      this._keenSlider.on('animationStarted', (main) => {
        this._offset = main.track.absToRel(main.animator.targetIdx || 0);
      })
    }));
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

  onSlideClick(index: number): void {
    if (this._updateSelection(index)) {
      this._parentComponentModel.selectedIndex = index;
    }
  }

  private _updateSelection(index: number): boolean {
    if (index === this._selectedIndex) { return false; }
    this._keenSlider.slides[this._selectedIndex].classList.remove('selected');
    this._keenSlider.slides[index].classList.add('selected');
    this._selectedIndex = index;

    if (index - this._offset === 3) {
      this._keenSlider.moveToIdx(this._offset + 1);
    }

    if (index == this._offset) {
      this._keenSlider.moveToIdx(this._offset - 1);
    }

    return true;
  }

}
