/* eslint-disable @typescript-eslint/naming-convention */
import { AsyncValidationOnBlurDirective } from './directives/async-validation-on-blur.directive';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatDialogCloudsComponent } from 'src/app/modules/shared/components/chat-dialog/chat-dialog-clouds/chat-dialog-clouds.component';
import { ChatDialogTextboxEntryComponent } from 'src/app/modules/shared/components/chat-dialog/chat-dialog-textbox-entry/chat-dialog-textbox-entry.component';
import { ChatDialogComponent } from 'src/app/modules/shared/components/chat-dialog/chat-dialog.component';
import { LazyImageDirective, LazyImageLoadingViewDirective } from './directives/lazy-image.directive';
import { MediaIfDirective } from './directives/media-if.directive';
import { MediaQueryDirective } from './directives/media-query.directive';
import { MediaSwitch, MediaSwitchCase, MediaSwitchDefault  } from './directives/media-switch.directive';
import { HeroDirective } from './directives/hero.directive';
import { TextAreaAutoSizeDirective } from './directives/text-area-auto-size.directive';
import { RouterModule } from '@angular/router';
import { FirstKeyOfDirective } from './directives/first-key-of.directive';
import { DatePickerInput } from './directives/date-picker-input.directive';
import { AssertPipe } from './pipes/assert.pipe';
import { EquelsPipe } from './pipes/equels.pipe';
import { ToStringPipe } from './pipes/to-string.pipe';
import { ToogleOverflowDirective } from '../notifications/directives/toogle-overflow.directive';

const declarations: any[] = [
  LoadingSpinnerComponent,
    ChatDialogComponent,
    ChatDialogCloudsComponent,
    ChatDialogTextboxEntryComponent,
    LazyImageDirective,
    LazyImageLoadingViewDirective,
    HeroDirective,
    MediaSwitch,
    MediaSwitchCase,
    MediaSwitchDefault,
    MediaIfDirective,
    MediaPipe,
    MediaQueryDirective,
    TextAreaAutoSizeDirective,
    AsyncValidationOnBlurDirective,
    MainImageUrlPipe,
    AgePipe,
    FirstKeyOfDirective,
    DatePickerInput,
    AssertPipe,
    EquelsPipe,
    ToStringPipe,
];

const imports: any[] = [
  CommonModule,
  RouterModule,
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
];

const exports = declarations.concat(imports);

@NgModule({
  declarations,
  imports,
  exports,
})
export class SharedModule { }
