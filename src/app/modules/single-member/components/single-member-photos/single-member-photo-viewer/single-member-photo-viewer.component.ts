import { isPlatformBrowser } from '@angular/common';
import { NgZone, PLATFORM_ID } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { Mover, MovingOptions, MovementFactory } from 'src/app/factories/web-animation.factory';
import { SingleMemberPhotosMediator } from '../single-member-photos.component';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, Renderer2, ElementRef, ViewChild, AfterViewInit, RendererStyleFlags2, Inject } from '@angular/core';
import { merge } from 'rxjs';
import { filter } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Hammer: HammerStatic;

enum ImageIndex { prev = 0, current = 1, next = 2 }

@Component({
  selector: 'app-single-member-photo-viewer',
  templateUrl: './single-member-photo-viewer.component.html',
  styleUrls: ['./single-member-photo-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMemberPhotoViewerComponent implements OnInit, AfterViewInit {

  private _moving = false;
  private _imgElements = new Array<any>(3);
  private _movers: Mover[] = null!;
  private _prevMovingState = { transform: 'translateX(-20%)', opacity: 0};
  private _currMovingState = { transform: 'translateX(0%)', opacity: 1};
  private _nextMovingState = { transform: 'translateX(20%)', opacity: 0};
  private _movingObtions: MovingOptions = { duration: 250, easing: 'ease-in-out'};

  private _imagesUrls!: readonly string[];
  get imagesUrls(): readonly string[] { return this._imagesUrls; }

  private _transitionModifocator = 1;
  get transitionModifocator(): number { return this._transitionModifocator; }

  private _currentIndex!: number;
  get currentIndex(): number { return this._currentIndex; }

  private _nextIndex!: number;
  get nextIndex(): number { return this._nextIndex; }

  private _prevoiusIndex!: number;
  get previousIndex(): number { return this._prevoiusIndex; }

  @ViewChild('frwBtn', { read: ElementRef }) private _forwardButtonElRef: ElementRef<HTMLElement> = null!;
  @ViewChild('backBtn', { read: ElementRef }) private _backButtonElRef: ElementRef<HTMLElement> = null!;
  @ViewChild('img1', { read: ElementRef }) private _img1ElRef: ElementRef<HTMLElement> = null!;
  @ViewChild('img2', { read: ElementRef }) private _img2ElRef: ElementRef<HTMLElement> = null!;
  @ViewChild('img3', { read: ElementRef }) private _img3ElRef: ElementRef<HTMLElement> = null!;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef,
              private readonly _mediator: SingleMemberPhotosMediator,
              private readonly _renderer: Renderer2,
              private readonly _transitionFactory: MovementFactory,
              private readonly _hostElRef: ElementRef,
              private readonly _ngZone: NgZone,
              @Inject(PLATFORM_ID) private _platformId: object) {
  }

  ngOnInit(): void {

    this._currentIndex = this._mediator.getSelectedIndex();
    this._prevoiusIndex = this._mediator.getPreviousIndex();
    this._nextIndex = this._mediator.getNextIndex();
    this._imagesUrls = this._mediator.getUrls();

    this._renderer.setStyle(
      this._hostElRef.nativeElement,
      '--image-aspect-ratio',
      this._mediator.getMainImageAspectRatio(),
      RendererStyleFlags2.DashCase
    );

    this._renderer.setStyle(
      this._hostElRef.nativeElement,
      'margin-bottom',
      this._mediator.getRowGap()
    );

    if (isPlatformBrowser(this._platformId)) {
      this._setupHammer();
    }
  }

  ngAfterViewInit(): void {
    this._setupElements();
    this._setupListeners();
  }

  private _setupElements(): void {
    this._imgElements[ImageIndex.current] = this._img1ElRef.nativeElement;
    this._imgElements[ImageIndex.next] = this._img2ElRef.nativeElement;
    this._imgElements[ImageIndex.prev] = this._img3ElRef.nativeElement;
    this._movers = this._imgElements.map((el) => this._transitionFactory.createFor(el));
    this._updateImgStyles();
    this._updateImgSources();
  }

  private _updateImgStyles(): void {
    this._renderer.setStyle(this._imgElements[ImageIndex.prev], 'opacity', 0);
    this._renderer.setStyle(this._imgElements[ImageIndex.next], 'opacity', 0);
    this._renderer.setStyle(this._imgElements[ImageIndex.current], 'opacity', 1);

    this._renderer.setStyle(this._imgElements[ImageIndex.prev], 'transform', 'translateX(-20%)');
    this._renderer.setStyle(this._imgElements[ImageIndex.next], 'transform', 'translateX(20%)');
    this._renderer.setStyle(this._imgElements[ImageIndex.current], 'transform', 'translateX(0)');
  }

  private _updateImgSources(): void {
    this._renderer.setProperty(this._imgElements[ImageIndex.current], 'src', this._imagesUrls[this._currentIndex]);
    this._renderer.setProperty(this._imgElements[ImageIndex.prev], 'src', this._imagesUrls[this._prevoiusIndex]);
    this._renderer.setProperty(this._imgElements[ImageIndex.next], 'src', this._imagesUrls[this._nextIndex]);
  }

  private _updateIndexes(): void {
    this._currentIndex = this._mediator.getSelectedIndex();
    this._prevoiusIndex = this._mediator.getPreviousIndex();
    this._nextIndex = this._mediator.getNextIndex();
  }

  private _setupListeners(): void {

    this._mediator.addPropListener('selectedIndex', (index) => {
      if (index > this._currentIndex) {

        if (index > this._currentIndex + 1) {
          this._renderer.setProperty(this._imgElements[ImageIndex.next], 'src', this._imagesUrls[index]);
        }

        this._moveForward();
      } else {

        if (index < this._currentIndex - 1) {
          this._renderer.setProperty(this._imgElements[ImageIndex.prev], 'src', this._imagesUrls[index]);
        }

        this._moveBackward();
      }
      this._updateIndexes();
      this._changeDetectorRef.markForCheck();
    });

    this._mediator.addPropListener('imagesUrls', (imagesUrls) => {
      this._imagesUrls = imagesUrls;
      this._updateImgSources();
    });

    this._renderer.listen(
      this._forwardButtonElRef!.nativeElement,
      'click',
      () => {
        this._mediator.setSelectedIndex(this.currentIndex + 1);
      }
    );

    this._renderer.listen(
      this._backButtonElRef!.nativeElement,
      'click',
      () => {
        this._mediator.setSelectedIndex(this.currentIndex - 1);
      }
    );

    merge(
      this._movers[ImageIndex.current].onDoneStable,
      this._movers[ImageIndex.next].onDoneStable,
      this._movers[ImageIndex.prev].onDoneStable,
    ).pipe(filter(() => this._moving)).subscribe(() => {
      this._updateImgSources();
      this._moving = false;
    });

    this._mediator.addPropListener('mainImageAspectRatio', (aspectRatio) => {
      this._renderer.setStyle(
        this._hostElRef.nativeElement,
        '--image-aspect-ratio',
        aspectRatio,
        RendererStyleFlags2.DashCase
      );
    });

    this._mediator.addPropListener('rowGap', (rowGap) => {
      this._renderer.setStyle(
        this._hostElRef.nativeElement,
        'margin-bottom',
        rowGap
      );
    });
  }

  private _moveForward(): void {


    this._movers[ImageIndex.current].fromTo(
      this._currMovingState, this._prevMovingState, this._movingObtions
      );

    this._movers[ImageIndex.next].fromTo(
      this._nextMovingState, this._currMovingState, this._movingObtions
    );

    this._moving = true;

    const el = this._imgElements.shift();
    this._imgElements.push(el);

    const tr = this._movers.shift();
    this._movers.push(tr!);
  }


  private _moveBackward(): void {
    this._movers[ImageIndex.current].fromTo(
      this._currMovingState, this._nextMovingState, this._movingObtions
    );

    this._movers[ImageIndex.prev].fromTo(
      this._prevMovingState, this._currMovingState, this._movingObtions
    );

    this._moving = true;

    const el = this._imgElements.pop();
    this._imgElements.unshift(el);

    const tr = this._movers.pop();
    this._movers.unshift(tr!);
  }

  private _setupHammer(): void {
    this._ngZone.runOutsideAngular(() => {
      const hammerHostEl = new Hammer(this._hostElRef.nativeElement);

      hammerHostEl.on('swipeleft', () => {
        if (this.currentIndex === this.imagesUrls.length - 1) { return; }
        this._ngZone.run(() => {
          this._mediator.setSelectedIndex(this.currentIndex + 1);
          this._changeDetectorRef.markForCheck();
        });
      });
      hammerHostEl.on('swiperight', () => {
        if (this.currentIndex === 0) { return; }
        this._ngZone.run(() => {
          this._mediator.setSelectedIndex(this.currentIndex - 1);
          this._changeDetectorRef.markForCheck();
        });
      });
    });
  }

}
