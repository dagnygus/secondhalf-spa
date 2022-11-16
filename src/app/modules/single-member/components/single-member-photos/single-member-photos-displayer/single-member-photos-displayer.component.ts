/* eslint-disable @typescript-eslint/member-ordering */
import { animate, style, transition, trigger } from '@angular/animations';
// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, IterableChanges, IterableDiffer, IterableDiffers, OnInit, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { SingleMemberPhotosMediator } from '../single-member-photos.component';
import { Mover, MovingOptions, MovementFactory } from 'src/app/factories/web-animation.factory';

const animationTiming = 120;

const imageItemAnimationMetadata = trigger('imageItem', [
  transition(':increment', [
    style({
      transform: 'translateX({{ prev }}%)',
    }),
    animate(`${animationTiming}ms ease-out`, style({
      transform: 'translateX({{ step }}%)'
    }))
  ]),
  transition(':decrement', [
    style({
      transform: 'translateX({{ next }}%)'
    }),
    animate(`${animationTiming}ms ease-out`, style({
      transform: 'translateX({{ step }}%)'
    }))
  ]),
]);

@Component({
  selector: 'app-single-member-photos-displayer',
  templateUrl: './single-member-photos-displayer.component.html',
  styleUrls: ['./single-member-photos-displayer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    imageItemAnimationMetadata
  ]
})
export class SingleMemberPhotosDisplayerComponent implements OnInit, AfterViewInit {

  private _imagesUrls!: readonly string[];
  private _selectedIndex!: number;
  private _elements: HTMLElement[] = [];
  private _differ: IterableDiffer<string> = null!;
  private _itemsPerView = 4;
  private _imagesContainerMover: Mover = null!;
  private _frameMover: Mover = null!;
  private _movingOptions: MovingOptions = { duration: 250, easing: 'linear' };

  @ViewChild('imagesContainer') private _imagesContainerElRef: ElementRef<HTMLElement> = null!;
  @ViewChild('frame') private _frameElRef: ElementRef<HTMLElement> = null!;

  get imagesUrls(): readonly string[] { return this._imagesUrls; }
  get selectedIndex(): number { return this._selectedIndex; }

  constructor(private readonly _interableDiffers: IterableDiffers,
              private readonly _mediator: SingleMemberPhotosMediator,
              private readonly _renderer: Renderer2,
              private readonly _transitionFactory: MovementFactory,
              private readonly _hostEl: ElementRef) {
  }

  ngOnInit(): void {
    this._imagesUrls = this._mediator.getUrls();
    this._selectedIndex = this._mediator.getSelectedIndex();
    this._itemsPerView = this._mediator.getItemsPerView();

    this._renderer.setStyle(
      this._hostEl.nativeElement,
      '--items-per-view',
      this._itemsPerView,
      RendererStyleFlags2.DashCase
    );

    this._renderer.setStyle(
      this._hostEl.nativeElement,
      '--image-aspect-ratio',
      this._mediator.getSecondaryImageAspectRatio(),
      RendererStyleFlags2.DashCase
    );

    this._renderer.setStyle(
      this._hostEl.nativeElement,
      '--column-gap',
      this._mediator.getColumnGap(),
      RendererStyleFlags2.DashCase
    );
  }

  ngAfterViewInit(): void {
    this._differ = this._interableDiffers.find(this._imagesUrls).create();
    const changes = this._differ.diff(this._imagesUrls);
    if (changes) { this._applyChanges(changes); }

    this._setupElements();
    this._setupSubscribers();

  }

  private _setupElements(): void {
    this._imagesContainerMover = this._transitionFactory.createFor(this._imagesContainerElRef);
    this._frameMover = this._transitionFactory.createFor(this._frameElRef);

  }

  private _setupSubscribers(): void {

    this._mediator.addPropListener('imagesUrls', (imagesUrls) => {
      this._imagesUrls = imagesUrls;
      const newChanges = this._differ.diff(imagesUrls);
      if (newChanges) {
        this._applyChanges(newChanges);
        this._transformContainer(this._selectedIndex, this._selectedIndex);
        this._transormFrame(this._selectedIndex);
      }
    });

    this._mediator.addPropListener('selectedIndex', (selectedIndex, prevValue) => {
      this._transformContainer(selectedIndex, prevValue);
      this._transormFrame(selectedIndex);
      this._selectedIndex = selectedIndex;
    });

    this._mediator.addPropListener('itemsPerView', (itemsPerView) => {
      this._itemsPerView = itemsPerView;
      this._renderer.setStyle(
        this._hostEl.nativeElement,
        '--items-per-view',
        itemsPerView,
        RendererStyleFlags2.DashCase
      );
      this._justifyImages();
    });

    this._mediator.addPropListener('secondaryImageAspectRatio', (aspectRatio) => {
      this._renderer.setStyle(
        this._hostEl.nativeElement,
        '--image-aspect-ratio',
        aspectRatio,
        RendererStyleFlags2.DashCase
      );
    });

    this._mediator.addPropListener('columnGap', (columnGap) => {
      this._renderer.setStyle(
        this._hostEl.nativeElement,
        '--column-gap',
        columnGap,
        RendererStyleFlags2.DashCase
      );
    });
  }

