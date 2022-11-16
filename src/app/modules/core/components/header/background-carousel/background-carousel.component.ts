import { unsubscribeWith } from 'src/app/my-package/core/rxjs-operators';
import { Component, NgZone, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { interval } from 'rxjs';
import { Destroyable } from 'src/app/my-package';

@Component({
  selector: 'app-background-carousel',
  templateUrl: './background-carousel.component.html',
  styleUrls: ['./background-carousel.component.scss']
})
export class BackgroundCarouselComponent extends Destroyable implements AfterViewInit {

  @ViewChild('image1') private image1Ref!: ElementRef<HTMLElement>;
  @ViewChild('image2') private image2Ref!: ElementRef<HTMLElement>;
  @ViewChild('image3') private image3Ref!: ElementRef<HTMLElement>;
  @ViewChild('image4') private image4Ref!: ElementRef<HTMLElement>;
  @ViewChild('image5') private image5Ref!: ElementRef<HTMLElement>;
  @ViewChild('image6') private image6Ref!: ElementRef<HTMLElement>;
  @ViewChild('image7') private image7Ref!: ElementRef<HTMLElement>;

  constructor(private _ngZone: NgZone,
              private _renderer: Renderer2) {
    super();
  }

  ngAfterViewInit(): void {
    const imagesArr = [
      this.image1Ref,
      this.image2Ref,
      this.image3Ref,
      this.image4Ref,
      this.image5Ref,
      this.image6Ref,
      this.image7Ref
    ];

    let currentIndex = 0;

    this._ngZone.runOutsideAngular(() => {
      interval(3000).pipe(unsubscribeWith(this)).subscribe(() => {

        if (currentIndex === imagesArr.length - 1) {
          this._renderer.removeClass(imagesArr[currentIndex].nativeElement, 'carousel-show-image');
          this._renderer.addClass(imagesArr[0].nativeElement, 'carousel-show-image');
          currentIndex = 0;
          return;
        }

        this._renderer.removeClass(imagesArr[currentIndex].nativeElement, 'carousel-show-image');
        this._renderer.addClass(imagesArr[currentIndex + 1].nativeElement, 'carousel-show-image');
        currentIndex++;
      });
    });
  }

}
