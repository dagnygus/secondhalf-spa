import { Subject } from 'rxjs';

export interface Dispose {
  dispose(): void;
}

export class Disposable implements Dispose {

  private _dispose$ = new Subject<void>();

  protected disposeWith(...fns: (() => void)[]): void {
    for (const fn of fns) {
      this._dispose$.subscribe(fn);
    }
  }

  public dispose(): void {
    this._dispose$.next();
    this._dispose$.complete();
  }
}
