import { transition, trigger } from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { fadeInAnimation, fadeOutAnimation } from 'src/app/utils/ng-animations';

@Component({
  selector: 'app-intelectual-property',
  templateUrl: './intellectual-property.component.html',
  styleUrls: ['./intellectual-property.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('intellectualProperty', [
      transition(':enter', [
        fadeInAnimation.startState,
        fadeInAnimation('300ms', '300ms')
      ]),
      transition(':leave', fadeOutAnimation('300ms', '300ms')),
    ]),
  ]
})
export class IntellectualPropertyComponent {

}
