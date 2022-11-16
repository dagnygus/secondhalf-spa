import { fadeInAnimation, fadeOutAnimation } from '../../../../utils/ng-animations';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { transition, trigger } from '@angular/animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('opinions', [
      transition(':enter', fadeInAnimation('300ms', '200ms')),
      transition(':leave', fadeOutAnimation('300ms', '0ms'))
    ])
  ]
})
export class OpinionsComponent extends PageComponent {

  @HostBinding('@opinions')
  animationState = null;
}
