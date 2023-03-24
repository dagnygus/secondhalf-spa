import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';

@Component({
  selector: 'app-safety-and-policy',
  templateUrl: './safety-and-policy.component.html',
  styleUrls: ['./safety-and-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SafetyAndPolicyComponent extends PageComponent {

}
