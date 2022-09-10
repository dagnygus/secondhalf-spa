import { Subject, SubscriptionLike, Observable } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class Destroyable implements OnDestroy {

  private _dispose$ = new Subject<void>();

  protected destroyWith(...fns: (() => void)[]): void {
    for (const fn of fns) {
      this._dispose$.subscribe(fn);
    }
  }

  ngOnDestroy(): void {
    this._dispose$.next();
    this._dispose$.complete();
  }
}
