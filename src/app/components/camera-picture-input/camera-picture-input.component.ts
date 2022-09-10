/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Destroyable } from './../../my-package/core/destroyable';
import { unsubscribeWith } from 'src/app/my-package/core/rxjs-operators';
import { style, transition, trigger, animate } from '@angular/animations';
import { FileAddBtnDirective } from 'src/app/directives/file-add-btn.directive';
import { ControlValueAccessor } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef,
         Component,
         NgZone,
         OnInit,
         Inject,
         PLATFORM_ID,
         Renderer2,
         ViewChild,
         ElementRef,
         Input,
         EventEmitter,
         Output,
         ContentChild,
         ChangeDetectionStrategy,
         AfterContentChecked} from '@angular/core';
import { Observable } from 'rxjs';

const containerAnimationMetadata = trigger('container', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0) rotateY(0)' }),
    animate('800ms ease-out', style({ opacity: 1, transform: 'scale(1) rotateY(720deg)' }))
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'scale(1) rotateY(720deg)' }),
    animate('800ms ease-out', style({ opacity: 0, transform: 'scale(0) rotateY(0)' }))
  ])
]);

const ripleAnimationMetadata = trigger('ripple', [
  transition('* <=> *', [
    style({ transform: 'scale(0)' }),
    animate('500ms', style({ transform: 'scale(2)' }))
  ])
]);

@Component({
  selector: 'app-camera-picture-input',
  templateUrl: './camera-picture-input.component.html',
  styleUrls: ['./camera-picture-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    containerAnimationMetadata,
    ripleAnimationMetadata
  ]
})
export class CameraPictureInputComponent extends Destroyable implements OnInit, AfterContentChecked, ControlValueAccessor {

  private _play = false;
  private _streamWidth = 0;
  private _streamHeight = 0;
  private _destinationWidth = 0;
  private _destinationHeight = 0;
  private _destinationLeft = 0;
  private _destinationTop = 0;
  private _audioSoundEffect?: HTMLAudioElement;
  private _mediaStream?: MediaStream;
  private _onChange?: (arg: any) => any ;
  private _onTouched?: () => any;
  private _addFileBtnAlias?: FileAddBtnDirective;

  @ViewChild('canvas') private canvasRef?: ElementRef<HTMLCanvasElement>;
  @ContentChild(FileAddBtnDirective, { static: false }) private _addFileBtn?: FileAddBtnDirective;

  rippleAnimationState = false;
  fileDataUrl: string | null = null;
  pictureCatched = false;
  showCanvas = false;
  value: Blob | null = null;
  videoElement: HTMLVideoElement | null = null;

  @Input() name?: string;
  @Input() uploaded$?: Observable<void>;
  @Input() shutterSoundEffectUrl?: string;
  @Output() readonly accept = new EventEmitter<Blob>();
  @Output() readonly turnOnCameraFailed = new EventEmitter<void>();

