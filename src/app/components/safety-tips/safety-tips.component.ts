import { PageComponent } from './../../directives/page.component';
import { transition, trigger } from '@angular/animations';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { fadeInAnimation, fadeOutAnimation } from 'src/app/utils/ng-animations';

@Component({
  selector: 'app-safety-tips',
  templateUrl: './safety-tips.component.html',
  styleUrls: ['./safety-tips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('safetyTips', [
      transition(':enter', [
        fadeInAnimation.startState,
        fadeInAnimation('300ms', '300ms')
      ]),
      transition(':leave', fadeOutAnimation('300ms', '300ms')),
    ])
  ]
})
export class SafetyTipsComponent extends PageComponent {

}
