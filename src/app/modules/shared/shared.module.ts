import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
/* eslint-disable @typescript-eslint/naming-convention */
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AsyncValidationOnBlurDirective } from './directives/async-validation-on-blur.directive';
import { DnngErrorsForDirective } from './directives/dnng-errors-for.directive';
import { AgePipe } from './pipes/age.pipe';
import { MainImageUrlPipe } from './pipes/main-image-url.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MediaPipe } from 'src/app/modules/shared/pipes/media.pipe';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { ChatDialogCloudsComponent } from 'src/app/modules/shared/components/chat-dialog/chat-dialog-clouds/chat-dialog-clouds.component';
// eslint-disable-next-line max-len
import { ChatDialogTextboxEntryComponent } from 'src/app/modules/shared/components/chat-dialog/chat-dialog-textbox-entry/chat-dialog-textbox-entry.component';
import { ChatDialogComponent } from 'src/app/modules/shared/components/chat-dialog/chat-dialog.component';
import { GlobalScrollNavigationTargetDirective } from './directives/global-scroll-navigartion-target.directive';
import { LazyImageDirective, LazyImageLoadingViewDirective } from './directives/lazy-image.directive';
import { MediaIfDirective } from './directives/media-if.directive';
import { MediaQueryDirective } from './directives/media-query.directive';
import { MediaSwitchCaseDirective } from './directives/media-switch-case.directive';
import { MediaSwitchDefaultDirective } from './directives/media-switch-default.directive';
import { MediaSwitchDirective } from './directives/media-switch.directive';
import { ScrollOnClickToIdDirective } from './directives/scroll-on-click-to-id.directive';
import { ScrollTargetIdDirective } from './directives/scroll-target-id.directive';
import { ScrollableRouterLinkDirective, ScrollableRouterLinkWithHrefDirective } from './directives/scrollable-router-link.directive';
import { XOverflowScrollDirective } from './directives/x-overflow-scroll.directive';
import { HeroDirective } from './directives/hero.directive';
import { TextAreaAutoSizeDirective } from './directives/text-area-auto-size.directive';
import { MinAgeValidatorDirective } from './directives/min-age-validator.directive';

const declarations: any[] = [
  LoadingSpinnerComponent,
    ChatDialogComponent,
    ChatDialogCloudsComponent,
    ChatDialogTextboxEntryComponent,
    ScrollableRouterLinkDirective,
    ScrollableRouterLinkWithHrefDirective,
    ScrollOnClickToIdDirective,
    GlobalScrollNavigationTargetDirective,
    ScrollTargetIdDirective,
    LazyImageDirective,
    LazyImageLoadingViewDirective,
    HeroDirective,
    MediaSwitchCaseDirective,
    MediaSwitchDirective,
    MediaSwitchDefaultDirective,
    MediaIfDirective,
    MediaPipe,
    MediaQueryDirective,
    TextAreaAutoSizeDirective,
    XOverflowScrollDirective,
    DnngErrorsForDirective,
    AsyncValidationOnBlurDirective,
    MinAgeValidatorDirective,
    MainImageUrlPipe,
    AgePipe,
];

const imports: any[] = [
  CommonModule,
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
  LayoutModule,
  MatListModule,
  OverlayModule,
  MatRadioModule,
  FormsModule,
  ReactiveFormsModule,
  RxReactiveFormsModule,
];

const exports = declarations.concat(imports);

@NgModule({
  declarations,
  imports,
  exports,
})
export class SharedModule { }
