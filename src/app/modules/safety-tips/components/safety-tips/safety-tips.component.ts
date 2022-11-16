import { transition, trigger } from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { fadeInAnimation, fadeOutAnimation } from 'src/app/utils/ng-animations';

@Component({
  selector: 'app-safety-tips',
  templateUrl: './safety-tips.component.html',
  styleUrls: ['./safety-tips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('safetyTips', [
      transition(':enter', fadeInAnimation('300ms', '300ms')),
      transition(':leave', fadeOutAnimation('300ms', '300ms')),
    ])
  ]
})
export class SafetyTipsComponent extends PageComponent {

}
