import { EASE_IN_OUT_CUBIC, EASE_OUT_CUBIC } from './../../../utils/cubik-bezier';
import { ElementRef, HostBinding } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { AppState } from './../../../app.ngrx.utils';
import { Destroyable } from './../../../my-package/core/destroyable';
import { query, style, transition, trigger, animate, keyframes, animateChild, animation } from '@angular/animations';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, Input, Output, ChangeDetectorRef, OnInit, NgZone, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { MemberModel } from 'src/app/models/member-model';
import { asyncScheduler, merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, sample, tap, first, delay, take, subscribeOn } from 'rxjs/operators';
import { EventEmitter2 } from 'src/app/utils/subjects';
import { Router, NavigationEnd } from '@angular/router';


const containerAnimationMetadata = trigger('container', [

  transition(':enter', [
    style({ opacity: 0 }),
    animate('800ms 800ms ease-out', style({
      opacity: 1
    })),
    query('@*', animateChild())
  ])

]);

const mamberFooterAnimationMetadata = trigger('memberFooter', [

  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(100%)' }),

    animate('500ms 400ms ease-out', keyframes([
      style({ opacity: 1, transform: 'translateY(40%)', offset: 0.6 }),
      style({ opacity: 1, transform: 'translateY(0%)', offset: 1 }),
    ])),

    query('@*', animateChild()),
  ])

]);

const memeberButtonAnimationMetadata = trigger('memberBtn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0)' }),
    animate('300ms ease-out', keyframes([
      style({ opacity: 1, transform: 'scale(0.6)', offset: 0.6 }),
      style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
    ]))
  ])
]);

const LIKE_IMAGE_URL = 'url(/assets/front_end_images/like_button_confirmerd.svg)';
const LIKE_IMAGE_URL_CONFIRMED = 'url(/assets/front_end_images/like_button_confirmerd2.svg)';
const LIKE_IMAGE_URL_DISABLED = 'url(/assets/front_end_images/like_button_confirmerd_disabled.svg)';
const CHAT_IMAGE_URL = 'url(/assets/front_end_images/chat_button.svg)';
const CHAT_IMAGE_URL_DISABLED = 'url(/assets/front_end_images/chat_button_disabled.svg)';
const INFO_IMAGE_URL = 'url(/assets/front_end_images/info_button.svg)';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-member[member][isAuth\\$][index][likeStart\\$][likeEnd\\$]',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    containerAnimationMetadata,
    mamberFooterAnimationMetadata,
    memeberButtonAnimationMetadata
  ]
})
export class MemberComponent implements OnInit, OnDestroy {

  @ViewChild('image') imageElRef!: ElementRef<HTMLElement>;

  private _subscription!: Subscription;

  isAuth = false;
  likePending = false;
  @Input() member!: Readonly<MemberModel>;
  @Input() index!: number;
  @Input() isAuth$!: Observable<boolean>;
  @Input() likeStart$!: Observable<number>;
  @Input() likeEnd$!: Observable<number>;

  @Output() like = new EventEmitter2<void>(this._changeDetectorRef, this._ngZone);

  private _init = false;

  get infoBtnImgUrl(): string { return INFO_IMAGE_URL; }
  get likeBtnImageUrl(): string {
    if (this.isAuth) {
      return this.member.liked ? LIKE_IMAGE_URL_CONFIRMED : LIKE_IMAGE_URL;
    }
    return LIKE_IMAGE_URL_DISABLED;
  }
  get chatBtnImageUrl(): string {
    return this.isAuth ? CHAT_IMAGE_URL : CHAT_IMAGE_URL_DISABLED;
  }

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef,
              private readonly _ngZone: NgZone,
              private readonly _router: Router,
              private readonly _hostEl: ElementRef<HTMLElement>) {  }

  ngOnInit(): void {
    this._subscription = merge(
      this.isAuth$.pipe(
        tap((value) => this.isAuth = value)
      ),
      this.likeStart$.pipe(
        tap((value) => {
          if (this.index !== value) { return; }
          this.likePending = true;
        })
      ),
      this.likeEnd$.pipe(
        tap((value) => {
          if (this.index !== value) { return; }
          this.likePending = false;
        })
      )
    ).pipe(sample(this._ngZone.onStable),).subscribe(this._detectChanges);

    // this._preparePageTransition();
    this._init = true;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onLikeBtnClick(): void {
    this.like.emit();
  }

  private _preparePageTransition(): void {
    if (typeof window === 'undefined' || typeof window.document === 'undefined') { return; }
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      delay(0),
      first(),
      subscribeOn(asyncScheduler)
    ).subscribe((event) => {
      console.log('naviiii');

      if (!((event as NavigationEnd).url.startsWith('/member') &&
      (event as NavigationEnd).url.includes(this.member.userId))) { return; }

      const targetEl = document.getElementById(`header__${this.member.userId}`);
      const sourceEl = this.imageElRef.nativeElement;
      if (targetEl == null) { return; }

      this._hostEl.nativeElement.style.visibility = 'hidden';
      targetEl.style.visibility = 'hidden';

      const sourceRect = this.imageElRef.nativeElement.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const sourceOffsetLeft = `${Math.round(sourceRect.x + window.scrollX)}px`;
      const sourceOffsetTop = `${Math.round(sourceRect.y + window.scrollY)}px`;
      const targetOffsetLeft = `${Math.round(targetRect.x + window.scrollX)}px`;
      const targetOffsetTop = `${Math.round(targetRect.y + window.scrollY)}px`;
      const sourceWidth = `${Math.round(sourceEl.clientWidth)}px`;
      const sourceHeight = `${Math.round(sourceEl.clientHeight)}px`;
      const targetWidth = `${Math.round(targetEl.clientWidth)}px`;
      const targetHeight = `${Math.round(targetEl.clientHeight)}px`;

      const tempEl = sourceEl.cloneNode() as HTMLElement;
      tempEl.style.position = 'absolute';
      tempEl.style.borderRadius = '8px';
      tempEl.style.left = sourceOffsetLeft;
      tempEl.style.top = sourceOffsetTop;
      tempEl.style.width = sourceWidth;
      tempEl.style.height = sourceHeight;
      tempEl.style.objectFit = 'cover';
      tempEl.classList.add('mat-elevation-z6');
      document.body.appendChild(tempEl);
      const elAnimation = tempEl.animate({
        top: targetOffsetTop,
        left: targetOffsetLeft,
        width: targetWidth,
        height: targetHeight,
        borderRadius: '50%',
      }, {
        duration: 700,
        easing: 'ease-in-out'
      });

      elAnimation.onfinish = () => {
        tempEl.remove();
        targetEl.style.visibility = '';
      };

      elAnimation.oncancel = () => {
        tempEl.remove();
        targetEl.style.visibility = '';
      };
    });
  }

  private _detectChanges = () => {
    if (this._init) {
      this._changeDetectorRef.detectChanges();
    }
  };
}
