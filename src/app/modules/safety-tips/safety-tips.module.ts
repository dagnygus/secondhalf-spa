import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { SafetyTipsComponent } from './components/safety-tips/safety-tips.component';



@NgModule({
  declarations: [ SafetyTipsComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SafetyTipsComponent },
    ])
  ]
})
export class SafetyTipsModule { }
