import { BehaviorSubject, observable, Observable, Observer, OperatorFunction, ReplaySubject, Subject, Subscription, UnaryFunction } from "rxjs";

export interface DistributionOptions {
  resetOnError?: boolean;
  resetOnComplete?: boolean;
  resetOnRefCountZero?: boolean;
}

export class Distributor<T> extends Subject<T> {
  private _source: Observable<T>;
  private _sourceSubscrition: Subscription | null = null;
  private _refCount = 0;
  private _resetOnError: boolean;
  private _resetOnComplete: boolean;
  private _resetOnRefCountZero: boolean;
  private _latest: T | null = null;

  constructor(observable: Observable<T>, options?: DistributionOptions) {
    super();
    this._source = observable;
    this._resetOnError = options?.resetOnError ?? true;
    this._resetOnComplete = options?.resetOnComplete ?? true;
    this._resetOnRefCountZero = options?.resetOnRefCountZero ?? true;
  }

  override subscribe(observer?: Partial<Observer<T>> | undefined): Subscription;
  override subscribe(next: (value: T) => void): Subscription;
  override subscribe(nextOrPartialObserver: unknown): Subscription {

    const subscrition = super.subscribe(nextOrPartialObserver as any);
    if (this._refCount === 0 && !this._sourceSubscrition) {
      this._sourceSubscrition = this._source.subscribe(this);
    }

    this._refCount++;

    subscrition.add(() => {
      if (this._refCount === 0) { return; }
      this._refCount--
      if (this._refCount === 0 && this._resetOnRefCountZero && this._sourceSubscrition) {
        this._sourceSubscrition.unsubscribe();
        this._sourceSubscrition = null;
      }
    });

    return subscrition;
  }

  override next(value: T): void {
    this._latest = value;
    super.next(value);
  }

  override error(err: any): void {
    super.error(err);
    if (this._resetOnError && this._sourceSubscrition) {
      this._refCount = 0;
      this._sourceSubscrition.unsubscribe()
    }
  }

  override complete(): void {
    super.complete();
    if (this._resetOnComplete && this._sourceSubscrition) {
      this._refCount = 0;
      this._sourceSubscrition.unsubscribe();
    }
  }

  latestValue(): T | null {
    return this._latest;
  }
}

export class BehaviorDistributor<T> extends BehaviorSubject<T> {
  private _source: Observable<T>;
  private _sourceSubscrition: Subscription | null = null;
  private _refCount = 0;
  private _resetOnError: boolean;
  private _resetOnComplete: boolean;
  private _resetOnRefCountZero: boolean;

  constructor(defaultValue: T, observable: Observable<T>, options?: DistributionOptions) {
    super(defaultValue);
    this._source = observable;
    this._resetOnError = options?.resetOnError ?? true;
    this._resetOnComplete = options?.resetOnComplete ?? true;
    this._resetOnRefCountZero = options?.resetOnRefCountZero ?? true;
  }

  override subscribe(observer?: Partial<Observer<T>> | undefined): Subscription;
  override subscribe(next: (value: T) => void): Subscription;
  override subscribe(nextOrPartialObserver: unknown): Subscription {

    const subscrition = super.subscribe(nextOrPartialObserver as any);
    if (this._refCount === 0 && !this._sourceSubscrition) {
      this._sourceSubscrition = this._source.subscribe(this);
    }

    this._refCount++;

    subscrition.add(() => {
      if (this._refCount === 0) { return; }
      this._refCount--
      if (this._refCount === 0 && this._resetOnRefCountZero && this._sourceSubscrition) {
        this._sourceSubscrition.unsubscribe();
        this._sourceSubscrition = null;
      }
    });

    return subscrition;
  }

  override error(err: any): void {
    super.error(err);
    if (this._resetOnError && this._sourceSubscrition) {
      this._refCount = 0;
      this._sourceSubscrition.unsubscribe()
    }
  }

  override complete(): void {
    super.complete();
    if (this._resetOnComplete && this._sourceSubscrition) {
      this._refCount = 0;
      this._sourceSubscrition.unsubscribe();
    }
  }

  latestValue(): T {
    return this.value;
  }
}

export class ReplayDistributor<T> extends ReplaySubject<T> {
  private _source: Observable<T>;
  private _sourceSubscrition: Subscription | null = null;
  private _refCount = 0;
  private _resetOnError: boolean;
  private _resetOnComplete: boolean;
  private _resetOnRefCountZero: boolean;
  private _latest: T | null = null;

  constructor(observable: Observable<T>, buffer?:number ,options?: DistributionOptions) {
    super(buffer);
    this._source = observable;
    this._resetOnError = options?.resetOnError ?? true;
    this._resetOnComplete = options?.resetOnComplete ?? true;
    this._resetOnRefCountZero = options?.resetOnRefCountZero ?? true;
  }

  override subscribe(observer?: Partial<Observer<T>> | undefined): Subscription;
  override subscribe(next: (value: T) => void): Subscription;
  override subscribe(nextOrPartialObserver: unknown): Subscription {

    const subscrition = super.subscribe(nextOrPartialObserver as any);
    if (this._refCount === 0 && !this._sourceSubscrition) {
      this._sourceSubscrition = this._source.subscribe(this);
    }

    this._refCount++;

    subscrition.add(() => {
      if (this._refCount === 0) { return; }
      this._refCount--
      if (this._refCount === 0 && this._resetOnRefCountZero && this._sourceSubscrition) {
        this._sourceSubscrition.unsubscribe();
        this._sourceSubscrition = null;
      }
    });

    return subscrition;
  }

  override next(value: T): void {
    this._latest = value;
    super.next(value);
  }

  override error(err: any): void {
    super.error(err);
    if (this._resetOnError && this._sourceSubscrition) {
      this._refCount = 0;
      this._sourceSubscrition.unsubscribe()
    }
  }

  override complete(): void {
    super.complete();
    if (this._resetOnComplete && this._sourceSubscrition) {
      this._refCount = 0;
      this._sourceSubscrition.unsubscribe();
    }
  }

  latestValue(): T | null {
    return this._latest;
  }
}
