import { Component, NgZone, Renderer2, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-background-carousel',
  templateUrl: './background-carousel.component.html',
  styleUrls: ['./background-carousel.component.scss']
})
export class BackgroundCarouselComponent implements AfterViewInit, OnDestroy {

  private _subscription!: Subscription

  @ViewChild('image1') private image1Ref!: ElementRef<HTMLElement>;
  @ViewChild('image2') private image2Ref!: ElementRef<HTMLElement>;
  @ViewChild('image3') private image3Ref!: ElementRef<HTMLElement>;
  @ViewChild('image4') private image4Ref!: ElementRef<HTMLElement>;
  @ViewChild('image5') private image5Ref!: ElementRef<HTMLElement>;
  @ViewChild('image6') private image6Ref!: ElementRef<HTMLElement>;
  @ViewChild('image7') private image7Ref!: ElementRef<HTMLElement>;

  constructor(private _ngZone: NgZone,
              private _renderer: Renderer2) {
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
      this._subscription = interval(3000).subscribe(() => {

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

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
