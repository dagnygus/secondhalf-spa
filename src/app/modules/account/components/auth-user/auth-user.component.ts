import { fadeInDownAnimation, fadeOutUpAnimation } from '../../../../utils/ng-animations';
import { trigger, group, query, animateChild, transition } from '@angular/animations';
import { filter, map, share } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';


@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('outlet', [
      transition('* <=> *', [
        group([query('@*', animateChild(), { optional: true })])
      ])
    ]),
    trigger('authUserPage',[
      transition(':leave', [
        query('nav', fadeOutUpAnimation('400ms', '0ms'))
      ]),
      transition(':enter', [
        query('nav', fadeInDownAnimation('400ms', '200ms'))
      ])
    ])
  ]
})
export class AuthUserComponent extends PageComponent {

  @HostBinding('@authUserPage') animationState = null;

  detailsActivePath$: Observable<boolean>;
  newPasswordActivePath$: Observable<boolean>;
  photosActivePath$: Observable<boolean>;


  constructor(acivatedRoute: ActivatedRoute, router: Router) {
                super();
    const activatedChildPath = merge(
      of(acivatedRoute).pipe(map((acRt) => acRt.firstChild!.snapshot.url[0].path)),
      router.events.pipe(
        filter((ev) => ev instanceof NavigationEnd),
        map(() => acivatedRoute.firstChild!.snapshot.url[0].path),
        share()
      )
    )
    this.detailsActivePath$ = activatedChildPath.pipe(map((value) => value === 'details'));
    this.newPasswordActivePath$ = activatedChildPath.pipe(map((value) => value === 'newpassword'));
    this.photosActivePath$ = activatedChildPath.pipe(map((value) => value === 'photos'));

  }

}
