import { PageComponent } from './../../directives/page.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { transition, trigger } from '@angular/animations';
import { fadeInAnimation, fadeOutAnimation } from 'src/app/utils/ng-animations';

@Component({
  selector: 'app-community-guidelines',
  templateUrl: './community-guidelines.component.html',
  styleUrls: ['./community-guidelines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('communityGuidelines', [
      transition(':enter', [
        fadeInAnimation.startState,
        fadeInAnimation('300ms', '300ms')
      ]),
      transition(':leave', fadeOutAnimation('300ms', '300ms')),
    ])
  ]
})
export class CommunityGuidelinesComponent extends PageComponent {

}
