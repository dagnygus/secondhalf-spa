import { AppState } from 'src/app/app.ngrx.utils';
import { WindowScroller } from './../../../../services/window-scroller';
import { fadeInAnimation, fadeOutAnimation, zoomInAnimation, zoomOutAnimation } from '../../../../utils/ng-animations';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, NgZone, OnDestroy } from '@angular/core';
import { transition, trigger } from '@angular/animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { Subscription, take } from 'rxjs';
import { Location } from '@angular/common';
import { RouterStateRef } from 'src/app/state/router/router-store-serializer';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

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
export class PrivacyComponent extends PageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('privacy') privacyElRef!: ElementRef<HTMLElement>;

  showButton = false;
  private _subscription = new Subscription;

  constructor(private _cdRef: ChangeDetectorRef,
              private _scroller: WindowScroller) {
    super();
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') { return; }
    const el = this.privacyElRef.nativeElement;

    if (el.getBoundingClientRect().top + window.innerHeight < 0) {
      this.showButton = true;
      this._cdRef.detectChanges();
    }

    const toggleButtonVisibility = () => {
      if (el.getBoundingClientRect().top + window.innerHeight < 0 && !this.showButton) {
        this._scroller.ngZone.run(() => {
          this.showButton = true;
          this._cdRef.markForCheck();
        })
      } else if (el.getBoundingClientRect().top + window.innerHeight > 0 && this.showButton) {
        this._scroller.ngZone.run(() => {
          this.showButton = false;
          this._cdRef.markForCheck();
        })
      }
    }

    this._scroller.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', toggleButtonVisibility);
    });

    this._subscription.add(() => {
      window.removeEventListener('scroll', toggleButtonVisibility);
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onButtonClick(): void {
    this._scroller.scroll('.privacy__list', { addOffset: -130 });
  }

}
