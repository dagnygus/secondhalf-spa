/* eslint-disable max-len */
import { environment } from 'src/environments/environment';
import { TokenIntercenptor } from './interceptors/token.interceptor';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideStorage, connectStorageEmulator, getStorage } from '@angular/fire/storage';
import { provideAuth, connectAuthEmulator, getAuth } from '@angular/fire/auth';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { OverlayModule } from '@angular/cdk/overlay';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BackgroundCarouselComponent } from './components/header/background-carousel/background-carousel.component';
import { DynamicBackgroundComponent } from './components/header/dynamic-background/dynamic-background.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { MembersComponent } from './components/members/members.component';
import { MemberPlaceholderComponent } from './components/members/member-placeholder/member-placeholder.component';
import { MemberComponent } from './components/members/member/member.component';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { AsyncValidationOnBlurDirective } from './directives/async-validation-on-blur.directive';
import { PaginationComponent } from './components/pagination/pagination.component';
import { DnngErrorsForDirective } from './directives/dnng-errors-for.directive';
import { AuthUserComponent } from './components/auth-user/auth-user.component';
import { FileAddBtnDirective } from './directives/file-add-btn.directive';
import { FilePickerInputComponent } from './components/file-picker-input/file-picker-input.component';
import { FileRemoveBtnDirective } from './directives/file-remove-btn.directive';
import { AuthUserDetailsComponent } from './components/auth-user/auth-user-details/auth-user-details.component';
import { FocusDirective } from './directives/focus.directive';
import { UserDetailComponent } from './components/auth-user/auth-user-details/user-detail/user-detail.component';
import { MinAgeValidatorDirective } from './directives/min-age-validator.directive';
import { AddressInfoFormComponent } from './components/auth-user/auth-user-details/address-info-form/address-info-form.component';

import { MainImageUrlPipe } from './pipes/main-image-url.pipe';
import { NewPasswordComponent } from './components/auth-user/new-password/new-password.component';
import { PhotosComponent } from './components/auth-user/photos/photos.component';
import { PhotoComponent } from './components/auth-user/photos/current-photos/photo/photo.component';
import { PhotoModalComponent } from './components/auth-user/photos/current-photos/photo-modal/photo-modal.component';
import { MultiFilePickerInputComponent } from './components/multi-file-picker-input/multi-file-picker-input.component';
import { CurrentPhotosComponent } from './components/auth-user/photos/current-photos/current-photos.component';
import { NewPhotosComponent } from './components/auth-user/photos/new-photos/new-photos.component';
import { NewPhotoComponent } from './components/auth-user/photos/new-photos/new-photo/new-photo.component';
import { CameraPictureInputComponent } from './components/camera-picture-input/camera-picture-input.component';
import { SingleMemberComponent } from './components/single-member/single-member.component';
import { BackgroundImgSrcPipe } from './pipes/background-img-src.pipe';
import { LikePipe } from './pipes/like.pipe';
import { SingleMemberChatComponent } from './components/single-member/single-member-chat/single-member-chat.component';
import { SingleMemberInfoComponent } from './components/single-member/single-member-info/single-member-info.component';
import { SingleMemberPhotosComponent } from './components/single-member/single-member-photos/single-member-photos.component';
import { AgePipe } from './pipes/age.pipe';
import { SingleMemberPhotoViewerComponent } from './components/single-member/single-member-photos/single-member-photo-viewer/single-member-photo-viewer.component';
import { SingleMemberPhotosDisplayerComponent } from './components/single-member/single-member-photos/single-member-photos-displayer/single-member-photos-displayer.component';
import { SingleMemberHeaderComponent } from './components/single-member/single-member-header/single-member-header.component';
import { SingleMemberChatTextboxEntryComponent } from './components/single-member/single-member-chat/single-member-chat-textbox-entry/single-member-chat-textbox-entry.component';
import { SingleMemberChatCloudsComponent } from './components/single-member/single-member-chat/single-member-chat-clouds/single-member-chat-clouds.component';
import { TextAreaAutoSizeDirective } from './directives/text-area-auto-size.directive';
import { SingleMemberChatCloudComponent } from './components/single-member/single-member-chat/single-member-chat-clouds/single-member-chat-cloud/single-member-chat-cloud.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationComponent } from './components/notifications/notification/notification.component';
import { LocalCollectionComponent } from './components/local-collection/local-collection.component';
import { LocalForDirective } from './directives/local-for.directive';

