import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent implements OnInit {

  private _size: { width: string; height: string } | null = null;
  private _isInit = false;

  constructor(private _hostElement: ElementRef<HTMLElement>,
              private _renderer: Renderer2) { }

  ngOnInit(): void {
    this._isInit = true;

    if (this._size) {
      this._renderer.setStyle(
        this._hostElement.nativeElement,
        'width',
        this._size.width
      );

      this._renderer.setStyle(
        this._hostElement.nativeElement,
        'height',
        this._size.height
      );
    }
  }

  setSize(width: string, height: string): void {
    this._size = { width, height };

    if (this._isInit) { return; }

    this._renderer.setStyle(
      this._hostElement.nativeElement,
      'width',
      this._size.width
    );

    this._renderer.setStyle(
      this._hostElement.nativeElement,
      'height',
      this._size.height
    );

  }

}
