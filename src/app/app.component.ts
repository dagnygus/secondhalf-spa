import { Store } from '@ngrx/store';
import { trigger, transition, group, animateChild, query } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationStart, NavigationEnd, NavigationCancel, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AppState } from './app.ngrx.utils';

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

  isNavigating$ = this._router.events.pipe(
    filter((ev) => {
      if (
        ev instanceof NavigationStart ||
        ev instanceof NavigationEnd ||
        ev instanceof NavigationCancel
      ) { return true; }

      return false;
    }),
    map((ev) => ev instanceof NavigationStart)
  );

  constructor(private _router: Router, store: Store<AppState>) {}
}
