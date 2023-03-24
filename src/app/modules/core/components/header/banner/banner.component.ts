import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { fadeInLeftAnimation, fadeInRightAnimation, fadeInAnimation, zoomInDownAnimation } from 'src/app/utils/ng-animations';

const loginBtnAnimationMetadata = trigger('loginBtn', [
  transition(':enter', fadeInLeftAnimation('400ms', '1s'))
]);

const registerBtnAnimationMetadata = trigger('registerBtn', [
  transition(':enter', fadeInRightAnimation('400ms', '1s'))
]);

const logoutBtnAnimationMetadata = trigger('logoutBtn', [
  transition(':enter', fadeInLeftAnimation('400ms', '1s'))
]);

const accountBtnAnimationMetadata = trigger('accountBtn', [
  transition(':enter', fadeInRightAnimation('400ms', '1s'))
]);

const carousel1AnimationMetadata = trigger('carousel1', [
  transition(':enter', fadeInAnimation('800ms', '500ms'))
]);

const carousel2AnimationMetadata = trigger('carousel2', [
  transition(':enter', fadeInAnimation('800ms', '500ms'))
]);

const headerTitleAnimationMetadata = trigger('title', [
  transition(':enter', zoomInDownAnimation('700ms', '1s'))
]);

const authFormAnimationMetadata = trigger('authForm',[
  transition('false <=> true', animate('5s', keyframes([
    style({ offset: 0, outline: '5px dashed #f4433600' }),
    style({ offset: .1, outline: '5px solid #f44336FF' }),
    style({ offset: .2, outline: '5px dashed #f4433600' }),
    style({ offset: .3, outline: '5px solid #f44336FF' }),
    style({ offset: .4, outline: '5px dashed #f4433600' }),
    style({ offset: .5, outline: '5px solid #f44336FF' }),
    style({ offset: .6, outline: '5px dashed #f4433600' }),
    style({ offset: .7, outline: '5px solid #f44336FF' }),
    style({ offset: .8, outline: '5px dashed #f4433600' }),
    style({ offset: .9, outline: '5px solid #f44336FF' }),
    style({ offset: 1, outline: '5px dashed #f4433600' }),
  ])))
]);

@Component({
  selector: 'app-banner[isAuth][avatarUrl][outlineAnimationState]',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    registerBtnAnimationMetadata,
    loginBtnAnimationMetadata,
    carousel1AnimationMetadata,
    carousel2AnimationMetadata,
    headerTitleAnimationMetadata,
    logoutBtnAnimationMetadata,
    accountBtnAnimationMetadata,
    authFormAnimationMetadata
  ]
})
export class BannerComponent {
  @Input() isAuth!: boolean;
  @Input() avatarUrl!: string | null | undefined;
  @Input() outlineAnimationState!: boolean;

  @Output() logout = new EventEmitter<void>();
}
