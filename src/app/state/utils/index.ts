import { Injectable, OnDestroy } from "@angular/core";
import { ActionCreator, Action } from "@ngrx/store";
import { Subscription, Observable, Subject } from "rxjs";

export function isActionTypeOf<T extends ActionCreator>(target: any, compareTo: T): target is ReturnType<T>;
export function isActionTypeOf(target: Action, ...compareTo: Action[]): boolean;
export function isActionTypeOf(target: Action, ...compareTo: Action[]): boolean {
  for (let i = 0; i < compareTo.length; i++) {
    if (target.type === compareTo[i].type) {
      return true;
    }
  }
  return false;
}

type ActionWithOptionalPrev = Action & { prevAction?: Action }
type ActionWithPrev<T extends Action | ActionCreator, K  = T extends ActionCreator ? ReturnType<T> : T> = Action & { prevAction: K }

export function isPrevActionTypeOf<K extends ActionCreator>(target: ActionWithOptionalPrev | Action, prevAction: K): target is ActionWithPrev<K>;
export function isPrevActionTypeOf(target: ActionWithOptionalPrev | Action, ...compareTo: ActionCreator[]): boolean;
export function isPrevActionTypeOf(target: ActionWithOptionalPrev | Action, ...compareTo: ActionCreator[]): boolean {
  if (typeof (target as any).prevAction !== 'undefined') {
    for (let i = 0; i < compareTo.length; i++) {
      if (compareTo[i].type === (target as any).prevAction.type) {
        return true;
      }
    }
  }
  return false;
}

export enum StateStatus {
  empty = 'empty',
  error = 'error',
  complete = 'complete',
  pending = 'pending',
}

export enum AsyncActionStatus {
  awaiting = 'awaiting',
  resolved = 'resolved',
  rejected = 'rejected',
}

@Injectable()
export abstract class BaseStateRef<T> implements StateRef<T>, OnDestroy {
  private _subscription: Subscription
  private _state!: T
  get state(): T { return this._state; };
  readonly convertedState?: undefined;
  readonly onUpdate: Observable<unknown | void>;
  readonly onReverse?: Observable<unknown | void> | undefined;

  constructor(dataSource: Observable<T>, updateSource?: Observable<unknown | void>, reverceSource?: Observable<unknown | void>) {
    if (updateSource) {
      this.onUpdate = updateSource;
      this._subscription = dataSource.subscribe((state) => {
        if (this._state !== state) {
          this._state = state;
        }
      });
    } else {
      const subject = this.onUpdate = new Subject<void>
      this._subscription = dataSource.subscribe((state) => {
        if (this._state !== state) {
          this._state = state;
          subject.next();
        }
      })
    }

    if (reverceSource) {
      this.onReverse = reverceSource;
    }

    if (typeof this._state === 'undefined') {
      throw new Error('BaseStateRef: State not provided in contruction time.')
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

}
