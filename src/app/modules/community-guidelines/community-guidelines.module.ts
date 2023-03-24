import { RouterModule } from '@angular/router';
import { CommunityGuidelinesComponent } from './components/community-guidelines/community-guidelines.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [ CommunityGuidelinesComponent ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CommunityGuidelinesComponent },
    ])
  ]
})
export class CommunityGuidelinesModule { }
