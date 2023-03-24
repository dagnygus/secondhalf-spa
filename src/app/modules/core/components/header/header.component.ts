import { fadeInAnimation, fadeInLeftAnimation, fadeInRightAnimation } from '../../../../utils/ng-animations';
import { zoomInDownAnimation } from '../../../../utils/ng-animations';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ChangeDetectionStrategy,
         ChangeDetectorRef,
         Component,
         OnDestroy,
         } from '@angular/core';
import { transition, trigger, animate, keyframes, style } from '@angular/animations';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { logout } from 'src/app/state/auth/auth.actions';
import { BreakpointObserver } from '@angular/cdk/layout';
import { selectIsAuth } from 'src/app/state/auth/auth.selectors';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

  readonly notificationCount$: Observable<number>;
  readonly isAuth$: Observable<boolean>;
  readonly avatarUrl$: Observable<string | null | undefined>;
  readonly outlineAnimationState$ = new BehaviorSubject<boolean>(false);

  outlineAnimationState = false;

  constructor(private readonly _store: Store<AppState>) {
    this.notificationCount$ = _store.pipe(select(({ notification }) => notification.notifications.length));
    this.isAuth$ = _store.pipe(select(({ auth }) => auth.userData != null));
    this.avatarUrl$ = _store.pipe(select(({ auth }) => auth.userData?.mainPhotoUrl))
  }

  logout(): void {
    this._store.dispatch(logout({ info: 'Logout from app-header-component.' }));
  }

  onNavSignIn(): void {
    this.outlineAnimationState = !this.outlineAnimationState;
    this.outlineAnimationState$.next(!this.outlineAnimationState$.value);
  }

}
