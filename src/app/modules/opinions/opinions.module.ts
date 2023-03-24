import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { OpinionsComponent } from './components/opinions/opinions.component';
import { FadeInViewportDirective } from './directives/fade-in-viewport.directive';



@NgModule({
  declarations: [
    OpinionsComponent,
    FadeInViewportDirective
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: OpinionsComponent },
    ])
  ]
})
export class OpinionsModule { }
