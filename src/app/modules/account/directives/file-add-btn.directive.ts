/* eslint-disable @typescript-eslint/member-ordering */
import { Directive, OnDestroy, OnInit, ElementRef, Renderer2, Input, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[fileAddBtn]'
})
export class FileAddBtnDirective implements OnInit, OnDestroy {

  private _onClick = new Subject<void>();
  readonly onClick = this._onClick.asObservable();

  @Input()
  @HostBinding()
  disabled = false;

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

