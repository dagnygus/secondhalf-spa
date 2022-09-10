import { filter, delay, first, subscribeOn } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
/* eslint-disable @typescript-eslint/member-ordering */
import { MemberModel } from 'src/app/models/member-model';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { EASE_IN_OUT_CUBIC } from 'src/app/utils/cubik-bezier';
import { asyncScheduler } from 'rxjs';

@Component({
  selector: 'app-single-member-header',
  templateUrl: './single-member-header.component.html',
  styleUrls: ['./single-member-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMemberHeaderComponent implements OnInit {

  @ViewChild('image') imageElRef!: ElementRef<HTMLElement>;

  @Input() likePending = false;
  @Input() member!: Readonly<MemberModel>;
  @Input() isAuth = false;

  @Output() readonly liked = new EventEmitter<string>();
  @Output() readonly chat = new EventEmitter<void>();

  constructor(private _router: Router) {}

  ngOnInit(): void {
    // this._prepateRouteTransition();
  }

  onLikedBtnClickHandler(): void {
    if (this.member.liked) { return; }
    this.liked.emit(this.member.userId);
  }

  onChatBtnClick(): void {
    this.chat.emit();
  }

  private _prepateRouteTransition(): void {
    console.log('init');
    if (typeof window === 'undefined' || typeof window.document === 'undefined') { return; }
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      delay(0),
      first(),
      subscribeOn(asyncScheduler)
    ).subscribe((event) => {
      console.log(event);
      if (!(event as NavigationEnd).url.startsWith('/members')) { return; }
      console.log('routing2');
      const targetEl = document.getElementById(`cart__${this.member.userId}`);
      const sourceEl = this.imageElRef.nativeElement;
      console.log(targetEl);
      if (targetEl == null) { return; }

      const cartEl = targetEl.closest('app-member') as HTMLElement;
      cartEl.style.visibility = 'hidden';

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

      sourceEl.style.visibility = 'hidden';

      tempEl.style.position = 'absolute';
      tempEl.style.borderRadius = '50%';
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
        borderRadius: '8px',
      }, {
        duration: 700,
        easing: 'ease-in-out'
      });

      elAnimation.onfinish = () => {
        tempEl.remove();
        cartEl.style.visibility = '';
      };

      elAnimation.oncancel = () => {
        tempEl.remove();
        cartEl.style.visibility = '';
      };
    });
  }
}
