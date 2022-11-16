/* eslint-disable @typescript-eslint/member-ordering */
import { MediaSwitchDirective } from './media-switch.directive';
// eslint-disable-next-line max-len
import { Directive, EmbeddedViewRef, Host, Input, TemplateRef, ViewContainerRef, OnInit, ChangeDetectorRef, Output, EventEmitter, NgZone } from '@angular/core';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mediaSwitchCase]'
})
export class MediaSwitchCaseDirective implements OnInit {

  private _view: EmbeddedViewRef<unknown> | null = null;
  private _brkPoint!: number;

  @Input() set mediaSwitchCase(value: number | `${number}`) {
    if (this._brkPoint) { return; }
    this._brkPoint = typeof value === 'number' ? value : +value;
  }

  @Output() viewCreate = new EventEmitter<void>();
  @Output() viewDestroy = new EventEmitter<void>();

  constructor(private _viewContainer: ViewContainerRef,
              private _tmpl: TemplateRef<unknown>,
              @Host() private _mediaSwhitch: MediaSwitchDirective,
              private _cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._mediaSwhitch.addCase(this);
  }

  createView(): void {
    if (this._view) { return; }
    this._view = this._viewContainer.createEmbeddedView(this._tmpl);
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
        Promise.resolve().then(() => {
          this.viewDestroy.emit();
          this._cd.markForCheck();
        });
      }
    }
  }

  getBreakpoint(): number {
    return this._brkPoint;
  }

}
