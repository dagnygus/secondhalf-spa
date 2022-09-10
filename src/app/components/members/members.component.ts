import { BreakpointObserver } from '@angular/cdk/layout';
import { fadeInAnimation, fadeOutLeftAnimation, fadeOutRightAnimation, zoomOutAnimation } from './../../utils/ng-animations';
import { PageComponent } from './../../directives/page.component';
import { getMemberFailed } from './../../state/member/member.actions';
import { takeUntil, sample, subscribeOn, skipWhile } from 'rxjs/operators';
/* eslint-disable @typescript-eslint/member-ordering */
import { StateSnapshotService } from './../../services/state-snapshot.service';
import { StateStatus } from './../../app.ngrx.utils';
import { selectIsAuth } from '../../state/auth/auth.selectors';
import { MemberModel } from './../../models/member-model';
import { getMembersStart,
         getMembersSuccess,
         liekMemberFromMembersPageFailed,
         likeMemberFromMembersPageStart,
         likeMemberFromMembersPageSuccess,
         unsubscribeMemebersListiners} from './../../state/members/members.actions';
import { map, distinctUntilChanged, tap, shareReplay } from 'rxjs/operators';
import { asyncScheduler, merge, Observable, of, Subject } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/app.ngrx.utils';
import { select, Store } from '@ngrx/store';
import { selectMembersAsArr } from 'src/app/state/members/members.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { trigger, transition, query, group } from '@angular/animations';

const QPM_GENDER = 'gender';
const QPM_PAGE = 'page';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('home', [
      transition(':enter, void => complete', [
        query('.members__item',[
          fadeInAnimation.startState,
          fadeInAnimation('600ms', '200ms')
        ], { optional: true })
      ])
    ]),
    trigger('home2', [
      transition('state1 => void', [
        group([
          query('.members__item:nth-of-type(odd)', [
            fadeOutLeftAnimation('300ms', '100ms')
          ], { optional: true }),
          query('.members__item:nth-of-type(even)', [
            fadeOutRightAnimation('300ms', '100ms')
          ], { optional: true }),
        ])
      ]),
      transition('state2 => void', [
        group([
          query('.members__item:nth-of-type(3n)', [
            fadeOutRightAnimation('300ms', '100ms')
          ], { optional: true }),
          query('.members__item:nth-of-type(3n+1)', [
            fadeOutLeftAnimation('300ms', '100ms')
          ], { optional: true }),
          query('.members__item:nth-of-type(3n+2)', [
            zoomOutAnimation('300ms', '100ms')
          ], { optional: true }),
        ])
      ]),
      transition('state3 => void', [
        group([
          query('.members__item:nth-of-type(4n+1)', [
            fadeOutLeftAnimation('300ms', '100ms')
          ], { optional: true }),
          query('.members__item:nth-of-type(4n+2)', [
            fadeOutLeftAnimation('300ms', '250ms')
          ], { optional: true }),
          query('.members__item:nth-of-type(4n+3)', [
            fadeOutRightAnimation('300ms', '250ms')
          ], { optional: true }),
          query('.members__item:nth-of-type(4n)', [
            fadeOutRightAnimation('300ms', '100ms')
          ], { optional: true }),
        ])
      ]),
    ])
  ]
})
export class MembersComponent extends PageComponent implements OnDestroy {

  @HostBinding('@home') animationState: string | null = null;
  @HostBinding('@home2') animationState2!: string;

  readonly isAuth$: Observable<boolean>;
  readonly likeStart$: Observable<number>;
  readonly likeEnd$: Observable<number>;

  currentPage = 1;
  members: readonly MemberModel[] = [];
  totalPages = 0;
  membersStatus: StateStatus;

  private _destroy$ = new Subject<void>();
  private _init = false;

