import { ChangeDetectionStrategy, Component } from '@angular/core';
import { animateChild, group, query, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('parrentOutlet', [
      transition('* <=> *', [
        group([query('@*', animateChild(), { optional: true })])
      ])
    ])
  ]
})
export class AppComponent {
}
