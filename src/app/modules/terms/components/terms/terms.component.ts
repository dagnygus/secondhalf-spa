import { fadeInAnimation, fadeOutAnimation } from '../../../../utils/ng-animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { trigger, transition } from '@angular/animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('terms', [
      transition(':enter', [
        fadeInAnimation.startState,
        fadeInAnimation('300ms', '300ms')
      ]),
      transition(':leave', fadeOutAnimation('300ms', '0ms'))
    ])
  ]
})
export class TermsComponent extends PageComponent  {

}
