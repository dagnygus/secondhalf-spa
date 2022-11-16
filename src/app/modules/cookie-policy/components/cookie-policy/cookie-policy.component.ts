import { transition, trigger } from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { fadeInAnimation, fadeOutAnimation } from 'src/app/utils/ng-animations';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cookiePolicy', [
      transition(':enter', fadeInAnimation('300ms', '300ms')),
      transition(':leave', fadeOutAnimation('300ms', '300ms')),
    ]),
  ]
})
export class CookiePolicyComponent extends PageComponent {

}
