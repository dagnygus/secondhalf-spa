import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AboutComponent } from './components/about/about.component';



@NgModule({
  declarations: [ AboutComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AboutComponent },
    ])
  ]
})
export class AboutModule { }
