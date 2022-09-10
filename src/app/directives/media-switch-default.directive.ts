/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line max-len
import { ChangeDetectorRef, Directive, EmbeddedViewRef, EventEmitter, Host, OnInit, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { MediaSwitchDirective } from './media-switch.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mediaSwitchDefault]'
})
export class MediaSwitchDefaultDirective implements OnInit {

  private _view: EmbeddedViewRef<unknown> | null = null;

  @Output() viewCreate = new EventEmitter<void>();
  @Output() viewDestroy = new EventEmitter<void>();

  constructor(private _viewContainer: ViewContainerRef,
              private _tmpl: TemplateRef<unknown>,
              @Host() private _mediaSwhitch: MediaSwitchDirective,
              private _cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._mediaSwhitch.setDefault(this);
  }

  createView(): void {
    if (this._view) { return; }
    this._view = this._viewContainer.createEmbeddedView(this._tmpl);
    this.viewCreate.emit();
    if (this._mediaSwhitch.isContentInit()) {
      this.viewCreate.emit();
      this._cd.markForCheck();
    } else {
      Promise.resolve().then(() => {
        this.viewCreate.emit();
        this._cd.markForCheck();
      });
    }
  }

  clearView(): void {
    if (this._view) {
      this._viewContainer.clear();
      this._view = null;
      if (this._mediaSwhitch.isContentInit()) {
        this.viewDestroy.emit();
        this._cd.markForCheck();
      } else {
        Promise.resolve(() => {
          this.viewDestroy.emit();
          this._cd.markForCheck();
        });
      }
    }
  }
}
