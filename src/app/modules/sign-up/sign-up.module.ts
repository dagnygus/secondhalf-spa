import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { UnauthGourd } from 'src/app/guards/unauth.guard';
import { SignUpService } from './services/sign-up.service';



@NgModule({
  declarations: [ AuthFormComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AuthFormComponent, canActivate: [ UnauthGourd ] },
    ])
  ],
  providers: [ SignUpService ]
})
export class SignUpModule { }
