import { BehaviorDistributor } from './../../../../utils/distributors';
import { LikeEvents } from './../../../../state/like/like.effects';
import { MembersEvents } from './../../../../state/members/members.effects';
import { likeStart } from './../../../../state/like/like.actions';
import { zoomInAnimation } from './../../../../utils/ng-animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { fadeInAnimation, fadeOutLeftAnimation, fadeOutRightAnimation, zoomOutAnimation } from '../../../../utils/ng-animations';
import { tap, map, filter } from 'rxjs/operators';
/* eslint-disable @typescript-eslint/member-ordering */
import { MemberModel } from '../../../../models/member-model';
import { Observable } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from 'src/app/app.ngrx.utils';
import { select, Store } from '@ngrx/store';
import { selectMembersAsArr } from 'src/app/state/members/members.selectors';
import { trigger, transition, query, group } from '@angular/animations';
import { PageComponent } from 'src/app/modules/shared/directives/page.component';
import { StateStatus } from 'src/app/state/utils';
import { DestructionBag } from 'src/app/utils/destruction-bag';

const QPM_GENDER = 'gender';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ DestructionBag ],
  animations: [
    trigger('inputGroup', [
      transition(':enter', zoomInAnimation('300ms', '150ms')),
      transition(':leave', zoomOutAnimation('300ms', '0ms'))
    ]),
    trigger('home', [
      transition(':enter, void => complete', [
        query('.members-list__item', fadeInAnimation('600ms', '200ms'), { optional: true })
      ])
    ]),
    trigger('home2', [
      transition('state1 => void', [
        group([
          query('.members-list__item:nth-of-type(odd)', fadeOutLeftAnimation('300ms', '100ms'), { optional: true }),
          query('.members-list__item:nth-of-type(even)', fadeOutRightAnimation('300ms', '100ms'), { optional: true }),
        ])
      ]),
      transition('state2 => void', [
        group([
          query('.members-list__item:nth-of-type(3n)', fadeOutRightAnimation('300ms', '100ms'), { optional: true }),
          query('.members-list__item:nth-of-type(3n+1)', fadeOutLeftAnimation('300ms', '100ms'), { optional: true }),
          query('.members-list__item:nth-of-type(3n+2)', zoomOutAnimation('300ms', '100ms'), { optional: true }),
        ])
      ]),
      transition('state3 => void', [
        group([
          query('.members-list__item:nth-of-type(4n+1)', fadeOutLeftAnimation('300ms', '100ms'), { optional: true }),
          query('.members-list__item:nth-of-type(4n+2)', fadeOutLeftAnimation('300ms', '250ms'), { optional: true }),
          query('.members-list__item:nth-of-type(4n+3)', fadeOutRightAnimation('300ms', '250ms'), { optional: true }),
          query('.members-list__item:nth-of-type(4n)', fadeOutRightAnimation('300ms', '100ms'), { optional: true }),
        ])
      ]),
    ])
  ]
})
export class MembersComponent extends PageComponent {

  @HostBinding('@home') animationState: string | null = null;
  @HostBinding('@home2') animationState2!: string;
  private _page: number = 1;

  isAuth$: Observable<boolean>;
  totalPages$: Observable<number>;
  currentPage$: Observable<number>;
  members$: Observable<readonly MemberModel[]>;
  membersStatus$: Observable<StateStatus>;
  pendingIndex$: BehaviorDistributor<number>;
  totalPagesMoreThenZero$: Observable<boolean>;
  membersPending$: Observable<boolean>;
  membersNotEmpty$: Observable<boolean>;

  private _currentInputSelection: string;
  public get currentInputSelection(): string {
    return this._currentInputSelection;
  }
  public set currentInputSelection(value: string) {
    if (value === this._currentInputSelection) { return; }
    this._currentInputSelection = value;
    if (value === 'all') {
      this._router.navigate([], {
        relativeTo: this._activatedRoute,
        replaceUrl: true,
        queryParams: { page: this._page }
      });
    } else {

      this._router.navigate([], {
        relativeTo: this._activatedRoute,
        replaceUrl: true,
        queryParams: { page: this._page, gender: value }
      })
    }
  }


  constructor(private readonly _activatedRoute: ActivatedRoute,
              private readonly _store: Store<AppState>,
              membersEvents: MembersEvents,
              likeEvents: LikeEvents,
              changeDetector: ChangeDetectorRef,
              breakpointOberver: BreakpointObserver,
              destructionBag: DestructionBag,
              private readonly _router: Router) {
    super();

    this._currentInputSelection = this._activatedRoute.snapshot.queryParamMap.get('gender') ?? 'all';
    this.isAuth$ = this._store.pipe(select(({ auth }) => auth.userData != null));
    this.totalPages$ = this._store.pipe(select(({ members }) => members.totalPages));
    this.totalPagesMoreThenZero$ = this._store.pipe(select(({ members }) => members.totalPages > 0))
    this.currentPage$ = this._store.pipe(select(({ members }) => members.page), map((page) => Math.max(1, page)));
    this.members$ = this._store.pipe(select(selectMembersAsArr));
    this.membersStatus$ = membersEvents.status$.pipe(tap((state) => this.animationState = state));
    this.membersPending$ = membersEvents.status$.pipe(map((status) => status === StateStatus.pending));
    this.membersNotEmpty$ = membersEvents.status$.pipe(map((status) => status !== StateStatus.empty));
    this.pendingIndex$ = new BehaviorDistributor(-1, likeEvents.pending$.pipe(
      filter((value) => !value),
      map(() => -1)
    ));

    destructionBag.observe(breakpointOberver.observe([
      '(min-width: 621px)',
      '(min-width: 823px)',
    ]).pipe(tap((state) => {
      this.animationState2 = 'state1';
      if (state.breakpoints['(min-width: 621px)']) {
        this.animationState2 = 'state2';
      }
      if (state.breakpoints['(min-width: 823px)']) {
        this.animationState2 = 'state3';
      }
      changeDetector.markForCheck();
    })));

  }

  trackBy(_: number, model: MemberModel): string {
    return model.userId;
  }

  onLike(id: string): void {
    this._store.dispatch(likeStart({ id }));
  }

  onPageSelected(page: number): void {
    this._page = page;
    if (this._currentInputSelection === 'all') {
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page } });
    } else {
      this._router.navigate([], {
        relativeTo: this._activatedRoute,
        queryParams: {
          page,
          gender: this._currentInputSelection
        }
      });
    }
  }

}
