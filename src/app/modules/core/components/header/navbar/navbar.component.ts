import { fadeInLeftAnimation, fadeOutLeftAnimation, fadeInUpAnimation, fadeOutDownAnimation } from '../../../../../utils/ng-animations';
import { trigger, state, style, query, transition, stagger, animate, keyframes, animateChild, group } from '@angular/animations';
import { AfterViewInit,
         ChangeDetectionStrategy,
         ChangeDetectorRef,
         Component,
         ElementRef,
         EventEmitter,
         Inject,
         Input,
         OnDestroy,
         Output,
         Renderer2,
         ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { VerticalScrollPositionObserver } from 'src/app/services/vertical-scroll-position-observer';
import { WindowScroller } from 'src/app/services/window-scroller';


const bottomLinksAnimationMetadata = trigger('bottomLinks', [

  state('false', fadeInLeftAnimation.startState),
  state('true', fadeInLeftAnimation.endState),

  transition('false => true', [
    style({ transform: 'translateX(0%)', opacity: 1 }),
    query('a', [
      style({ transform: 'translateX(-50%)', opacity: 0 }),
      stagger('100ms', fadeInLeftAnimation('200ms', '200ms'))
    ])
  ]),


  transition('true => false', [
    query('a', [
      style({ transform: 'translateX(0)', opacity: 1 }),
      fadeOutLeftAnimation('200ms', '0ms')
    ]),
  ])

]);

const menuButtomAnimationMetadata = trigger('menuButton', [

  state('false', style({ transform: 'rotateZ(0deg)' })),
  state('true', style({ transform: 'rotateZ(180deg)' })),

  transition('false <=> true', [
    animate('500ms ease-out')
  ])
]);

const authButtonAnimationMetadata = trigger('authButton', [
  state('false', style({ opacity: 0, transform: 'scaleX(0)'})),
  state('true', style({ opacity: 1, transform: 'scaleX(1)' })),

  transition('false => true', [
    animate('250ms 150ms ease-out', keyframes([
      style({ opacity: 1, transform: 'scaleX(0.5)', offset: .5 }),
      style({ opacity: 1, transform: 'scaleX(1)', offset: 1 }),
    ]))
  ]),
  transition('true => false', [
    animate('250ms 150ms ease-out', keyframes([
      style({ opacity: 0, transform: 'scaleX(0.5)', offset: .5 }),
      style({ opacity: 0, transform: 'scaleX(0)', offset: 1 }),
    ]))
  ])
]);

const containerAnimatinoMetadata = trigger('container', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' }),
    animate('450ms 1s ease-out', style({ opacity: 1, transform: 'scaleY(1)' }))
  ])
]);

const expanderAnimationMetadate = trigger('expander', [
  transition('false <=> true', [query('@*', animateChild())])
]);

const  expanderAnimationMetadata = trigger('expander', [
  state('true', style({ height: '*' })),
  state('false', style({ height: '0px' })),
  transition('false => true', [

    group([
      animate('500ms ease-out'),
      query('*', animateChild()),
    ])

  ]),
  transition('true => false', [

    group([
      query('*', animateChild()),
      animate('500ms ease-out'),
    ])

  ])
]);

const overlayAnimationMetadata = trigger('dropdawnOverlay', [
  transition(':enter', fadeInUpAnimation('150ms', '0ms')),
  transition(':leave', fadeOutDownAnimation('150ms', '0ms'))
]);


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    expanderAnimationMetadata,
    bottomLinksAnimationMetadata,
    menuButtomAnimationMetadata,
    authButtonAnimationMetadata,
    containerAnimatinoMetadata,
    expanderAnimationMetadate,
    overlayAnimationMetadata,
  ]
})
export class NavbarComponent implements AfterViewInit, OnDestroy {

  @Input() isAuth = false;
  @Input() notificationCount = 0;
  @Output() navSignIn = new EventEmitter<void>();
  @Output() navSignOut = new EventEmitter<void>();
  @ViewChild('sticker') private _sticker?: ElementRef<HTMLElement>;


  navbarOpen = false;
  overlayOpen = false;
  fixed = false;
  // isBigViewport = false;


  private _destroy$ = new Subject<void>();

  constructor(private readonly _renderer: Renderer2,
              private readonly _hostElRef: ElementRef<HTMLElement>,
              private readonly _changeDetector: ChangeDetectorRef,
              private readonly _scrollObserver: VerticalScrollPositionObserver,
              private readonly _scroller: WindowScroller,
              @Inject(DOCUMENT) private readonly _document: Document) {
  }

  ngAfterViewInit(): void {
    const navElement = this._hostElRef.nativeElement;
    const stickyElement = this._sticker!.nativeElement;
    this._scrollObserver.observe(this._document).subscribe((scrollY) => {
      if (scrollY >= navElement.offsetTop && !this.fixed) {
        this._scrollObserver.ngZone.run(() => {
          stickyElement.style.position = 'fixed';
          this.fixed = true;
          if (this.navbarOpen) {
            this._scrollObserver.ngZone.run(() => {
              this.navbarOpen = false;
              this._changeDetector.markForCheck();
            })
          }
        });
      } else if (scrollY <= navElement.offsetTop && this.fixed) {
        stickyElement.style.position = '';
        this.fixed = false;
        if (this.navbarOpen || this.overlayOpen) {
          this._scrollObserver.ngZone.run(() => {
            this.overlayOpen = this.navbarOpen = false;
            this._changeDetector.markForCheck();
          });
        }
      }

      this._scrollObserver.ngZone.runOutsideAngular(() => {
        this._renderer.listen(this._document.documentElement, 'pointerdown', (event: Event) => {
          if (this.overlayOpen && !(event.target as Element).closest('app-notifications')) {
            setTimeout(() => {
              this._scrollObserver.ngZone.run(() => {
                this.overlayOpen = false;
                this._changeDetector.markForCheck();
              });
            }, 300);
          }
          if (this.navbarOpen && (event.target as Element).closest('app-navbar')) {
            setTimeout(() => {
              this.navbarOpen = false;
              this._changeDetector.markForCheck();
            }, 100);
          }
        })
      })
    });

  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  toogle(): void {
    this.navbarOpen = !this.navbarOpen;

    if (this.navbarOpen && this._hostElRef.nativeElement.getBoundingClientRect().top > 1) {
      this._scroller.scroll(this._hostElRef, { addOffset: -1 });
    }
  }

  close(): void {
    if (!this.navbarOpen) { return; }
    this.navbarOpen = false;
  }

  logout(): void {
    this.navSignOut.emit();
  }

  toggleOverlay(): void {
    this.overlayOpen = !this.overlayOpen;
    if (this.overlayOpen && this._hostElRef.nativeElement.getBoundingClientRect().top > 1) {
      this._scroller.scroll(this._hostElRef, { addOffset: -1 });
    }
  }

  onScrollDone(): void {
    this.overlayOpen = true;
  }

  onSignInBtnClick(): void {
    this._scroller.scroll('app-header', { maxDur: 400 });
    this.navSignIn.emit();
  }

  onNotificationClick(): void {
    this.overlayOpen = false;
  }
}
