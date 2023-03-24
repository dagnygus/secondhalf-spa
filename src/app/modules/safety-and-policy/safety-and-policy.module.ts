import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { SafetyAndPolicyComponent } from './components/safety-and-policy/safety-and-policy.component';



@NgModule({
  declarations: [ SafetyAndPolicyComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SafetyAndPolicyComponent },
    ])
  ]
})
export class SafetyAndPolicyModule { }
