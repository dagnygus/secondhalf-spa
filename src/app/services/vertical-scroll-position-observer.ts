import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, NgZone, PLATFORM_ID } from "@angular/core";
import { filter, fromEvent, Observable, Subject, Subscription } from "rxjs";

class ElementScrollTopTracker {
  private _onChangeSubject = new Subject<number>()
  private _unchangeCount = 0;
  private _prevPosition: number;
  private _subscription: Subscription
  private _unsubscribeCb: (() => void) | null = null;
  private _refCount = 0;
  private _onChange: Observable<number>;
  private _element: Element;
  private _eventSource: Observable<unknown>;

  get onChange(): Observable<number> { return this._onChange; };
  get refCount(): number { return this._refCount; }

  constructor(documentOrElement: Element | Document) {
    this._element = documentOrElement instanceof Document ? documentOrElement.documentElement : documentOrElement;
    this._prevPosition = this._element.scrollTop;
    this._eventSource = fromEvent(documentOrElement, 'scroll')
    this._subscription = this._eventSource.subscribe(() => {
      this._subscription.unsubscribe()
      requestAnimationFrame(this._checkAndUpdatePosition);
    });

    this._onChange = new Observable((observer) => {
      const sub = this._onChangeSubject.subscribe(observer);
      this._refCount++
      return () => {
        sub.unsubscribe();
        this._refCount--
        if (this._unsubscribeCb) { this._unsubscribeCb(); }
      }
    })
  }

  dispose(): void {
    this._subscription.unsubscribe();
  }

  onUnsubscribe(cb: () => void) {
    this._unsubscribeCb = cb;
  }

  private _checkAndUpdatePosition = () => {
    if (this._element.scrollTop === this._prevPosition) {
      this._unchangeCount++;
      if (this._unchangeCount > 5) {
        this._unchangeCount = 0;
        this._subscription = this._eventSource.subscribe(() => {
          this._subscription.unsubscribe();
          requestAnimationFrame(this._checkAndUpdatePosition);
        })
        return;
      }
    } else {
      this._unchangeCount = 0;
    }
    this._prevPosition = this._element.scrollTop;
    this._onChangeSubject.next(this._prevPosition);
    requestAnimationFrame(this._checkAndUpdatePosition);
  }
}


@Injectable({ providedIn: 'root' })
export class VerticalScrollPositionObserver {
  private _observedElements = new Map<Element | Document, ElementScrollTopTracker>()

  constructor(@Inject(PLATFORM_ID) private readonly _platformId: object,
              public ngZone: NgZone) {}

  observe(target: Element | ElementRef<Element> | Document): Observable<number> {
    if (!isPlatformBrowser(this._platformId)) { return new Observable(); }
    const element = target instanceof ElementRef ? target.nativeElement : target;

    if (this._observedElements.has(element)) { return this._observedElements.get(element)!.onChange }

    return this.ngZone.runOutsideAngular(() => {
      const scrollTracker = new ElementScrollTopTracker(element);
      this._observedElements.set(element, scrollTracker);
      scrollTracker.onUnsubscribe(() => {
        scrollTracker.refCount === 0;
        scrollTracker.dispose();
        this._observedElements.delete(element);
      });
      return scrollTracker.onChange;
    })
  }
}
