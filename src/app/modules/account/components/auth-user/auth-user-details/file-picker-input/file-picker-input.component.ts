import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy,
         Component,
         Input,
         ViewChild,
         ElementRef,
         AfterViewInit,
         Renderer2,
         EventEmitter,
         Output,
         ChangeDetectorRef,
         forwardRef} from '@angular/core';
import { BooleanInput, coerceBooleanInput } from 'src/app/utils/coerction-and-types';

@Component({
  selector: 'app-file-picker-input',
  templateUrl: './file-picker-input.component.html',
  styleUrls: ['./file-picker-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FilePickerInputComponent), multi: true }]
})
export class FilePickerInputComponent implements AfterViewInit, ControlValueAccessor {

  private _onChange?: (arg: any) => any;
  private _onTouched?: () => any;
  private _readDataUrl = false;
  private _fileDataUrl: string | null = null;
  private _loading = false;
  private _value: File | null = null;

  @ViewChild('fileInput') private _fileInput: ElementRef<HTMLInputElement> | null = null;

  @Input() name?: string;
  @Input() accept?: string;
  @Input()
  set readDataUrl(value: BooleanInput) {
    if (this._fileDataUrl === value) { return; }
    this._readDataUrl = coerceBooleanInput(value);
    if (!value && this._fileDataUrl) {
      this._fileDataUrl = null;
      if (this.fileDataUrl.observed) {
        Promise.resolve().then(() => {
          this.fileDataUrl.emit(null);
          this.changeDetectorRef.markForCheck();
        });
      }
    }
  }
  get readDataUrl(): boolean { return this._readDataUrl; }
  @Input()
  set value(file: File | null) {
    if (this._value === file) { return; }
    if (file) {
      this._setValue(this.value);
    } else if (!file && (this.fileDataUrl.observed || this.fileDeleted.observed)) {
      Promise.resolve().then(() => {
        this._setValue(null);
        this.changeDetectorRef.markForCheck()
      });
    } else {
      this._setValue(null);
    }
  };
  get value(): File | null { return this._value; }

  get loading(): boolean { return this._loading; }

  @Output() readonly fileDataUrl = new EventEmitter<string | null>();
  @Output() readonly fileDeleted = new EventEmitter<void>();
  @Output() readonly loadFileDataUrlFailed = new EventEmitter<void>();
  @Output() readonly valueChange = new EventEmitter<File | null>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.renderer.listen(
      this._fileInput!.nativeElement,
      'input',
      () => {
        const files = this._fileInput!.nativeElement.files;
        if (files != null && files.length > 0) {
          this._setValue(files.item(0));
          this._fileInput!.nativeElement.value = '';
        }
      }
    );
  }

  writeValue(obj: any): void { this._setValue(obj, false); }

  registerOnChange(fn: any): void { this._onChange = fn; }

  registerOnTouched(fn: any): void { this._onTouched = fn; }

  removeFile(): void { this._setValue(null) }

  pickFile(): void {
    if (!this._fileInput) {
      throw new Error('<app-file-picker-input>: Attempting to pick up file before view initialized! ');
    }

    this._fileInput.nativeElement.click();
    if (this._onTouched) { this._onTouched(); }
  }

  private _setValue(newValue: File | null, riseOnChange: boolean = true): void {
    if (this._value === newValue) { return; }
    let dataUrlChange = false;

    this._value = newValue;
    if (this._value) {
      if (this._readDataUrl) {
        this._readFileAsDataUrl(this._value);
      }
    } else {
      dataUrlChange = this._readDataUrl && this._fileDataUrl != null;
      this._fileDataUrl = null;
    }

    this.valueChange.emit(this._value);
    if (riseOnChange && this._onChange) { this._onChange(this._value); }
    if (dataUrlChange) { this.fileDataUrl.emit(this._fileDataUrl); }
    if (this._value === null) {  this.fileDeleted.emit(); }
    this.changeDetectorRef.markForCheck();
  }

  private _readFileAsDataUrl(file: File): void {

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

      this.fileDataUrl.emit(this._fileDataUrl);
      this.changeDetectorRef.markForCheck();
    };
    fileReader.onabort = () => {
      this._loading = false;
      this.changeDetectorRef.markForCheck();
    };
    fileReader.onerror = () => {
      this._loading = false;
      this.loadFileDataUrlFailed.emit();
      this.changeDetectorRef.markForCheck()
    };

    fileReader.readAsDataURL(file);
  }

}
