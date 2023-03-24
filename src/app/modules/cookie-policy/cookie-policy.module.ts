import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';



@NgModule({
  declarations: [ CookiePolicyComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CookiePolicyComponent },
    ])
  ]
})
export class CookiePolicyModule { }
