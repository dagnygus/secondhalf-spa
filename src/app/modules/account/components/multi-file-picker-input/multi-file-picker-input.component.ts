import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { removeAt } from '../../../../utils/array-immutable-actions';
import { ControlValueAccessor } from '@angular/forms';
import { ChangeDetectionStrategy,
         Component,
         OnInit,
         AfterViewInit,
         Input,
         ContentChild,
         ViewChild,
         ElementRef,
         ChangeDetectorRef,
         Renderer2,
         EventEmitter,
         Output } from '@angular/core';
import { FileAddBtnDirective } from 'src/app/modules/account/directives/file-add-btn.directive';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-multi-file-picker-input',
  templateUrl: './multi-file-picker-input.component.html',
  styleUrls: ['./multi-file-picker-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiFilePickerInputComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy {

  @ContentChild(FileAddBtnDirective, { static: false }) set addBtn(value: FileAddBtnDirective) {
    this._addBtn = value;
    this._addBtn.onClick.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.fileInput.nativeElement.click();
      if (!this._touched) {
        this._touched = true;
        this._riseOnTouched();
      }
    });
  };

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;

  private _addBtn: FileAddBtnDirective | null = null;
  private _touched = false;
  private _onChange?: (arg: any) => void;
  private _onTouched?: () => any;
  private _loading = false;
  private _readDataUrl = false;
  // private _fileDataUrls: readonly string[] | null = null;
  private _destroy$ = new Subject<void>();

  @Input() value: readonly File[] | null = null;
  @Input() fileDataUrls: readonly string[] | null = null;

  get lenght(): number { return this.value ? this.value.length : 0; }
  get loading(): boolean { return this._loading; }
  get readDataUrl(): boolean { return this._readDataUrl; }
  // get fileDataUrls(): readonly string[] | null { return this._fileDataUrls; }

  @Input() name?: string;
  @Input() accept?: string;
  @Input() clear$?: Observable<unknown>;
  @Input()
  set readDataUrl(value: boolean | '') {
    if (value !== this._readDataUrl) {
      this._readDataUrl = value === '' ? true : value;
    }
  }

  @Output() fileDeleted = new EventEmitter<number>();
  @Output() filesDeleted = new EventEmitter<void>();
  @Output() loadFileDataUrlsFailed = new EventEmitter<void>();
  @Output() fileDataUrlsChange = new EventEmitter<readonly string[] | null>();
  @Output() valueChange = new EventEmitter<readonly File[] | null>();


  constructor(private changeDetectorRef: ChangeDetectorRef,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    if (this.clear$) {
      this.clear$.pipe(takeUntil(this._destroy$)).subscribe(this.removeAllFiles.bind(this));
    }
  }

  ngAfterViewInit(): void {
    this.renderer.listen(
      this.fileInput.nativeElement,
      'input',
      () => this._onInput()
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  removeFile(index: number): void {
    if (index < 0) { throw new Error('MultiFilePickerInput::deleteFile: Index below 0!!'); }
    console.log(this.value);
    if (!this.value) { throw new Error('MultiFilePickerInput::deleteFile: Cannot delete file when value is equel to null!!'); }
    if (index > this.lenght! - 1) { throw new Error('MultiFilePickerInput::deleteFile: Index out of the range!!'); }

    if (this.lenght! === 1) {
      this._setNullOrAddValue(null);
    } else {
      this.value = removeAt(this.value!, index);
      if (this._readDataUrl) {
        this.fileDataUrls = removeAt(this.fileDataUrls!, index);
      }
      this._riseOnChange();
      this._riseValueChange();
    }

    this._riseFileDeleted(index);

    if (this.lenght === 0) {
      this._riseFilesDeleted();
    }

    this.changeDetectorRef.markForCheck();
  }

  removeAllFiles(): void {
    if (!this.value) { return; }

    this._setNullOrAddValue(null);
    this._riseFilesDeleted();

    this.changeDetectorRef.markForCheck();
  }

  private _setNullOrAddValue(newValue: File[] | null): void {
    if (this.value === newValue) { return; }

    if (this.value && newValue) {

      this.value = this.value.concat(newValue);
      if (this.readDataUrl) {
        this._readAllDataUrlsOfFiles(newValue);
      }

    } else if (!this.value && newValue) {

      this.value = newValue;
      if (this.readDataUrl) {
        this._readAllDataUrlsOfFiles(newValue);
      }

    } else {

      this.value = null;
      if (this._readDataUrl) {
        this.fileDataUrls = null;
        this._riseFileDataUrlChange();
      }
    }

    if (this.value) {
      Object.freeze(this.value);
    }
    this._riseOnChange();
    this._riseValueChange();

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
    if (this.fileDataUrlsChange.observers.length < 1) { return; }
    this.fileDataUrlsChange.emit(this.fileDataUrls);
  }

  private _riseFileDeleted(index: number): void {
    if (this.fileDeleted.observers.length < 1) { return; }
    this.fileDeleted.emit(index);
  }

  private _riseFilesDeleted(): void {
    if (this.filesDeleted.observers.length < 1) { return; }
    this.filesDeleted.emit();
  }

  private _riseLoadFileDataUrlsFailed(): void {
    if (this.loadFileDataUrlsFailed.observers.length < 1) { return; }
    this.loadFileDataUrlsFailed.emit();
  }

  private _onInput(): void {
    if (!this.fileInput.nativeElement.files) { return; }
    if (this.fileInput.nativeElement.files.length <= 0) { return; }

    const newFileList = this.fileInput.nativeElement.files;

    console.log(newFileList);

    this._setNullOrAddValue(Array.from(newFileList));

    this.fileInput.nativeElement.files = null;
    this.fileInput.nativeElement.value = '';

    this.changeDetectorRef.markForCheck();
  }

  private _readAllDataUrlsOfFiles(files: FileList | File[]): void {
    const promises: Promise<string | null>[] = new Array(files.length);

    this._loading = true;
    this.changeDetectorRef.markForCheck();

    let hasNullResult = false;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < files.length; i++) {
      promises[i] = this._getBase64(files[i], () => hasNullResult = true);
    }

    Promise.all(promises).then(data => {
      if (this.fileDataUrls) {

        if (hasNullResult) {
          data = data.filter(val => val !== null);
        }

        this.fileDataUrls = this.fileDataUrls.concat(data as string[]);
      } else {
        this.fileDataUrls = data.filter(val => val !== null) as string[];
      }

      Object.freeze(this.fileDataUrls);
      this._loading = false;


      this._riseFileDataUrlChange();
      this.changeDetectorRef.markForCheck();

    }).catch(() => {
      this._loading = false;
      this._riseLoadFileDataUrlsFailed();
      this.changeDetectorRef.markForCheck();
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
