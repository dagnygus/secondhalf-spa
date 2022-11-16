import { fadeInAnimation, fadeInLeftAnimation, fadeInRightAnimation } from '../../../../utils/ng-animations';
import { zoomInDownAnimation } from '../../../../utils/ng-animations';
import { Subject } from 'rxjs';
import { ChangeDetectionStrategy,
         ChangeDetectorRef,
         Component,
         OnDestroy,
         } from '@angular/core';
import { transition, trigger, animate, keyframes, style } from '@angular/animations';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.ngrx.utils';
import { logoutFromUser } from 'src/app/state/auth/auth.actions';
import { BreakpointObserver } from '@angular/cdk/layout';
import { selectIsAuth } from 'src/app/state/auth/auth.selectors';


const loginBtnAnimationMetadata = trigger('loginBtn', [
  transition(':enter', fadeInLeftAnimation('400ms', '1s'))
]);

const registerBtnAnimationMetadata = trigger('registerBtn', [
  transition(':enter', fadeInRightAnimation('400ms', '1s'))
]);

const logoutBtnAnimationMetadata = trigger('logoutBtn', [
  transition(':enter', fadeInLeftAnimation('400ms', '1s'))
]);

const accountBtnAnimationMetadata = trigger('accountBtn', [
  transition(':enter', fadeInRightAnimation('400ms', '1s'))
]);

const carousel1AnimationMetadata = trigger('carousel1', [
  transition(':enter', fadeInAnimation('800ms', '500ms'))
]);

const carousel2AnimationMetadata = trigger('carousel2', [
  transition(':enter', fadeInAnimation('800ms', '500ms'))
]);

const headerTitleAnimationMetadata = trigger('title', [
  transition(':enter', zoomInDownAnimation('700ms', '1s'))
]);

const authFormAnimationMetadata = trigger('authForm',[
  transition('false <=> true', animate('5s', keyframes([
    style({ offset: 0, outline: '5px dashed #f4433600' }),
    style({ offset: .1, outline: '5px solid #f44336FF' }),
    style({ offset: .2, outline: '5px dashed #f4433600' }),
    style({ offset: .3, outline: '5px solid #f44336FF' }),
    style({ offset: .4, outline: '5px dashed #f4433600' }),
    style({ offset: .5, outline: '5px solid #f44336FF' }),
    style({ offset: .6, outline: '5px dashed #f4433600' }),
    style({ offset: .7, outline: '5px solid #f44336FF' }),
    style({ offset: .8, outline: '5px dashed #f4433600' }),
    style({ offset: .9, outline: '5px solid #f44336FF' }),
    style({ offset: 1, outline: '5px dashed #f4433600' }),
  ])))
]);

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    registerBtnAnimationMetadata,
    loginBtnAnimationMetadata,
    carousel1AnimationMetadata,
    carousel2AnimationMetadata,
    headerTitleAnimationMetadata,
    logoutBtnAnimationMetadata,
    accountBtnAnimationMetadata,
    authFormAnimationMetadata
  ]
})
export class HeaderComponent implements OnDestroy {

  avatarUrl?: string | null | undefined;
  viewportWidthOver580px = false;
  isAuth = false;
  outlineAnimationState = false;
  notificationCount = 0;

  private _destroy$ = new Subject();

  constructor(private readonly _store: Store<AppState>,
              breakpointObserver: BreakpointObserver,
              cd: ChangeDetectorRef) {

    _store.pipe(
      select((appState) => appState.auth.userData?.mainPhotoUrl),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.avatarUrl = value;
      cd.markForCheck();
    });

    _store.pipe(
      select(selectIsAuth),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.isAuth = value;
      cd.markForCheck();
    });

    _store.pipe(
      select((appState) => appState.notification.notifications.length),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.notificationCount = value;
      cd.markForCheck();
    });

    breakpointObserver.observe('(min-width: 580px)').pipe(
      map((breakpointState) => breakpointState.matches),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.viewportWidthOver580px = value;
      cd.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  logout(): void {
    this._store.dispatch(logoutFromUser());
  }

  onNavSignIn(): void {
    console.log('nkadsknsad');
    this.outlineAnimationState = !this.outlineAnimationState;
  }

}
