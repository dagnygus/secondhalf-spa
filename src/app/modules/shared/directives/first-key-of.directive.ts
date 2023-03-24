import { Directive, Input, TemplateRef, ViewContainerRef, DoCheck, ViewRef } from '@angular/core';

@Directive({
  selector: '[appFirstKeyOf]'
})
export class FirstKeyOfDirective<T extends {}> implements DoCheck {

  @Input() appFirstKeyOf?: T | null | undefined;

  private _latestFirstKey: string | null = null;
  private _latestValue: any;
  private _view: ViewRef | null = null;

  constructor(private readonly _templateRef: TemplateRef<any>,
              private readonly _viewContainerRef: ViewContainerRef) { }


  ngDoCheck(): void {
    if (!this.appFirstKeyOf) {
      if (this._view) {
        this._viewContainerRef.clear();
        this._view = null;
      }
      return;
    }

    const keys = Object.keys(this.appFirstKeyOf);
    const key = keys.length > 0 ? keys[0] : null;

    if (key === null) {
      if (this._view) {
        this._viewContainerRef.clear();
        this._view = null;
      }
      return;
    }

    if (this._latestFirstKey !== key) {
      this._latestFirstKey = key;
      this._latestValue = (this.appFirstKeyOf as any)[key];
      if (this._view) {
        this._viewContainerRef.clear();
      }
      this._view = this._viewContainerRef.createEmbeddedView(this._templateRef, { $implicit: (this.appFirstKeyOf as any)[key] });
      return;
    }

    if (this._latestValue !== (this.appFirstKeyOf as any)[key]) {
      this._latestValue = (this.appFirstKeyOf as any)[key];

      if (this._view) {
        this._viewContainerRef.clear()
      }
      this._view = this._viewContainerRef.createEmbeddedView(this._templateRef, { $implicit: (this.appFirstKeyOf as any)[key] });
      return;
    }

    if (!this._view) {
      this._view = this._viewContainerRef.createEmbeddedView(this._templateRef, { $implicit: (this.appFirstKeyOf as any)[key] });
    }
  }
}
