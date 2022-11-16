import { Component, ChangeDetectionStrategy } from '@angular/core';
import { transition, trigger } from '@angular/animations';
import { fadeInAnimation, fadeOutAnimation } from 'src/app/utils/ng-animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';

@Component({
  selector: 'app-community-guidelines',
  templateUrl: './community-guidelines.component.html',
  styleUrls: ['./community-guidelines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('communityGuidelines', [
      transition(':enter', fadeInAnimation('300ms', '300ms')),
      transition(':leave', fadeOutAnimation('300ms', '300ms')),
    ])
  ]
})
export class CommunityGuidelinesComponent extends PageComponent {

}
