import { filter, skipWhile, first, subscribeOn, observeOn, tap, map, take } from 'rxjs/operators';
import { animationFrameScheduler, asyncScheduler } from 'rxjs';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, ElementRef, Input, OnDestroy, OnInit, NgZone } from '@angular/core';

@Directive({
  selector: '[appHero]'
})
export class HeroDirective implements OnInit, OnDestroy {

  private static _heroMap = new Map<string, HeroDirective>();
  private _appHeroDuration = 300;
  private _appHeroDelay = 0;

  @Input() appHero!: string;
  @Input() appHeroStyles?: { [key: string]: string | number };
  @Input()
  public get appHeroDuration(): number {
    return this._appHeroDuration;
  }
  public set appHeroDuration(value: number | `${number}`) {
    this._appHeroDuration = typeof value === 'number' ? value : + value;
  }
  @Input() appHeroEaseing = 'linear';
  @Input()
  public get appHeroDelay(): number {
    return this._appHeroDelay;
  }
  public set appHeroDelay(value: number | `${number}`) {
    this._appHeroDelay = typeof value === 'number' ? value : + value;
  }
  @Input() appHeroCssClass?: string;

  private _elementToHide: HTMLElement;
  private _destroyed = false;
  @Input() set elementToHide(element: HTMLElement | string) {
    if (typeof element === 'string') {
      if (!(typeof window === 'object' && typeof window.document === 'object')) { return; }
      const el = this._hostEl.nativeElement.closest(element);
      if (el instanceof HTMLElement) {
        this._elementToHide = el;
      }
    } else {
      this._elementToHide = element;
    }
  };


  constructor(private _hostEl: ElementRef<HTMLElement>,
              private _router: Router,
              private _ngZone: NgZone) {

    this._elementToHide = _hostEl.nativeElement;

    if (!(typeof window === 'object' && typeof window.document === 'object')) { return; }

    if (!(_hostEl.nativeElement instanceof HTMLImageElement)) {
      throw new Error('[appHero] - appHero directive must by placed on image element');
    }
  }

  ngOnInit(): void {
    if (HeroDirective._heroMap.has(this.appHero)) {
      throw new Error('[appHero] - duplicated id for appHero directive. This directive must have uniqe id per page');
    }

    HeroDirective._heroMap.set(this.appHero, this);
    this._prepareTransition();
  }

  ngOnDestroy(): void {
    HeroDirective._heroMap.delete(this.appHero);
    this._destroyed = true;
  }


  private _prepareTransition(): void {
    if (!(typeof window === 'object' && typeof window.document === 'object')) { return; }

    let sourceRect: DOMRect;

    this._ngZone.runOutsideAngular(() => {
      this._router.events.pipe(
        tap((ev) => {
          if (ev instanceof NavigationStart) {
            sourceRect = this._hostEl.nativeElement.getBoundingClientRect();
          }
        }),
        filter((event) => event instanceof NavigationEnd),
        observeOn(animationFrameScheduler),
        skipWhile(() => !this._destroyed),
        take(1),
        subscribeOn(asyncScheduler)
      ).subscribe(() => {
        const targetHero = HeroDirective._heroMap.get(this.appHero);

        if (!targetHero) { return; }

        const targetEl = targetHero._hostEl.nativeElement;
        const sourceEl = this._hostEl.nativeElement;
        const targetElToHide = targetHero._elementToHide;
        const sourceElToHide = this._elementToHide;
        const tempEl = sourceEl.cloneNode() as HTMLElement;

        const targetRect = targetEl.getBoundingClientRect();

        //Hiding
        targetElToHide.style.visibility = 'hidden';
        sourceElToHide.style.visibility = 'hidden';

        //InitialStyles
        if (this.appHeroStyles) {
          const heroStyles = this.appHeroStyles;
          Object.keys(heroStyles).forEach((key) => {
            if (key in tempEl.style) {
              tempEl.style[key as any] = typeof heroStyles[key] === 'string' ? heroStyles[key] as string : heroStyles[key].toString();
            }
          });
        }
        tempEl.style.position = 'absolute';
        tempEl.style.width = `${Math.round(sourceEl.clientWidth)}px`;
        tempEl.style.height = `${Math.round(sourceEl.clientHeight)}px`;
        tempEl.style.top = `${Math.round(sourceRect.y + window.scrollY)}px`;
        tempEl.style.left = `${Math.round(sourceRect.x + window.scrollX)}px`;

        //prepering target styles
        let targetStyles: { [key: string]: string | number };
        if (targetHero.appHeroStyles) {
          targetStyles = {
            ...targetHero.appHeroStyles,
            top: `${Math.round(targetRect.y + window.scrollY)}px`,
            left: `${Math.round(targetRect.x + window.scrollX)}px`,
            width: `${Math.round(targetEl.clientWidth)}px`,
            height: `${Math.round(targetEl.clientHeight)}px`
          };
        } else {
          targetStyles = {
            top: `${Math.round(targetRect.y + window.scrollY)}px`,
            left: `${Math.round(targetRect.x + window.scrollX)}px`,
            width: `${Math.round(targetEl.clientWidth)}px`,
            height: `${Math.round(targetEl.clientHeight)}px`
          };
        }

        //apply css class
        if (this.appHeroCssClass && this.appHeroCssClass.length > 1) {
          this.appHeroCssClass.split(' ').forEach((className) => {
            tempEl.classList.add(className);
          });
        }

        //start animation
        document.body.appendChild(tempEl);
        const animation = tempEl.animate(targetStyles, {
          duration: this._appHeroDuration,
          easing: this.appHeroEaseing,
          delay: this._appHeroDelay
        });

        animation.onfinish = () => {
          targetElToHide.style.visibility = '';
          tempEl.remove();
        };

        animation.oncancel = () => {
          targetElToHide.style.visibility = '';
          tempEl.remove();
        };
      });
    });
  }
}
