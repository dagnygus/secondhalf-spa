// eslint-disable-next-line max-len
import { fadeInAnimation, fadeInDownAnimation, fadeInUpAnimation, fadeOutAnimation, fadeOutDownAnimation, fadeOutUpAnimation } from '../../../../utils/ng-animations';
import { trigger, transition, group, query } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
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


  private slider!: KeenSliderInstance;
  private intervalId?: number;
  private _subscription?: Subscription;
  private _subscription2?: Subscription;

  constructor(private readonly _ngZone: NgZone,
              @Inject(PLATFORM_ID) private readonly _platformId: object,
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

      let hidden: string | undefined;

      if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden';
      } else if (typeof (document as any).msHidden !== 'undefined') {
        hidden = 'msHidden';
      } else if (typeof (document as any).webkidHidden !== 'undefined') {
        hidden = 'webkidHidden';
      }

      function visible(): boolean {
        return hidden == null ? false : (document as any)[hidden];
      }

      this._ngZone.runOutsideAngular(() => {
        this.slider = new KeenSlider(this.keenSliderRef.nativeElement, {
          breakpoints: {
            '(min-width: 570px)': {
              slides: { perView: 2 }
            },
            '(min-width: 1024px)': {
              slides: { perView: 3 }
            },
            '(min-width: 1200px)': {
              slides: { perView: 4 }
            },
          },
          slides: {
            perView: 1
          },
          loop: true
        }, [
            (slider) => {
              let timeout: any;
              let mouseOver = false;
              function clearNextTimeout(): void {
                clearTimeout(timeout);
              }
              function nextTimeout(): void {
                clearTimeout(timeout);
                if (mouseOver && visible()) return
                timeout = setTimeout(() => {
                  slider.next();
                }, 4000);
              }

              slider.on("created", () => {
                slider.container.addEventListener("mouseover", () => {
                  mouseOver = true;
                  clearNextTimeout();
                });
                slider.container.addEventListener("mouseout", () => {
                  mouseOver = false;
                  nextTimeout();
                });
                nextTimeout();
              })
              slider.on("dragStarted", clearNextTimeout);
              slider.on("animationEnded", nextTimeout);
              slider.on("updated", nextTimeout);
            }
        ])
      });
    }
  }

  ngOnDestroy(): void {

    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() => {
        this.slider.destroy();
      }, 501);
    }

    this._subscription?.unsubscribe();
    this._subscription2?.unsubscribe();
  }


}