import { appReducers, effects, } from './app.ngrx.utils';
import { LazyImageDirective, LazyImageLoadingViewDirective } from './directives/lazy-image.directive';
import { HeaderSignInFormComponent } from './components/header/header-sign-in-form/header-sign-in-form.component';
import { ScrollTargetIdDirective } from './directives/scroll-target-id.directive';
import { ScrollableRouterLinkDirective, ScrollableRouterLinkWithHrefDirective } from './directives/scrollable-router-link.directive';
import { ScrollOnClickToIdDirective } from './directives/scroll-on-click-to-id.directive';
import { GlobalScrollNavigationTargetDirective } from './directives/global-scroll-navigartion-target.directive';
import { MediaSwitchCaseDirective } from './directives/media-switch-case.directive';
import { MediaSwitchDirective } from './directives/media-switch.directive';
import { MediaSwitchDefaultDirective } from './directives/media-switch-default.directive';
import { MediaIfDirective } from './directives/media-if.directive';
import { MediaPipe } from './pipes/media.pipe';
import { MediaQueryDirective } from './directives/media-query.directive';
import { XOverflowScrollDirective } from './directives/x-overflow-scroll.directive';
import { ChatDialogComponent } from './components/chat-dialog/chat-dialog.component';
import { ChatDialogCloudsComponent } from './components/chat-dialog/chat-dialog-clouds/chat-dialog-clouds.component';
import { ChatDialogTextboxEntryComponent } from './components/chat-dialog/chat-dialog-textbox-entry/chat-dialog-textbox-entry.component';
import { HeroDirective } from './directives/hero.directive';
import { AboutComponent } from './components/about/about.component';
import { OpinionsComponent } from './components/opinions/opinions.component';
import { FadeInViewportDirective } from './directives/fade-in-viewport.directive';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { IntellectualPropertyComponent } from './components/intelectual-property/intellectual-property.component';
import { CommunityGuidelinesComponent } from './components/community-guidelines/community-guidelines.component';
import { SafetyTipsComponent } from './components/safety-tips/safety-tips.component';
import { SafetyAndPolicyComponent } from './components/safety-and-policy/safety-and-policy.component';
import { ProductsComponent } from './components/products/products.component';


@NgModule({
  declarations: [
    AppComponent,
    DynamicBackgroundComponent,
    HeaderComponent,
    BackgroundCarouselComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    AuthFormComponent,
    MembersComponent,
    MemberPlaceholderComponent,
    MemberComponent,
    SignInFormComponent,
    AsyncValidationOnBlurDirective,
    PaginationComponent,
    DnngErrorsForDirective,
    AuthUserComponent,
    FileAddBtnDirective,
    FilePickerInputComponent,
    FileRemoveBtnDirective,
    AuthUserDetailsComponent,
    FocusDirective,
    UserDetailComponent,
    MinAgeValidatorDirective,
    MainImageUrlPipe,
    AddressInfoFormComponent,
    NewPasswordComponent,
    PhotosComponent,
    PhotoComponent,
    PhotoModalComponent,
    MultiFilePickerInputComponent,
    CurrentPhotosComponent,
    NewPhotosComponent,
    NewPhotoComponent,
    CameraPictureInputComponent,
    SingleMemberComponent,
    BackgroundImgSrcPipe,
    LikePipe,
    SingleMemberChatComponent,
    SingleMemberInfoComponent,
    SingleMemberPhotosComponent,
    AgePipe,
    SingleMemberPhotoViewerComponent,
    SingleMemberPhotosDisplayerComponent,
    SingleMemberHeaderComponent,
    SingleMemberChatTextboxEntryComponent,
    SingleMemberChatCloudsComponent,
    TextAreaAutoSizeDirective,
    SingleMemberChatCloudComponent,
    LoadingSpinnerComponent,
    NotificationsComponent,
    NotificationComponent,
    LocalCollectionComponent,
    LocalForDirective,
    LazyImageDirective,
    LazyImageLoadingViewDirective,
    HeaderSignInFormComponent,
    ScrollTargetIdDirective,
    ScrollableRouterLinkDirective,
    ScrollableRouterLinkWithHrefDirective,
    ScrollOnClickToIdDirective,
    GlobalScrollNavigationTargetDirective,
    MediaSwitchCaseDirective,
    MediaSwitchDirective,
    MediaSwitchDefaultDirective,
    MediaIfDirective,
    MediaPipe,
    MediaQueryDirective,
    XOverflowScrollDirective,
    ChatDialogComponent,
    ChatDialogCloudsComponent,
    ChatDialogTextboxEntryComponent,
    HeroDirective,
    AboutComponent,
    OpinionsComponent,
    FadeInViewportDirective,
    PrivacyComponent,
    TermsComponent,
    CookiePolicyComponent,
    IntellectualPropertyComponent,
    CommunityGuidelinesComponent,
    SafetyTipsComponent,
    SafetyAndPolicyComponent,
    ProductsComponent
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage();
      connectStorageEmulator(storage, 'localhost', 9199);
      return storage;
    }),
    provideAuth(() => {
      const auth = getAuth();
      connectAuthEmulator(auth, 'http://localhost:9099');
      return auth;
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DpDatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextFieldModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    MatBadgeModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(effects),
    LayoutModule,
    MatListModule,
    OverlayModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenIntercenptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
