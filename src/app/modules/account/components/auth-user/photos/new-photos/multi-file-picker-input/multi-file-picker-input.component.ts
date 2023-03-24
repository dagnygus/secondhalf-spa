import { NgZone } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy,
         Component,
         AfterViewInit,
         Input,
         ViewChild,
         ElementRef,
         ChangeDetectorRef,
         Renderer2,
         EventEmitter,
         Output } from '@angular/core';
import { BooleanInput, coerceBooleanInput } from 'src/app/utils/coerction-and-types';

@Component({
  selector: 'app-multi-file-picker-input',
  templateUrl: './multi-file-picker-input.component.html',
  styleUrls: ['./multi-file-picker-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: MultiFilePickerInputComponent, multi: true } ]
})
export class MultiFilePickerInputComponent implements AfterViewInit, ControlValueAccessor {


  @ViewChild('fileInput') private _fileInput: ElementRef<HTMLInputElement> | null = null;

  private _onChange?: (arg: any) => void;
  private _onTouched?: () => any;
  private _loading = false;
  private _readDataUrl = false;
  private _fileDataUrls: string[] | null = null;
  private _value: readonly File[] | null = null;


  get lenght(): number { return this._value ? this._value.length : 0; }
  get loading(): boolean { return this._loading; }

  @Input()
  set value(files: readonly File[] | null) {
    if (this._value === files) { return; }
    if (files) {
      this._value = null;
      this._setNullOrConcat(files);
    } else if (!files && (this.fileDataUrls.observed || this.filesDeleted.observed)) {
      Promise.resolve().then(() => {
        this._setNullOrConcat(null);
      })
    } else {
      this._setNullOrConcat(null);
    }
  }
  get value(): readonly File[] | null { return this._value; }
  @Input() name?: string;
  @Input() accept?: string;
  @Input()
  set readDataUrl(value: BooleanInput) {
    value = coerceBooleanInput(value);
    if (this._readDataUrl === value) { return; }
    this._readDataUrl = coerceBooleanInput(value);
    if (!value && this._fileDataUrls) {
      this._fileDataUrls = null;
      if (this.fileDataUrls.observed) {
        Promise.resolve().then(() => {
          this.fileDataUrls.emit();
          this.changeDetectorRef.markForCheck();
        })
      }
    }
  }

  @Output() fileDeleted = new EventEmitter<number>();
  @Output() filesDeleted = new EventEmitter<void>();
  @Output() loadFileDataUrlsFailed = new EventEmitter<void>();
  @Output() fileDataUrls = new EventEmitter<readonly string[] | null>();
  @Output() valueChange = new EventEmitter<readonly File[] | null>();


  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly renderer: Renderer2,
              private readonly ngZone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.renderer.listen(
      this._fileInput!.nativeElement,
      'input',
      () => {
        const files = this._fileInput!.nativeElement.files;
        if (!files || files.length === 0) { return; }
        this._setNullOrConcat(Array.from(files));
        this._fileInput!.nativeElement.files = null;
        this._fileInput!.nativeElement.value = '';
      }
    );
  }

  writeValue(value: any): void {
    this._value = null;
    this._fileDataUrls = null;
    this._setNullOrConcat(value, false);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  pickFiles(): void {
    if (!this._fileInput) {
      throw new Error('<app-file-picker-input>: Attempting to pick up file before view initialized! ');
    }
    this._fileInput.nativeElement.click();
    if (this._onTouched) { this._onTouched(); }
  }

  removeFile(index: number): void {
    if (index < 0) { throw new Error('MultiFilePickerInput::deleteFile: Index below 0!!'); }
    if (!this._value) { throw new Error('MultiFilePickerInput::deleteFile: Cannot delete file when value is equel to null!!'); }
    if (index > this.lenght! - 1) { throw new Error('MultiFilePickerInput::deleteFile: Index out of the range!!'); }

    let valueChange = false;
    let fileDataChange = false;

    if (this.lenght === 1) {
      this._setNullOrConcat(null);
    } else {
      this._value = this._value.slice();
      (this._value as File[]).splice(index, 1);
      valueChange = true;
      if (this._readDataUrl) {
        this._fileDataUrls = this._fileDataUrls!.slice();
        (this._fileDataUrls as string[]).splice(index, 1);
        fileDataChange = true;
      }
    }

    if (valueChange) {
      this.valueChange.emit(this._value);
      if (this._onChange) { this._onChange(this._value); }
      this.changeDetectorRef.markForCheck();
    }

    if (fileDataChange) { this.fileDataUrls.emit(this._fileDataUrls); }
    this.fileDeleted.emit(index);
    if (this.lenght === 0) { this.filesDeleted.emit(); }
  }

  removeAllFiles(): void {
    this._setNullOrConcat(null);
  }

  private _setNullOrConcat(newValue: readonly File[] | null, riseOnChange: boolean = true): void {
    if (this._value === newValue) { return; }
    let fileDataChange = false;

    if (newValue) {
      this._value = this._value ? this._value.concat(newValue) : newValue;
      if (this._readDataUrl) {
        this._readAllDataUrlsOfFiles(newValue);
      }
    } else {
      this._value = null;
      fileDataChange = this._readDataUrl && this._fileDataUrls != null;
      this._fileDataUrls = null;
    }

    this._value || Object.freeze(this._value);
    this.valueChange.emit(this._value);
    if (riseOnChange && this._onChange) { this._onChange(this._value); }
    if (fileDataChange) { this.fileDataUrls.emit(this._fileDataUrls); }
    if (!this._value) { this.filesDeleted.emit(); }
    this.changeDetectorRef.markForCheck();
  }

  private _readAllDataUrlsOfFiles(files: FileList | readonly File[]): void {
    const promises: Promise<string | null>[] = new Array(files.length);
    this._loading = true;

    let hasNullResult = false;

    this.ngZone.runOutsideAngular(() => {
      for (let i = 0; i < files.length; i++) {
        promises[i] = this._getBase64(files[i], () => hasNullResult = true);
      }
      Promise.all(promises).then(data => {
        this.ngZone.run(() => {
          if (this._fileDataUrls) {

            if (hasNullResult) {
              data = data.filter(val => val !== null);
            }

            this._fileDataUrls = this._fileDataUrls.concat(data as string[]);
          } else {
            this._fileDataUrls = data.filter(val => val !== null) as string[];
          }

          Object.freeze(this._fileDataUrls);
          this._loading = false;

          this.ngZone.run(() => {
            this.fileDataUrls.emit(this._fileDataUrls);
            this.changeDetectorRef.markForCheck();
          });
        });
      }).catch(() => {
        this.ngZone.run(() => {
          this._loading = false;
          this.loadFileDataUrlsFailed.emit();
          this.changeDetectorRef.markForCheck();
        });
      });
    });
  }

  private _getBase64(file: File, isNullCb?: () => void): Promise<string | null> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        if (!reader.result) { reject(); return; }

        let result: string | null;

        if (reader.result instanceof ArrayBuffer) {
          result = btoa(
            new Uint8Array(reader.result).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
        } else {
          result = reader.result;
        }

        if (isNullCb && result === null) {
          isNullCb();
        }

        resolve(result);
      };
      reader.onerror = () => {
        reject();
      };
      reader.onabort = () => {
        reject();
      };
      reader.readAsDataURL(file);
    });
  }

}