  constructor(private readonly _activatedRoute: ActivatedRoute,
              private readonly _store: Store<AppState>,
              private readonly _stateSnapshotService: StateSnapshotService,
              private readonly _changeDetector: ChangeDetectorRef,
              private readonly _actions$: Actions,
              private readonly _breakpointOberver: BreakpointObserver) {
    super();
    const currentState = this._stateSnapshotService.getMembersState();

    switch (currentState.totalPages) {
      case -1:
        this.membersStatus = 'pending';
        break;
      case 0:
        this.membersStatus = 'empty';
        break;
      default:
        this.membersStatus = 'complete';
        break;
    }

    this._store.pipe(
      select(selectMembersAsArr),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.members = value;
      this._changeDetector.markForCheck();
    });

    this._store.pipe(
      select((appState) => appState.members.totalPages),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.totalPages = value;
      this._changeDetector.markForCheck();
    });

    this._store.pipe(
      select((appState) => appState.members.page),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((value) => {
      this.currentPage = value;
      this._changeDetector.markForCheck();
    });

    this.isAuth$ = this._store.pipe(
      select(selectIsAuth),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this._store.pipe(
      select(selectIsAuth),
      distinctUntilChanged(),
      skipWhile(() => !this._init),
      subscribeOn(asyncScheduler),
      takeUntil(this._destroy$),
    ).subscribe(() => {
      const page = this._activatedRoute.snapshot.queryParamMap.has(QPM_PAGE) ?
                     +this._activatedRoute.snapshot.queryParamMap.get(QPM_PAGE)! :
                     1;
      const gender = this._activatedRoute.snapshot.queryParamMap.get(QPM_GENDER);

      this._store.dispatch(getMembersStart({ page, gender, limit: 10 }));
    });

    this._activatedRoute.queryParamMap.pipe(
      map((qpm) => ({ page: qpm.has(QPM_PAGE) ? +qpm.get(QPM_PAGE)! : 1 , gender: qpm.get(QPM_GENDER), limit: 10})),
      distinctUntilChanged((prev, curr) => prev.page === curr.page && prev.gender === curr.gender),
      subscribeOn(asyncScheduler),
      takeUntil(this._destroy$)
    ).subscribe((data) => {
      this._store.dispatch(getMembersStart(data));
      this._changeDetector.markForCheck();
    });

    merge<StateStatus, StateStatus, StateStatus>(
      this._actions$.pipe(ofType(getMembersStart), map(() => 'pending')),
      this._actions$.pipe(
        ofType(getMembersSuccess),
        map(() => {
          if (this.totalPages === 0) {
            return 'empty';
          }
          return 'complete';
        }),
      ),
      this._actions$.pipe(ofType(getMemberFailed), map(() => 'error'))
    ).pipe(distinctUntilChanged(), takeUntil(this._destroy$)).subscribe((value) => {
      this.membersStatus = value;
      this.animationState = value;
      this._changeDetector.markForCheck();
    });

    this.likeStart$ = this._actions$.pipe(
      ofType(likeMemberFromMembersPageStart),
      map((action) => action.index)
    );

    this.likeEnd$ = this.likeStart$.pipe(
      sample(merge(
        this._actions$.pipe(ofType(likeMemberFromMembersPageSuccess)),
        this._actions$.pipe(ofType(liekMemberFromMembersPageFailed))
      ))
    );

    this._breakpointOberver.observe([
      '(min-width: 621px)',
      '(min-width: 823px)',
    ]).pipe(takeUntil(this._destroy$)).subscribe((state) => {
      this.animationState2 = 'state1';
      if (state.breakpoints['(min-width: 621px)']) {
        this.animationState2 = 'state2';
      }
      if (state.breakpoints['(min-width: 823px)']) {
        this.animationState2 = 'state3';
      }
      this._changeDetector.markForCheck();
    });

    setTimeout(() => this._init = true);
  }

  ngOnDestroy(): void {
    this._store.dispatch(unsubscribeMemebersListiners());
    this._destroy$.next();
    this._destroy$.complete();
  }

  trackBy(_: number, model: MemberModel): string {
    return model.userId;
  }

  onLike(index: number): void {
    this._store.dispatch(likeMemberFromMembersPageStart({ index }));
  }

}
