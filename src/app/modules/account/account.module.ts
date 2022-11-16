import { FocusDirective } from './directives/focus.directive';
import { AddressInfoFormComponent } from './components/auth-user-details/address-info-form/address-info-form.component';
import { UserDetailComponent } from './components/auth-user-details/user-detail/user-detail.component';
import { FileRemoveBtnDirective } from './directives/file-remove-btn.directive';
import { AuthGuard } from './../../guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthUserComponent } from './components/auth-user/auth-user.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { PhotosComponent } from './components/photos/photos.component';
import { PhotoComponent } from './components/current-photos/photo/photo.component';
import { PhotoModalComponent } from './components/current-photos/photo-modal/photo-modal.component';
import { CurrentPhotosComponent } from './components/current-photos/current-photos.component';
import { NewPhotosComponent } from './components/new-photos/new-photos.component';
import { NewPhotoComponent } from './components/new-photos/new-photo/new-photo.component';
import { AuthUserDetailsComponent } from './components/auth-user-details/auth-user-details.component';
import { SharedModule } from '../shared/shared.module';
import { FilePickerInputComponent } from './components/file-picker-input/file-picker-input.component';
import { MultiFilePickerInputComponent } from './components/multi-file-picker-input/multi-file-picker-input.component';
import { CameraPictureInputComponent } from './components/camera-picture-input/camera-picture-input.component';
import { FileAddBtnDirective } from './directives/file-add-btn.directive';

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
    PhotoComponent,
    PhotoModalComponent,
    CurrentPhotosComponent,
    NewPhotosComponent,
    NewPhotoComponent,
    FilePickerInputComponent,
    MultiFilePickerInputComponent,
    CameraPictureInputComponent,
    FileAddBtnDirective,
    FileRemoveBtnDirective,
    FocusDirective
  ],
  imports: [
    RouterModule.forChild(routers),
    SharedModule,
  ]
})
export class AccountModule { }
