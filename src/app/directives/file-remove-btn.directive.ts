/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, ElementRef, OnDestroy, Renderer2, OnInit, HostBinding, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[fileRemoveBtn]'
})
export class FileRemoveBtnDirective implements OnInit, OnDestroy {

  @Input()
  @HostBinding()
  disabled = false;

  private _onClick = new Subject<void>();
  readonly onClick = this._onClick.asObservable();

  constructor(private hostRef: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.listen(
      this.hostRef.nativeElement,
      'click',
      () => {
        if (this.disabled) { return; }
        this._onClick.next();
      }
    );
  }


  ngOnDestroy(): void {
    this._onClick.complete();
  }

}
