import { PhotoModalService } from './../../../../services/photo-modal.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy,
         Component,
         Input,
         Output,
         EventEmitter,
         ChangeDetectorRef,
         forwardRef,
         HostBinding,
         OnChanges,
         AfterViewChecked,
         SimpleChanges,
         Injector } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const photoContainerAnimationMetadata = trigger('photoContainer', [
  transition(':enter', [
    query('div.photo', [
      style({ opacity: 0, transform: 'scale(0)' }),
      stagger(150, animate('300ms 300ms', style({ opacity: 1, transform: 'scale(1)' }))),
    ], { optional: true }),
  ]),
]);

const photoAnimationMetadata = trigger('photo', [
  transition(':leave', [
    animate('300ms', style({ opacity: 0, transform: 'scale(0)' }))
  ]),
]);

@Component({
  selector: 'app-current-photos[imagesUrls]',
  templateUrl: './current-photos.component.html',
  styleUrls: ['./current-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ { provide: forwardRef(() => CurrentPhotosMediator), useClass: forwardRef(() => CurrentPhotosMediator) } ],
  animations: [
    photoContainerAnimationMetadata,
    photoAnimationMetadata
  ]
})
export class CurrentPhotosComponent implements OnChanges, AfterViewChecked {

  @Input() mainImageUrl: string | null | undefined;
  @Input() imagesUrls: readonly string[] | null = null;

  @HostBinding('@photoContainer') photoContainerAnimState: any;

  @Output() deleteImage = new EventEmitter<number>();
  @Output() mainImageSelected = new EventEmitter<string>();


  constructor(private _cdRef: ChangeDetectorRef,
              private _photoModalService: PhotoModalService,
              private _injector: Injector) {}

  ngOnChanges(_: SimpleChanges): void {
    this._cdRef.reattach();
  }

  ngAfterViewChecked(): void {
    this._cdRef.detach();
  }

  onPhotoClick(index: number, url: string, element: HTMLElement): void {
    const component = this._photoModalService.openPhotoModal(
      url,
      index,
      this.compareUrls(url, this.mainImageUrl),
      element,
      this._injector
    );

    const parent = element.parentElement!;
    if (parent.childElementCount > 1) {
      ((parent.children.item)(1)as HTMLElement).style.visibility = 'hidden';
      ((parent.children.item)(2)as HTMLElement).style.visibility = 'hidden';
    }

    component.onSelect.subscribe((url) => this.mainImageSelected.emit(url));
    component.onDelete.subscribe((index) => this.deleteImage.emit(index));
    component.onClose.subscribe(() => {
      if (parent.childElementCount > 1) {
        ((parent.children.item)(1)as HTMLElement).style.visibility = '';
        ((parent.children.item)(2)as HTMLElement).style.visibility = '';
      }
    })
  }

  trackBy(_: number, url: string): string {
    return url;
  }

  compareUrls(url1: string | null | undefined, url2: string | null | undefined): boolean {
    if (url1 == null || url2 == null) { return false }
    if (url1 === url2) { return true }
    const name1 = _getImageName(url1);
    const name2 = _getImageName(url2);
    return name1 === name2;
  }

}

export class CurrentPhotosMediator {
  selectedImg$ = new Subject<{ url: string; rect: DOMRect; index: number }>();
  updateRect$ = new Subject<DOMRect>();
  unselect$ = new Subject<void>();
}


function _getImageName(imageUrl: string): string {
  if (environment.funcrtionsEmulator) {

    let index = imageUrl.lastIndexOf('%2F') + 3;
    let imageName = imageUrl.substring(index);

    if (imageName.includes('?')) {
      index = imageName.indexOf('?');
      imageName = imageName.substring(0, index);
    }

    return imageName;
  } else {

    const index1 = imageUrl.lastIndexOf('%2F');
    const index2 = imageUrl.lastIndexOf('?');
    let name = imageUrl.substring(index1 + 3, index2);
    if (name.includes('%3A')) {
        name = (name as any).replaceAll('%3A', ':');
    }
    return name;
  }
}