  private context2D: CanvasRenderingContext2D | null = null;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private ngZone: NgZone,
              @Inject(PLATFORM_ID) private _platformId: object,
              private _renderer: Renderer2) {
    super();
  }

  writeValue(obj: any): void {

    if (!_isBlobOrFileOrNull(obj)) {
      throw new Error('CameraPictureInput: Invalid value type. Only allaw Blob or File');
    }

    this._setValue(obj);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this._platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this._renderer.listen(
          window,
          'resize',
          this._calculateResolution.bind(this)
        );
      });
    }

    if (this.uploaded$) {
      this.uploaded$.pipe(unsubscribeWith(this)).subscribe(() => {
        this._clear();
        this.changeDetectorRef.markForCheck();
        if (this.ngZone.isStable) {
          this.ngZone.onMicrotaskEmpty.emit();
        }
      });
    }

    this.initialAudioElement();
  }

  ngAfterContentChecked(): void {
    if (this._addFileBtn && this._addFileBtnAlias !== this._addFileBtn) {
      this._addFileBtnAlias = this._addFileBtn;
      this._addFileBtn.onClick.pipe(unsubscribeWith(this)).subscribe(this.turnOnCamera);
    }
  }

  private _setValue(newValue: Blob | null): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this._riseOnChange();
    }
  }

  private _riseOnChange(): void {
    if (this._onChange) {
      this._onChange(this.value);
    }
  }
  private _riseOnTouched(): void {
    if (this._onTouched) { this._onTouched(); }
  }

  private initialAudioElement(): void {

    if (this.shutterSoundEffectUrl == null) { return; }

    this._audioSoundEffect = this._renderer.createElement('audio');
    this._renderer.setProperty(
      this._audioSoundEffect,
      'src',
      this.shutterSoundEffectUrl
    );
  }

  makePicture(): void {

    if (!this.canvasRef) { return; }

    this._play = false;
    if (this._audioSoundEffect) {
      this._audioSoundEffect.play();
    }
    this.pictureCatched = true;
    this.rippleAnimationState = !this.rippleAnimationState;
    this._riseOnTouched();

    this.changeDetectorRef.markForCheck();
  }

  private turnOnCamera: () => Promise<void> = async () => {
    if (!isPlatformBrowser(this._platformId)) { return; }

    try {

       this._mediaStream = await window.navigator.mediaDevices.getUserMedia({ video: true });
       this.showCanvas = true;

       this.changeDetectorRef.detectChanges();

       this.context2D = this.canvasRef!.nativeElement.getContext('2d');


       this._streamWidth = this._mediaStream.getVideoTracks()[0].getSettings().width!;
       this._streamHeight = this._mediaStream.getVideoTracks()[0].getSettings().height!;

       if (!this.videoElement) {
         this.videoElement = this._renderer.createElement('video') as HTMLVideoElement;
       }

       this.videoElement.srcObject = this._mediaStream;

       this._calculateResolution();

       this.videoElement.play();
       this._play = true;

       this.ngZone.runOutsideAngular(() => {
        this._renderer.listen(
          this.videoElement,
          'loadeddata',
          this._updateCanvas
        );
       });

    } catch (err) {
      this.turnOnCameraFailed.next();
      this.changeDetectorRef.markForCheck();
      if (this.ngZone.isStable) {
        this.ngZone.onMicrotaskEmpty.emit();
      }
    }
  };

  onCancelButtonClick(): void {

    if (!this.pictureCatched) { return; }

    this._play = true;
    this.pictureCatched = false;
    this._updateCanvas();

    this.changeDetectorRef.markForCheck();
    if (this.ngZone.isStable) {
      this.ngZone.onMicrotaskEmpty.emit();
    }
  }

  onAcceptButtonClick(): void {
    if (!this.pictureCatched || !this.canvasRef) { return; }

    this.fileDataUrl = this.canvasRef.nativeElement.toDataURL('image/jpg');
    const img = atob(this.fileDataUrl.split(',')[1]);
    const img_buffer: number[] = img.split('').map(char => char.charCodeAt(0));
    const u8image = new Uint8Array(img_buffer);

    this._play = false;
    this.pictureCatched = false;
    this.showCanvas = false;

    this._riseOnChange();
    this._setValue(new Blob([ u8image ], { type: 'image/jpg' }));
    this.accept.emit(this.value!);

    if (this.uploaded$) { return; }

    this._clear();
  }

  onExitButtonClick(): void {
    this._clear();
  }



  private _clear(): void {
    this._play = false;
    this.pictureCatched = false;
    this.showCanvas = false;

    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.srcObject = null;
    }

    if (this._mediaStream) {
      this._mediaStream.getTracks()[0].stop();
    }
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.markForCheck();
    if (this.ngZone.isStable) {
      this.ngZone.onMicrotaskEmpty.emit();
    }
  }

  private _updateCanvas: () => void = () => {

    if (!this.context2D || !this.videoElement) { return; }

    this.context2D.drawImage(
      this.videoElement,
      this._destinationLeft,
      this._destinationTop,
      this._destinationWidth,
      this._destinationHeight
    );

    if (this._play) {
      requestAnimationFrame(this._updateCanvas);
    }
  };

  private _calculateResolution(): void {

    if (!this.canvasRef || !this.context2D || !this.videoElement) { return; }

    const ratio = this._streamWidth / this._streamHeight;

    let canvasDesiredWidth: number;
    let canvasDesiredHeight: number;

    // const limitedWidth = Math.min(window.innerWidth, window.innerHeight);
    console.log(window.innerWidth, window.innerHeight);

    if (window.innerHeight > window.innerWidth) {
      canvasDesiredWidth = window.innerWidth * .95;
      canvasDesiredHeight = canvasDesiredWidth * (4 / 3);

      if (canvasDesiredHeight > window.innerHeight * .95) {
        canvasDesiredHeight = window.innerHeight * .95;
        canvasDesiredWidth = canvasDesiredHeight * (3 / 4);
      }

    } else {
      canvasDesiredHeight = window.innerHeight * .95;
      canvasDesiredWidth = canvasDesiredHeight * (3 / 4);

      if (canvasDesiredWidth > window.innerWidth * .95) {
        canvasDesiredWidth = window.innerWidth * .95;
        canvasDesiredHeight = canvasDesiredWidth * (4 / 3);
      }
    }

    // canvasDesiredWidth = limitedWidth * .95 ;
    // canvasDesiredHeight = canvasDesiredWidth * (4 / 3);

    this.canvasRef.nativeElement.width = canvasDesiredWidth;
    this.canvasRef.nativeElement.height = canvasDesiredHeight;

    this._destinationWidth = canvasDesiredWidth;
    this._destinationHeight = this._destinationWidth / ratio;
    if (this._destinationHeight < canvasDesiredHeight) {
      this._destinationHeight = canvasDesiredHeight;
      this._destinationWidth = this._destinationHeight * ratio;
    }
    this._destinationLeft = this._destinationWidth > canvasDesiredWidth ? (canvasDesiredWidth - this._destinationWidth) / 2 : 0;
    this._destinationTop = this._destinationHeight > canvasDesiredHeight ? (canvasDesiredHeight - this._destinationHeight) / 2 : 0;
  }

}


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function _isBlobOrFileOrNull(value: any): value is Blob | File | null {

  if (value === null) {
    return true;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Blob.prototype || prototype === File.prototype;
}