  private _applyChanges(changes: IterableChanges<string>): void {

    let dirty = false;

    changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
      if (item.previousIndex == null) {
        this._createNewImage(currentIndex, item.item);
      } else if (currentIndex == null) {
        this._removeImage(adjustedPreviousIndex);
      } else if (adjustedPreviousIndex !== null) {
        this._moveImage(adjustedPreviousIndex, currentIndex);
      }
      dirty = true;
    });

    if (dirty) {
      this._justifyImages();
    }

    changes.forEachIdentityChange((item) => {
      this._updateImageSource(item.currentIndex!, item.item);
    });
  }

  private _createNewImage(index: number | null, url: string): void {
    const element = this._renderer.createElement('img');
    this._renderer.addClass(element, 'single-member-photos-displayer__image');
    this._renderer.setProperty(element, 'src', url);
    this._renderer.listen(element, 'click', this._onImageClickHandler.bind(this));

    if (index == null) {
      this._renderer.appendChild(
        this._imagesContainerElRef.nativeElement,
        element
      );
      this._elements.push(element);
    } else {
      this._renderer.insertBefore(
        this._imagesContainerElRef.nativeElement,
        element,
        this._elements[index],
      );
      this._elements.splice(index, 0, element);
    }
  }

  private _removeImage(index: number | null): void {
    index = index === null ? this._elements.length - 1 : index;

    this._renderer.removeChild(
      this._imagesContainerElRef.nativeElement,
      this._elements[index]
    );
    this._elements.splice(index, 1);
  }

  private _moveImage(prevIndex: number, currIndex: number): void {
    const element = this._elements.splice(prevIndex, 1);
    this._renderer.removeChild(this._imagesContainerElRef.nativeElement, element[0]);
    this._renderer.insertBefore(
      this._imagesContainerElRef.nativeElement,
      element,
      this._elements[currIndex],
      true
    );
    this._elements.splice(currIndex, 0, element[0]);
  }

  private _updateImageSource(index: number, url: string): void {
    this._renderer.setProperty(
      this._elements[index],
      'src',
      url
    );
  }

  private _justifyImages(): void {
    for (let i = 0; i < this._elements.length; i++) {

      this._renderer.setStyle(
        this._elements[i],
        'transform',
        `translateX(calc(${i} * (100% + (var(--items-per-view) * var(--column-gap)) / (var(--items-per-view) - 1)))`
      );
    }
  }

  private _getNewTranslationForContainer(nextIndex: number, previousIndex: number): string {

    let transStep = nextIndex;

    if (nextIndex >= previousIndex) {
      transStep = transStep - this._itemsPerView + 2;
      if (nextIndex === this._imagesUrls.length - 1) {
        transStep--;
      }
    } else {
      const maxIndex = this._imagesUrls.length - 1;
      transStep = transStep - this._itemsPerView + 2;
      if (maxIndex - nextIndex >= this._itemsPerView - 2) {
        transStep++;
      }
    }

    transStep = transStep < 0 ? 0 : transStep;
    const transStepMultipled = transStep * 100;

    let translationValue: number;

    if (transStepMultipled % this._itemsPerView === 0) {
      translationValue = Math.round((transStepMultipled) / this._itemsPerView);
    } else {
      translationValue = Math.round((transStepMultipled * 1000) / this._itemsPerView) * 0.001;
    }

    translationValue = Math.round((transStepMultipled) / this._itemsPerView);
    return `translateX(calc(-${translationValue}% - ${transStep} * var(--column-gap) / (var(--items-per-view) - 1))`;
  }

  private _transformContainer(nextIndex: number, previousIndex: number): void {
    const newTranslation = this._getNewTranslationForContainer(nextIndex, previousIndex);

    this._imagesContainerMover.to({
      transform: newTranslation
    }, this._movingOptions);
  }

  private _transormFrame(index: number): void {

    this._frameMover.to({
      transform: `translateX(calc(${index} * (100% + (var(--items-per-view) * var(--column-gap)) / (var(--items-per-view) - 1)))`
    }, this._movingOptions);
  }


  private _onImageClickHandler(event: any): void {
    const index = this._elements.indexOf(event.target);
    if (this._selectedIndex === index) { return; }
    this._mediator.setSelectedIndex(index);
  }
}
