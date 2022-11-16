import { takeUntil } from 'rxjs/operators';
/* eslint-disable @typescript-eslint/member-ordering */
import { FileAddBtnDirective } from '../../directives/file-add-btn.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy,
         Component,
         ContentChild,
         Input,
         ViewChild,
         ElementRef,
         AfterViewInit,
         Renderer2,
         EventEmitter,
         Output,
         ChangeDetectorRef,
         forwardRef,
         OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';
import { FileRemoveBtnDirective } from '../../directives/file-remove-btn.directive';

@Component({
  selector: 'app-file-picker-input',
  templateUrl: './file-picker-input.component.html',
  styleUrls: ['./file-picker-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FilePickerInputComponent), multi: true }]
})
export class FilePickerInputComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {

  private _touched = false;
  private _onChange?: (arg: any) => any;
  private _onTouched?: () => any;
  private _readDataUrl = false;
  private _fileDataUrl: string | null = null;
  private _loading = false;
  private _destroy$ = new Subject<void>();

  private _addBtn: FileAddBtnDirective | null = null;
  private _removeBtn: FileRemoveBtnDirective | null = null;

  @ContentChild(FileAddBtnDirective, { static: false }) set addBtn(value: FileAddBtnDirective) {
    this._addBtn = value;
    this._addBtn.onClick.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.fileInput.nativeElement.click();
      if (!this._touched) {
        this._touched = true;
        this._riseOnTouched();
      }
    });
  }
  @ContentChild(FileRemoveBtnDirective, { static: false }) set removeBtn(value: FileRemoveBtnDirective) {
    this._removeBtn = value;
    this._removeBtn.onClick.pipe(takeUntil(this._destroy$)).subscribe(() => {

      this._fileDataUrl = null;
      this._setValue(null);
      this.renderer.setProperty(
      this.fileInput.nativeElement,
        'value',
        ''
      );

      this._riseFileDeleted();
    });
  };

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;

  @Input() name?: string;
  @Input() accept?: string;

  value: File | null = null;

  get loading(): boolean { return this._loading; }

  @Input()
  set readDataUrl(value: boolean | '') {
    if (value !== this._readDataUrl) {
      this._readDataUrl = value === '' ? true : value;
    }
  }
  get readDataUrl(): boolean {
    return this._readDataUrl;
  }

  @Output() fileDataUrlChange = new EventEmitter<string | null>();
  @Output() fileDeleted = new EventEmitter<void>();
  @Output() loadFileDataUrlFailed = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<File | null>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.renderer.listen(
      this.fileInput.nativeElement,
      'input',
      this._onInput.bind(this)
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  writeValue(obj: any): void {
    if (!_isFileOrNull(obj)) {
      throw new Error('FilePickerInput: Invalid value type. Only allaw Blob or File');
    }

    this._setValue(obj);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  private _setValue(newValue: File | null): void {
    if (this.value !== newValue) {
      this.value = newValue;
      if (this.value) {
        if (this._readDataUrl) {
          this.readFileAsDataUrl(this.value);
        }
        else {
          this._fileDataUrl = null;
        }
      } else {
        if (this._readDataUrl) {
          this._fileDataUrl = null;
          this._riseFileDataUrlChange();
        }
      }
      this._riseOnChange();
      this._riseValueChange();
    }
  }

  private _riseOnChange(): void {
    if (this._onChange) { this._onChange(this.value); }
  }

  private _riseValueChange(): void {
    if (this.valueChange.observers.length < 1) { return; }
    this.valueChange.emit(this.value);
  }

  private _riseOnTouched(): void {
    if (this._onTouched) { this._onTouched(); }
  }

  private _riseFileDataUrlChange(): void {
    if (this.fileDataUrlChange.observers.length < 1) { return; }
    this.fileDataUrlChange.emit(this._fileDataUrl);
  }

  private _riseLoadFileDataUrlFailed(): void {
    if (this.loadFileDataUrlFailed.observers.length < 1) { return; }
    this.loadFileDataUrlFailed.emit();
  }

  private _riseFileDeleted(): void {
    if (this.fileDeleted.observers.length < 1) { return; }
    this.fileDeleted.emit();
  }

  private _onInput(): void {

    const value = this.fileInput.nativeElement.files;

    if (!value) {
      return;
    }

    if (value.length === 0) {
      return;
    }

    this._setValue(value.item(0));

  }

  private readFileAsDataUrl(file: File): void {

    const fileReader = new FileReader();
    this._loading = true;

    fileReader.onload = (event) => {
      this._loading = false;

      const result = event.target && event.target.result;

      if (result instanceof ArrayBuffer) {
        this._fileDataUrl = btoa(
          new Uint8Array(result).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      } else {
        this._fileDataUrl = result;
      }

      this._riseFileDataUrlChange();
      this.changeDetectorRef.markForCheck();
    };
    fileReader.onabort = () => {
      this._loading = false;
      this.changeDetectorRef.markForCheck();
    };
    fileReader.onerror = () => {
      this._loading = false;
      this._riseLoadFileDataUrlFailed();
      this.changeDetectorRef.markForCheck();
    };

    fileReader.readAsDataURL(file);
  }

}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function _isFileOrNull(value: any): value is File | null {

  if (value === null) {
    return true;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Blob.prototype || prototype === File.prototype;
}
