import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { PrivacyComponent } from './components/privacy/privacy.component';



@NgModule({
  declarations: [ PrivacyComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: PrivacyComponent },
    ])
  ]
})
export class PrivacyModule { }
