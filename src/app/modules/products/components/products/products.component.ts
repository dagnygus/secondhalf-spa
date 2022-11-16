
// eslint-disable-next-line max-len
import { fadeInAnimation, fadeOutAnimation, fadeOutLeftAnimation, fadeOutRightAnimation, zoomInAnimation, zoomInLeftAnimation, zoomInRightAnimation, zoomOutAnimation, zoomOutLeftAnimation, zoomOutRightAnimation }from '../../../../utils/ng-animations';
import { trigger, transition, query, stagger } from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';

const productsHeadingAnimationMetadata = trigger('productsHeading', [
  transition(':enter', fadeInAnimation('300ms', '150ms')),
  transition(':leave', fadeOutAnimation('300ms', '150ms')),
]);
const goldProductAnimationMetadata = trigger('goldProduct', [
  transition('void => small-view', fadeInAnimation('300ms', '150ms')),
  transition('small-view => void', fadeOutAnimation('300ms', '150ms')),
  transition('void => big-view', [
    fadeInAnimation('300ms', '150ms'),
    query('li', [
      stagger(150, zoomInAnimation('300ms', '0ms'))
    ], { optional: true })
  ]),
  transition('big-view => void', zoomOutAnimation('300ms', '0ms')),
]);
const plusProductAnimationMetadata = trigger('plusProduct', [
  transition('void => small-view', fadeInAnimation('300ms', '150ms')),
  transition('small-view => void', fadeOutAnimation('300ms', '150ms')),
  transition('void => big-view', [
    fadeInAnimation('300ms', '150ms'),
    query('li', [
      stagger(150, zoomInLeftAnimation('300ms', '0ms'))
    ], { optional: true })
  ]),
  transition('big-view => void', fadeOutLeftAnimation('300ms', '0ms')),
]);
const premiumProductAnimationMetadata = trigger('premiumProduct', [
  transition('void => small-view', fadeInAnimation('300ms', '150ms')),
  transition('small-view => void', fadeOutAnimation('300ms', '150ms')),
  transition('void => big-view', [
    fadeInAnimation('300ms', '150ms'),
    query('li', [
      stagger(150, zoomInRightAnimation('300ms', '0ms'))
    ], { optional: true })
  ]),
  transition('big-view => void', fadeOutRightAnimation('300ms', '0ms')),
]);

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    productsHeadingAnimationMetadata,
    goldProductAnimationMetadata,
    plusProductAnimationMetadata,
    premiumProductAnimationMetadata
  ]
})
export class ProductsComponent extends PageComponent {

  onAnimationDone(ev: any): void {
    console.log(ev);
  }

}
