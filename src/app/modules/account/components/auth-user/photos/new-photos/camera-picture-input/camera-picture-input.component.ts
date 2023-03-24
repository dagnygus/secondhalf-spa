import { Overlay, OverlayRef, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { style, transition, trigger, animate } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef,
         Component,
         NgZone,
         OnInit,
         Inject,
         PLATFORM_ID,
         Renderer2,
         ViewChild,
         Input,
         EventEmitter,
         Output,
         ChangeDetectionStrategy,
         OnDestroy,
         TemplateRef,
         ViewContainerRef} from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';

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
  ],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CameraPictureInputComponent, multi: true }]
})
export class CameraPictureInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private _destroy$ = new Subject<void>()
  private _play = false;
  private _streamWidth = 0;
  private _streamHeight = 0;
  private _destinationWidth = 0;
  private _destinationHeight = 0;
  private _destinationLeft = 0;
  private _destinationTop = 0;
  private _audioSoundEffect?: HTMLAudioElement;
  private _mediaStream?: MediaStream | null;
  private _onChange?: (arg: any) => any ;
  private _onTouched?: () => any;
  private _ovrlayRef: OverlayRef | null = null;
  private _canvasElement: HTMLCanvasElement | null = null;
  private _open = false;

  @ViewChild('canvasTemplate') template?: TemplateRef<any>;

  rippleAnimationState = false;
  fileDataUrl: string | null = null;
  pictureCatched = false;
  videoElement: HTMLVideoElement | null = null;

  private _value: Blob | null = null;

  @Input()
  public get value(): Blob | null {
    return this._value;
  }
  public set value(value: Blob | null) {
    if (this._value === value) { return }
    this._value = value;
    this.valueChange.emit(value);
    if (this._onChange) { this._onChange(value); }
  }

  @Input()
  public get open(): boolean {
    return this._open;
  }
  public set open(value: boolean) {
    if (this._open === value) { return; }
    this._open = value;
    this.openChange.emit(value);
    if (!value) {
      this._clear();
    }
  }

  @Input() name?: string;
  @Input() shutterSoundEffectUrl?: string;
  @Output() readonly accept = new EventEmitter<Blob>();
  @Output() readonly turnOnCameraFailed = new EventEmitter<void>();
  @Output() readonly valueChange = new EventEmitter<Blob | null>();
  @Output() readonly openChange = new EventEmitter<boolean>();

  private context2D: CanvasRenderingContext2D | null = null;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private ngZone: NgZone,
              @Inject(PLATFORM_ID) private _platformId: object,
              private _renderer: Renderer2,
              private _overlay: Overlay,
              private _viewContainerRef: ViewContainerRef,
              private _positionStrategy: OverlayPositionBuilder) {
  }

  writeValue(obj: any): void {
    this._value = obj;
    this.valueChange.emit(obj);
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

    this._initialAudioElement();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  async turnOnCamera(): Promise<void>  {

    if (this._onTouched) { this._onTouched(); }

    try {

       this._mediaStream = await window.navigator.mediaDevices.getUserMedia({ video: true });

       this._ovrlayRef = this._overlay.create({
        hasBackdrop: true,
        positionStrategy: this._positionStrategy.global().centerHorizontally().centerVertically()
       });
       const viewRef = this._ovrlayRef.attach(new TemplatePortal(this.template!, this._viewContainerRef));
       this._canvasElement = (viewRef.rootNodes[0] as HTMLElement).children.item(0) as HTMLCanvasElement;


       this.context2D = this._canvasElement.getContext('2d');


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

       this.open = true;
       this.changeDetectorRef.markForCheck()
    } catch (err) {
      this.turnOnCameraFailed.next();
      this.changeDetectorRef.markForCheck();
    }
  };

  onCancelButtonClick(): void {
    if (!this.pictureCatched) { return; }

    this._play = true;
    this.pictureCatched = false;
    this.ngZone.runOutsideAngular(this._updateCanvas)
  }

  onAcceptButtonClick(): void {
    if (!this.pictureCatched || !this._canvasElement) { return; }

    this.fileDataUrl = this._canvasElement.toDataURL('image/jpg');
    const img = atob(this.fileDataUrl.split(',')[1]);
    const img_buffer: number[] = img.split('').map(char => char.charCodeAt(0));
    const u8image = new Uint8Array(img_buffer);

    this._play = false;
    this.pictureCatched = false;

    this._value = new Blob([ u8image ], { type: 'image/jpg' });
    this.valueChange.emit(this._value);
    this.accept.emit(this._value!);

    this._clear();
  }

  onExitButtonClick(): void {
    this._clear();
  }

  _makePicture(): void {

    if (!this._canvasElement) { return; }

    this._play = false;
    if (this._audioSoundEffect) {
      this._audioSoundEffect.play();
    }
    this.pictureCatched = true;
    this.rippleAnimationState = !this.rippleAnimationState;
    this.changeDetectorRef.markForCheck();
  }

  private _initialAudioElement(): void {

    if (this.shutterSoundEffectUrl == null) { return; }

    this._audioSoundEffect = this._renderer.createElement('audio');
    this._renderer.setProperty(
      this._audioSoundEffect,
      'src',
      this.shutterSoundEffectUrl
    );
  }


  private _clear(): void {
    this._play = false;
    this.pictureCatched = false;

    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.srcObject = null;
    }

    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (this._ovrlayRef) {
      this._ovrlayRef.detach();
      this._ovrlayRef = null;
    }

    this.changeDetectorRef.markForCheck();
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

    if (!this._canvasElement || !this.context2D || !this.videoElement) { return; }

    const ratio = this._streamWidth / this._streamHeight;

    let canvasDesiredWidth: number;
    let canvasDesiredHeight: number;

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

    this._canvasElement.width = canvasDesiredWidth;
    this._canvasElement.height = canvasDesiredHeight;

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
