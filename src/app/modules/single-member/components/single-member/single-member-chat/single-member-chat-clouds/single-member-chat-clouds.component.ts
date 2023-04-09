import { createAnimationFrameTimeline, AnimationFrameTimelineOptions } from '../../../../../../utils/animation-frame-timeline';
import { MessageModel } from '../../../../../../models/chat-model';
import { ChangeDetectionStrategy, Component, DoCheck, ElementRef, Inject, Input, NgZone, OnChanges, PLATFORM_ID, SimpleChanges,  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { debounceTime, map, observeOn, Subject, switchMap, asyncScheduler, filter, tap, finalize, fromEvent, takeUntil, merge } from 'rxjs';
import { DestructionBag } from 'src/app/utils/destruction-bag';

@Component({
  selector: 'app-single-member-chat-clouds',
  templateUrl: './single-member-chat-clouds.component.html',
  styleUrls: ['./single-member-chat-clouds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ DestructionBag ]
})
export class SingleMemberChatCloudsComponent implements OnChanges, DoCheck {

  private _shouldScroll = false;
  private _init = false;
  private _scrolling = false;
  private _cachedHeight = 0;
  private _afterCheck$ = new Subject<void>();
  private _doScroling$ = new Subject<void>();
  private _areChanges = false;
  private _scrolledToBottom = true;

  @Input() messages!: readonly MessageModel[]
  @Input() memberId!: string;

  constructor(private _el: ElementRef<HTMLElement>,
              @Inject(PLATFORM_ID) private _platformId: object,
              ngZone: NgZone,
              destructionBag: DestructionBag) {
    if (!isPlatformBrowser(this._platformId)) { return; }
    ngZone.runOutsideAngular(() => {

      destructionBag.observe(fromEvent(this._el.nativeElement, 'scroll').pipe(
        filter(() => !this._scrolling),
        tap(() => {
          const el = this._el.nativeElement;
          this._scrolledToBottom = el.scrollHeight === el.scrollTop + el.clientHeight;
        })
      ));

      destructionBag.observe(this._doScroling$.pipe(
        debounceTime(100),
        filter(() => this._shouldScrollPredicate()),
        tap(() => {
          this._shouldScroll = false;
          this._scrolling = true;
        }),
        map(() => this._getTimelineOptions()),
        switchMap((options) => createAnimationFrameTimeline(options).pipe(
          finalize(() => this._onSmoothScrollComplete()),
          takeUntil(merge(
            fromEvent(this._el.nativeElement, 'pointerdown'),
            fromEvent(this._el.nativeElement, 'wheel')
          ))
        )),
        tap((value) => this._el.nativeElement.scrollTop = value)
      ));

      destructionBag.observe(this._afterCheck$.pipe(
        observeOn(asyncScheduler),
        tap(() => this._onAfterCheck())
      ));

    })

  }

  ngDoCheck(): void {
    if (!isPlatformBrowser(this._platformId) || !this._init) { return; }
    const el = this._el.nativeElement;
    if (!this._areChanges && this._scrolledToBottom
        && el.clientHeight !== this._cachedHeight && el.style.overflowY === 'scroll') {
      el.scrollTop = el.scrollHeight - el.clientHeight;
      this._cachedHeight = el.clientHeight;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] && !changes['messages'].isFirstChange())  {
        this._areChanges = true;
        const el = this._el.nativeElement;
        this._shouldScroll = el.scrollHeight === el.clientHeight + el.scrollTop;
        this._afterCheck$.next();
        this._doScroling$.next()
    }
  }

  private _shouldScrollPredicate(): boolean {
    const el = this._el.nativeElement;
    return (this._shouldScroll && el.scrollHeight > el.clientHeight + el.scrollTop) || this._scrolling;
  }

  private _getTimelineOptions(): AnimationFrameTimelineOptions {
    const el = this._el.nativeElement;
    const from = el.scrollTop;
    const to = el.scrollHeight - el.clientHeight;
    let duration = Math.max(300, Math.round(Math.abs(from - to)) / 2);

    return { from, to, duration, easingFn: (t) => 1 - (1 - t) * (1 - t) * (1 - t) }
  }

  private _onSmoothScrollComplete(): void {
    const el = this._el.nativeElement;
    this._cachedHeight = el.clientHeight;
    this._scrolledToBottom = el.scrollHeight === el.scrollTop + el.clientHeight;
    this._scrolling = false;
  }

  private _onAfterCheck(): void {
    const el = this._el.nativeElement;
    const childEl = this._el.nativeElement.children.item(0)!;
    const isOverflowing = childEl.clientHeight > el.clientHeight;

    if (isOverflowing) {
      el.style.overflowY = 'scroll';
      el.style.display = 'block';
    } else {
      el.style.overflowY = 'hidden';
      el.style.display = 'flex';
    }

    if (!this._init) {
      if (el.style.overflowY === 'scroll') {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      }
      this._init = true;
    }
    this._cachedHeight = el.clientHeight;
    this._areChanges = false;
  }

}
