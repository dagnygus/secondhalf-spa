import { fadeInAnimation, fadeOutAnimation } from './../../utils/ng-animations';
import { PageComponent } from './../../directives/page.component';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { trigger, transition } from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition(':enter', [
        fadeInAnimation.startState,
        fadeInAnimation('300ms', '200ms')
      ]),
      transition(':leave', [
        fadeOutAnimation('300ms', '0ms')
      ]),
    ])
  ]
})
export class AboutComponent extends PageComponent {

}
