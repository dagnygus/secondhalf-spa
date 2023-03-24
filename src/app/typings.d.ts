import { Observable } from "rxjs";

declare global {
  interface StateRef<T, R = undefined> {
    readonly state: T;
    readonly convertedState?: R;
    readonly onUpdate: Observable<unknown | void>;
    readonly onReverse?: Observable<unknown | void>;
  }
}
