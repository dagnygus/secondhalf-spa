import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { IntellectualPropertyComponent } from './components/intelectual-property/intellectual-property.component';


@NgModule({
  declarations: [ IntellectualPropertyComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: IntellectualPropertyComponent },
    ])
  ]
})
export class IntellectualPropertyModule { }
