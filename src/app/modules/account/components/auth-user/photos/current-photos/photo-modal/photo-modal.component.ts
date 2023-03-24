import { fadeInRightAnimation, fadeInLeftAnimation, fadeOutRightAnimation, fadeOutLeftAnimation } from 'src/app/utils/ng-animations';
import { zoomInAnimation, zoomOutAnimation } from './../../../../../../../utils/ng-animations';
import { transition, trigger, group, query } from '@angular/animations';
import { AfterViewInit,
         ChangeDetectionStrategy,
         ChangeDetectorRef,
         Component,
         ElementRef,
         Inject,
         Input,
         OnDestroy,
         ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { animateElement, AnimationOptions } from 'src/app/utils/animation-helper';

const closeBtnAnimationMetadata = trigger('closeBtn', [
  transition(':enter', zoomInAnimation('300ms', '200ms')),
  transition('true => false', zoomOutAnimation('300ms', '0ms'))
]);

const btnGroupAnimationMetadata = trigger('btnGroup', [
  transition(':enter', [
    group([
      query('button.main-btn', fadeInRightAnimation('300ms', '200ms'), { optional: true }),
      query('button.delete-btn', fadeInLeftAnimation('300ms', '200ms'), { optional: true })
    ])
  ]),
  transition('true => false', [
    group([
      query('button.main-btn', fadeOutRightAnimation('400ms', '0ms'), { optional: true }),
      query('button.delete-btn', fadeOutLeftAnimation('400ms', '0ms'), { optional: true })
    ])
  ])
])

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    closeBtnAnimationMetadata,
    btnGroupAnimationMetadata
  ]
})
export class PhotoModalComponent implements AfterViewInit, OnDestroy  {

  @Input() url!: string
  @Input() index!: number;
  @Input() isMain!: boolean;

  animationState = true;

  @ViewChild('image') imageElRef: ElementRef<HTMLElement> | null = null;

  onSelect = new Subject<string>()
  onDelete = new Subject<number>();
  onClose = new Subject<void>();

  constructor(@Inject('sourceEl') private _sourceEl: HTMLElement,
              private _cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      const targetEl = this.imageElRef!.nativeElement;
      const targetRect = targetEl.getBoundingClientRect();
      const sourceRect= this._sourceEl.getBoundingClientRect();
      this._sourceEl.style.visibility = 'hidden';
      targetEl.style.visibility = 'visible'

      this._applyStyles(targetEl, sourceRect);
      const keyframe = this._getKeyframe(targetRect);

      const options: AnimationOptions = { fill: 'both', duration: 400, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }
      animateElement(targetEl, keyframe, options, () => this._resetStyles(targetEl));
    });
  }


  close(): Observable<void> {
    this.animationState = false;
    this._cdRef.markForCheck();
    requestAnimationFrame(() => {
      const targetEl = this.imageElRef!.nativeElement;
      const targetRect = targetEl.getBoundingClientRect();
      const sourceRect= this._sourceEl.getBoundingClientRect();
      this._sourceEl.style.visibility = 'hidden';

      this._applyStyles(targetEl, targetRect);
      const keyframe = this._getKeyframe(sourceRect);

      const options: AnimationOptions = { fill: 'both', duration: 400, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }
      animateElement(targetEl, keyframe, options, () => {
        this
        this._sourceEl.style.visibility = '';
        targetEl.style.visibility = '';
        this.onClose.next();
      });
    });
    return this.onClose;
  }


  ngOnDestroy(): void {
    this.onClose.complete();
    this.onSelect.complete();
    this.onDelete.complete();
  }

  private _getKeyframe({ left, top, width, height }: DOMRect): PropertyIndexedKeyframes {
    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    }
  }

  private _applyStyles(el: HTMLElement, { left, top, width, height }: DOMRect): void {
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.position = 'fixed';
  }

  private _resetStyles(el: HTMLElement): void {
    el.style.left = '';
    el.style.top = '';
    el.style.width = '';
    el.style.height = '';
    el.style.position = '';
  }

}
