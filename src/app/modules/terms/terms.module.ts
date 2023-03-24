import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { TermsComponent } from './components/terms/terms.component';



@NgModule({
  declarations: [ TermsComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'terms', component: TermsComponent },
    ])
  ]
})
export class TermsModule { }
