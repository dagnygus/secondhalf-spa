import { fadeInDownAnimation, fadeOutUpAnimation } from '../../../../utils/ng-animations';
import { trigger, group, query, animateChild, transition } from '@angular/animations';
/* eslint-disable @typescript-eslint/member-ordering */
import { filter, map } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
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
export class AuthUserComponent extends PageComponent implements OnInit {

  @HostBinding('@authUserPage') animationState = null;

  activatedChildPath?: string;
  private _activatedChildPath$!: Observable<string | undefined>;
  get activatedChildPath$(): Observable<string | undefined> { return this._activatedChildPath$; }

  private _detailsActivePath$!: Observable<boolean>;
  get detailsActivePath$(): Observable<boolean> { return this._detailsActivePath$; }

  private _newPasswordActivePath$!: Observable<boolean>;
  get newPasswordActivePath$(): Observable<boolean> { return this._newPasswordActivePath$; }

  private _photosActivePath$!: Observable<boolean>;
  get photosActivePath$(): Observable<boolean> { return this._photosActivePath$; }


  constructor(private acivatedRoute: ActivatedRoute,
              private router: Router) { super(); }

  ngOnInit(): void {

    this._activatedChildPath$ = this._activatedChildPath$ = merge(
      of(this.acivatedRoute.firstChild?.snapshot.url[0].path),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.acivatedRoute.firstChild?.snapshot.url[0].path)
      )
    );

    this._detailsActivePath$ = this._activatedChildPath$.pipe(
      map(value => value === 'details')
    );

    this._newPasswordActivePath$ = this._activatedChildPath$.pipe(
      map(value => value === 'newpassword')
    );

    this._photosActivePath$ = this._activatedChildPath$.pipe(
      map(value => value === 'photos')
    );

  }

}
