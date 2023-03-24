import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2, ChangeDetectorRef } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { format } from 'date-fns';
@Directive({
  selector: 'input[datepicker]'
})
export class DatePickerInput {
  private _overlayRef: OverlayRef | null = null

  @Output() dateSelected = new EventEmitter<string>()
  @Input() datepicker: string = ''


  constructor(overlay: Overlay,
              hoslElRef: ElementRef<HTMLInputElement>,
              renderer: Renderer2,
              overlayPositionBuilder: OverlayPositionBuilder,
              cdRef: ChangeDetectorRef) {
    renderer.listen(hoslElRef.nativeElement, 'click', () => {

      if (this._overlayRef) { return; }

      const overlayRef = this._overlayRef = overlay.create({
        hasBackdrop: true,
        positionStrategy: overlayPositionBuilder.global().centerHorizontally().centerVertically()
      })

      const componentRef = overlayRef.attach(new ComponentPortal(MatCalendar<any>));
      overlayRef.backdropClick().subscribe(() => {
        overlayRef.detach()
        this._overlayRef = null;
      });

      componentRef.location.nativeElement.classList.add('calendar');
      componentRef.location.nativeElement.classList.add('mat-elevation-z4');

      componentRef.instance.selectedChange.subscribe((date) => {
        const formatedDate = format(date, this.datepicker);
        this.dateSelected.emit(formatedDate);
        overlayRef.detach()
        this._overlayRef = null;
        cdRef.markForCheck();
      })
    });
  }
}
