import { fadeInLeftAnimation, fadeOutLeftAnimation, fadeInUpAnimation, fadeOutDownAnimation } from '../../../../../utils/ng-animations';
import { selectIsAuth } from 'src/app/state/auth/auth.selectors';
import { trigger, state, style, query, transition, stagger, animate, keyframes, animateChild, group } from '@angular/animations';
import { AfterViewInit,
         ChangeDetectionStrategy,
         ChangeDetectorRef,
         Component,
         ElementRef,
         EventEmitter,
         Inject,
         Input,
         NgZone,
         OnDestroy,
         Output,
         Renderer2,
         ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { logoutFromUser } from 'src/app/state/auth/auth.actions';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';


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
  isBigViewport = false;


  private _destroy$ = new Subject<void>();

  constructor(private readonly _renderer: Renderer2,
              private readonly _ngZone: NgZone,
              private readonly _hostElRef: ElementRef<HTMLElement>,
              private readonly _changeDetector: ChangeDetectorRef,
              @Inject(DOCUMENT) private readonly _document: Document,
              breakpointObserver: BreakpointObserver) {

    breakpointObserver.observe('(min-width: 580px)').pipe(
      map((breakpointState) => breakpointState.matches),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.isBigViewport = value;
      _changeDetector.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this._ngZone.runOutsideAngular(() => {

      this._renderer.listen(this._document.defaultView, 'scroll', () => {

        if (Math.round(window.scrollY) >= this._hostElRef.nativeElement.offsetTop) {
          this._sticker!.nativeElement.style.position = 'fixed';
          if (!this.fixed) {
            this._ngZone.run(() => {
              this.fixed = true;
              this._changeDetector.markForCheck();
            });
          }

        } else {
          this._sticker!.nativeElement.style.position = '';

          if (this.fixed) {
            this._ngZone.run(() => {
              this.fixed = false;
              if (this.navbarOpen) { this.navbarOpen = false; }
              if (this.overlayOpen) { this.overlayOpen = false; }
              this._changeDetector.markForCheck();
            });
          }
        }
      });

      this._renderer.listen(this._document.body, 'pointerdown', (event) => {

        if (this.overlayOpen) {
          setTimeout(() => {
            this._ngZone.run(() => {
              this.overlayOpen = false;
              this._changeDetector.markForCheck();
            });
          }, 100);
        }

        const target = event.target;
        if (!_isInheritFromNode(target)) { return; }
        if (_isDescendant(this._hostElRef.nativeElement, target)) { return; }

        if (this.navbarOpen) {
          this._ngZone.run(() => {
            this.navbarOpen = false;
            this._changeDetector.markForCheck();
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  toogle(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  close(): void {
    if (!this.navbarOpen) { return; }
    this.navbarOpen = false;
  }

  logout(): void {
    this.navSignOut.emit();
    // this._store.dispatch(logoutFromUser());
  }

  toggleOverlay(): void {
    this.overlayOpen = !this.overlayOpen;
  }

  tryToggleOverlay(): void {
    if (!this.fixed) { return; }
    this.overlayOpen = !this.overlayOpen;
  }

  onScrollDone(): void {
    this.overlayOpen = true;
  }

  onSignInBtnClick(): void {
    console.log('emmm');
    this.navSignIn.emit();
  }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function _isInheritFromNode(target: any): target is Node {
  const constructor = Object.getPrototypeOf(target).constructor;
  return constructor.name === 'Element' ? true : constructor.name === 'Object' ? false : _isInheritFromNode(constructor.prototype);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function _isDescendant(parent: Node, child: Node): boolean {
  let node = child.parentNode;
  while (node) {
      if (node === parent) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
}
