import { MembersEffects } from './../../state/members/members.effects';
import { EffectsModule } from '@ngrx/effects';
import { membersReducer } from './../../state/members/members.reducer';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MembersComponent } from './components/members/members.component';
import { MemberComponent } from './components/members/members-list/member/member.component';
import { MemberPlaceholderComponent } from './components/members/members-list/member-placeholder/member-placeholder.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { StoreModule } from '@ngrx/store';
import { MembersListComponent } from './components/members/members-list/members-list.component';



@NgModule({
  declarations: [
    MembersComponent,
    MemberComponent,
    MemberPlaceholderComponent,
    PaginationComponent,
    MembersListComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: MembersComponent }])
  ]
})
export class MembersModule { }
