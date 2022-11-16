// eslint-disable-next-line max-len
import { fadeInAnimation, fadeInDownAnimation, fadeInUpAnimation, fadeOutAnimation, fadeOutDownAnimation, fadeOutUpAnimation } from '../../../../utils/ng-animations';
import { trigger, transition, group, query } from '@angular/animations';
import { AnimationFrame } from '../../../../services/animation-frame';
import { isPlatformBrowser } from '@angular/common';
import KeenSlider from 'keen-slider';
import { ChangeDetectionStrategy,
         Component,
         AfterViewInit,
         NgZone,
         Inject,
         PLATFORM_ID,
         ViewChild,
         ElementRef,
         OnDestroy,
         ChangeDetectorRef,
         OnInit} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';

const sliderAnimationMetadata = trigger('slider', [
  transition('void => small_view_port', fadeInAnimation('300ms', '300ms')),
  transition('small_view_port => void', fadeOutAnimation('300ms', '0ms')),
  transition('void => big_view_port', [
    group([
      query('.keen-slider__slide:nth-of-type(odd)', fadeInDownAnimation('500ms', '200ms'), { optional: true }),
      query('.keen-slider__slide:nth-of-type(even)', fadeInUpAnimation('500ms', '200ms'), { optional: true })
    ])
  ]),
  transition('big_view_port => void', [
    group([
      query('.keen-slider__slide:nth-of-type(odd)', fadeOutDownAnimation('500ms', '0ms'), { optional: true }),
      query('.keen-slider__slide:nth-of-type(even)', fadeOutUpAnimation('500ms', '0ms'), { optional: true })
    ])
  ])
]);

const swipeInfoAnimationMetadata = trigger('swipeInfo', [
  transition(':enter', fadeInAnimation('300ms', '300ms')),
  transition(':leave', fadeOutAnimation('300ms', '0ms')),
]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    sliderAnimationMetadata,
    swipeInfoAnimationMetadata
  ]
})
export class HomeComponent extends PageComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('keenSlider') private keenSliderRef!: ElementRef<HTMLElement>;
  animationState = 'small_view_port';


  private slider!: KeenSlider;
  private intervalId?: number;
  private _subscription?: Subscription;
  private _subscription2?: Subscription;

  constructor(private readonly _ngZone: NgZone,
              @Inject(PLATFORM_ID) private readonly _platformId: object,
              private readonly _animationFrame: AnimationFrame,
              private readonly _breakpointObserver: BreakpointObserver,
              private readonly _cd: ChangeDetectorRef) { super(); }

  ngOnInit(): void {
    this._subscription2 = this._breakpointObserver.observe('(min-width: 570px)').subscribe((state) => {
      if (state.matches) {
        this.animationState = 'big_view_port';
      } else {
        this.animationState = 'small_view_port';
      }
      this._cd.markForCheck();
    });
  }

  ngAfterViewInit(): void {

    if (isPlatformBrowser(this._platformId)) {
      this._ngZone.runOutsideAngular(() => this.homeInit());
    }
  }

  ngOnDestroy(): void {
    if (this.slider) {
      this.slider.destroy();
      clearInterval(this.intervalId);
    }

    this._subscription?.unsubscribe();
    this._subscription2?.unsubscribe();
  }

  private homeInit(): void {

    this._subscription = this._breakpointObserver.observe([
      '(min-width: 570px)',
      '(min-width: 1024px)',
      '(min-width: 1200px)',
    ]).subscribe((breakpointState) => {
      if (breakpointState.breakpoints['(min-width: 1200px)']) {
        this._setupKeenLister(4);
        return;
      }

      if (breakpointState.breakpoints['(min-width: 1024px)']) {
        this._setupKeenLister(3);
        return;
      }

      if (breakpointState.breakpoints['(min-width: 570px)']) {
        this._setupKeenLister(2);
        return;
      }
      this._setupKeenLister(1);
    });
  }

  private _setupKeenLister(slidesPerView: number): void {

    if (this.slider) {
      this.slider.destroy();
      clearInterval(this.intervalId);
    }

    this.slider = new KeenSlider(this.keenSliderRef.nativeElement, {
      loop: true,
      dragStart: () => clearInterval(this.intervalId as any),
      dragEnd: this._spinSlider.bind(this),
      slidesPerView
    });

    this._spinSlider();
  }

  private _next(): void {
    if (this._animationFrame.tabHidden) { return; }
    this.slider.next();
  }

  private _spinSlider(): void {
    this.intervalId = setInterval(() => this._next(), 5000) as any;
  }
}
