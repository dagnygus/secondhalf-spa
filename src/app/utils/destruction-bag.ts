import { Observable, Subscription } from 'rxjs';
import { Injectable, OnDestroy } from "@angular/core";

@Injectable()
export class DestructionBag implements OnDestroy {
  private _subscription: Subscription | null = null;

  observe(source: Observable<any>): void {
    if (this._subscription) {
      this._subscription.add(source.subscribe());
    } else {
      this._subscription = source.subscribe();
    }
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }
}
