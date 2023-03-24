import { FocusDirective } from './directives/focus.directive';
import { AddressInfoFormComponent } from './components/auth-user/auth-user-details/address-info-form/address-info-form.component';
import { UserDetailComponent } from './components/auth-user/auth-user-details/auth-user-field-list/user-detail/user-detail.component';
import { FileRemoveBtnDirective } from './directives/file-remove-btn.directive';
import { AuthGuard } from './../../guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthUserComponent } from './components/auth-user/auth-user.component';
import { NewPasswordComponent } from './components/auth-user/new-password/new-password.component';
import { PhotosComponent } from './components/auth-user/photos/photos.component';
import { PhotoModalComponent } from './components/auth-user/photos/current-photos/photo-modal/photo-modal.component';
import { CurrentPhotosComponent } from './components/auth-user/photos/current-photos/current-photos.component';
import { NewPhotosComponent } from './components/auth-user/photos/new-photos/new-photos.component';
import { AuthUserDetailsComponent } from './components/auth-user/auth-user-details/auth-user-details.component';
import { SharedModule } from '../shared/shared.module';
import { FilePickerInputComponent } from './components/auth-user/auth-user-details/file-picker-input/file-picker-input.component';
import { MultiFilePickerInputComponent } from './components/auth-user/photos/new-photos/multi-file-picker-input/multi-file-picker-input.component';
import { CameraPictureInputComponent } from './components/auth-user/photos/new-photos/camera-picture-input/camera-picture-input.component';
import { FileAddBtnDirective } from './directives/file-add-btn.directive';
import { AddressInfoService } from './services/address-info.service';
import { UserDetailsService } from './services/user-details.service';
import { AuthUserFieldListComponent } from './components/auth-user/auth-user-details/auth-user-field-list/auth-user-field-list.component';
import { AvatarFieldComponent } from './components/auth-user/auth-user-details/avatar-field/avatar-field.component';
import { NewPhotoListComponent } from './components/auth-user/photos/new-photos/new-photo-list/new-photo-list.component';
import { PhotoModalService } from './services/photo-modal.service';

const routers: Routes = [
  {
    path: '',
    component: AuthUserComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'details', component: AuthUserDetailsComponent },
      { path: 'newpassword', component: NewPasswordComponent },
      { path: 'photos', component: PhotosComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AuthUserComponent,
    AuthUserDetailsComponent,
    AddressInfoFormComponent,
    UserDetailComponent,
    NewPasswordComponent,
    PhotosComponent,
    PhotoModalComponent,
    CurrentPhotosComponent,
    NewPhotosComponent,
    FilePickerInputComponent,
    MultiFilePickerInputComponent,
    CameraPictureInputComponent,
    FileAddBtnDirective,
    FileRemoveBtnDirective,
    FocusDirective,
    AuthUserFieldListComponent,
    AvatarFieldComponent,
    NewPhotoListComponent
  ],
  imports: [
    RouterModule.forChild(routers),
    SharedModule,
  ],
  providers: [ AddressInfoService, UserDetailsService, PhotoModalService ]
})
export class AccountModule { }
