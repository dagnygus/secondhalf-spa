import { MemberEffects } from './../../state/member/member.effects';
import { EffectsModule } from '@ngrx/effects';
import { memberReducer } from './../../state/member/member.reducer';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { SingleMemberChatCloudComponent } from './components/single-member-chat/single-member-chat-clouds/single-member-chat-cloud/single-member-chat-cloud.component';
import { SingleMemberChatCloudsComponent } from './components/single-member-chat/single-member-chat-clouds/single-member-chat-clouds.component';
import { SingleMemberChatTextboxEntryComponent } from './components/single-member-chat/single-member-chat-textbox-entry/single-member-chat-textbox-entry.component';
import { SingleMemberChatComponent } from './components/single-member-chat/single-member-chat.component';
import { SingleMemberHeaderComponent } from './components/single-member-header/single-member-header.component';
import { SingleMemberInfoComponent } from './components/single-member-info/single-member-info.component';
import { SingleMemberPhotoViewerComponent } from './components/single-member-photos/single-member-photo-viewer/single-member-photo-viewer.component';
import { SingleMemberPhotosDisplayerComponent } from './components/single-member-photos/single-member-photos-displayer/single-member-photos-displayer.component';
import { SingleMemberPhotosComponent } from './components/single-member-photos/single-member-photos.component';
import { SharedModule } from '../shared/shared.module';
import { SingleMemberGuard } from 'src/app/guards/single-member.guard';
import { SingleMemberComponent } from './components/single-member/single-member.component';
import { LikePipe } from 'src/app/modules/single-member/pipes/like.pipe';



@NgModule({
  declarations: [
    SingleMemberComponent,
    SingleMemberChatComponent,
    SingleMemberInfoComponent,
    SingleMemberPhotosComponent,
    SingleMemberPhotoViewerComponent,
    SingleMemberPhotosDisplayerComponent,
    SingleMemberHeaderComponent,
    SingleMemberChatTextboxEntryComponent,
    SingleMemberChatCloudsComponent,
    SingleMemberChatCloudComponent,
    LikePipe,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SingleMemberComponent, canActivate: [SingleMemberGuard] },
    ])
  ],
})
export class SingleMemberModule { }
