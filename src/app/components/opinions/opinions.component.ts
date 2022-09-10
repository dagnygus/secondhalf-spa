import { fadeInAnimation, fadeOutAnimation } from './../../utils/ng-animations';
import { PageComponent } from './../../directives/page.component';
import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('opinions', [
      transition(':enter', [
        fadeInAnimation.startState,
        fadeInAnimation('300ms', '200ms')
      ]),
      transition(':leave', [
        fadeOutAnimation('300ms', '0ms')
      ])
    ])
  ]
})
export class OpinionsComponent extends PageComponent {

  @HostBinding('@opinions')
  animationState = null;
}
