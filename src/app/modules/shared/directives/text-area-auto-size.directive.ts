import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, DoCheck, Inject, PLATFORM_ID, Input, Renderer2, ChangeDetectorRef, OnDestroy, HostBinding, OnChanges, OnInit, SimpleChanges, HostListener, NgZone } from '@angular/core';
import { coerceNumberInput, NumberInput } from 'src/app/utils/coerction-and-types';

@Directive({
  selector: 'textarea[appTextAreaAutoSize]'
})
export class TextAreaAutoSizeDirective implements DoCheck, OnChanges, OnInit {
  private _minRows = 1;
  private _maxRows = 0;
  private _init = false;
  private _wasUpdated = false;

  @Input() set maxRows(value: NumberInput) {
    this._maxRows = Math.max(1, coerceNumberInput(value));
  }

  @Input() set minRows(value: NumberInput) {
    this._minRows = Math.max(1, coerceNumberInput(value));
  }


  constructor(private _hostEl: ElementRef<HTMLTextAreaElement>,
              @Inject(PLATFORM_ID) private _platformId: object,
              ngZone: NgZone) {
  }

  ngDoCheck(): void {
    if (!this._init || !isPlatformBrowser(this._platformId)) { return; }
    if (this._wasUpdated) { this._wasUpdated = false; return; }
    this._update();
  }

  ngOnChanges(_: SimpleChanges): void {
    if (this._maxRows) {
      this._maxRows = Math.max(this._minRows, this._maxRows);
    }
  }

  ngOnInit(): void {
    this._init = true;
    this._update();
  }

  @HostListener('input')
  @HostListener('change')
  @HostListener('paste')
  @HostListener('cut')
  @HostListener('copy')
  update(): void {
    this._update();
    this._wasUpdated = true;
  }

  private _update(): void {
    const el = this._hostEl.nativeElement

    if (el.rows < this._minRows) { el.rows = this._minRows; }

    if (el.scrollHeight > el.clientHeight) {
      while (el.scrollHeight > el.clientHeight) {
        if (this._maxRows && el.rows >= this._maxRows) { break; }
        el.rows++;
      }
    } else {
      while(true) {
        if (el.rows === this._minRows) { break; }
        el.rows--;
        if (el.scrollHeight > el.clientHeight) { break; }
      }
      let increaseCount = 0;
      while (el.scrollHeight > el.clientHeight) {
        if (this._maxRows && el.rows >= this._maxRows) { break; }
        el.rows++;
        increaseCount++
      }
      if (increaseCount > 1) { el.rows--; }
    }
  }

}
