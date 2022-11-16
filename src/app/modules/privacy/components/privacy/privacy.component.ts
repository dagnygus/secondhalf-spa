import { fadeInAnimation, fadeOutAnimation, zoomInAnimation, zoomOutAnimation } from '../../../../utils/ng-animations';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, NgZone } from '@angular/core';
import { transition, trigger } from '@angular/animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('privacy', [
      transition(':enter', fadeInAnimation('300ms', '300ms')),
      transition(':leave', fadeOutAnimation('300ms', '300ms')),
    ]),
    trigger('floatingButton', [
      transition(':enter', zoomInAnimation('300ms', '0ms')),
      transition(':leave', zoomOutAnimation('300ms', '0ms')),
    ])
  ]
})
export class PrivacyComponent extends PageComponent implements AfterViewInit {

  @ViewChild('privacy') privacyElRef!: ElementRef<HTMLElement>;

  showButton = false;

  constructor(private _cdRef: ChangeDetectorRef,
              private _renderer: Renderer2,
              private _ngZone: NgZone) {
    super();
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') { return; }
    const el = this.privacyElRef.nativeElement;

    if (el.getBoundingClientRect().top + window.innerHeight < 0) {
      this.showButton = true;
      this._cdRef.detectChanges();
    }

    this._ngZone.runOutsideAngular(() => {
      this._renderer.listen(window, 'scroll', () => {
        if (el.getBoundingClientRect().top + window.innerHeight < 0) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
        this._cdRef.detectChanges();
      });
    });
  }

}
