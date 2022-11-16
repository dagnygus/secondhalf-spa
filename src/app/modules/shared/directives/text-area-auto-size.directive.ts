import { Directive, ElementRef, Renderer2, NgZone, OnInit } from '@angular/core';

@Directive({
  selector: '[appTextAreaAutoSize]'
})
export class TextAreaAutoSizeDirective implements OnInit {

  constructor(private _hostEl: ElementRef<HTMLTextAreaElement>,
              private _renderer: Renderer2,
              private _ngZone: NgZone) {  }


  ngOnInit(): void {

    this._ngZone.runOutsideAngular(() => {

      this._renderer.listen(this._hostEl.nativeElement, 'input', () => {
        const reminder = this._hostEl.nativeElement.offsetHeight - this._hostEl.nativeElement.clientHeight;
        this._hostEl.nativeElement.style.height = '';
        this._hostEl.nativeElement.style.height = (this._hostEl.nativeElement.scrollHeight + reminder) + 'px';
      });

    });
  }

}
