import { MembersEffects } from './../../state/members/members.effects';
import { EffectsModule } from '@ngrx/effects';
import { membersReducer } from './../../state/members/members.reducer';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MembersComponent } from './components/members/members.component';
import { MemberComponent } from './components/member/member.component';
import { MemberPlaceholderComponent } from './components/member-placeholder/member-placeholder.component';
import { LocalForDirective } from './directives/local-for.directive';
import { LocalCollectionComponent } from './components/local-collection/local-collection.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { StoreModule } from '@ngrx/store';



@NgModule({
  declarations: [
    MembersComponent,
    MemberComponent,
    MemberPlaceholderComponent,
    LocalForDirective,
    LocalCollectionComponent,
    PaginationComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: MembersComponent, },
    ])
  ]
})
export class MembersModule { }
