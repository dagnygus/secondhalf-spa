import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { UnauthGourd } from 'src/app/guards/unauth.guard';
import { SignInGuard } from 'src/app/guards/sign-in.guard';



@NgModule({
  declarations: [SignInFormComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SignInFormComponent, canActivate: [UnauthGourd, SignInGuard] },
    ])
  ]
})
export class SignInModule { }
