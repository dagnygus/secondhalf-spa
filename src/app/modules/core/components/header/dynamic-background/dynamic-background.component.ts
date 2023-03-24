import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { init, dispose } from './dynamic-background.three';

@Component({
  selector: 'app-dynamic-background',
  templateUrl: './dynamic-background.component.html',
  styleUrls: ['./dynamic-background.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicBackgroundComponent implements OnInit, OnDestroy {

  constructor(private _ngZone: NgZone,
              private _elementRef: ElementRef<HTMLElement>,
              @Inject(PLATFORM_ID) private _platformId: object) {
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this._platformId)) {
      this._ngZone.runOutsideAngular(() => {
        init(this._elementRef.nativeElement);
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this._platformId)) {
      dispose();
    }
  }

}
