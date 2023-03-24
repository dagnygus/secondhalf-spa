import { fadeInAnimation, fadeOutAnimation } from './../../../../utils/ng-animations';
import { trigger, transition } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: [ './not-found.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('notFound', [
      transition(':enter', fadeInAnimation('300ms', '150ms')),
      transition(':leave', fadeOutAnimation('300ms', '0ms'))
    ])
  ]
})
export class NotFoundComponent extends PageComponent {
  @HostBinding('@notFound')
  animationState = null;
}
