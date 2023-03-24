import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SingleMemberChatCloudsComponent } from './components/single-member/single-member-chat/single-member-chat-clouds/single-member-chat-clouds.component';
import { SingleMemberChatTextboxEntryComponent } from './components/single-member/single-member-chat/single-member-chat-textbox-entry/single-member-chat-textbox-entry.component';
import { SingleMemberChatComponent } from './components/single-member/single-member-chat/single-member-chat.component';
import { SingleMemberHeaderComponent } from './components/single-member/single-member-header/single-member-header.component';
import { SingleMemberInfoComponent } from './components/single-member/single-member-info/single-member-info.component';
import { SharedModule } from '../shared/shared.module';
import { SingleMemberGuard } from 'src/app/guards/single-member.guard';
import { SingleMemberComponent } from './components/single-member/single-member.component';
import { LikePipe } from 'src/app/modules/single-member/pipes/like.pipe';
import { SingleMemberImagesComponent } from './components/single-member/single-member-images/single-member-images.component';
import { ImagesBannerComponent } from './components/single-member/single-member-images/images-baner/images-banner.component';
import { ImagesSelectorComponent } from './components/single-member/single-member-images/images-selector/images-selector.component';

@NgModule({
  declarations: [
    SingleMemberComponent,
    SingleMemberChatComponent,
    SingleMemberInfoComponent,
    SingleMemberHeaderComponent,
    SingleMemberChatTextboxEntryComponent,
    SingleMemberChatCloudsComponent,
    LikePipe,
    SingleMemberImagesComponent,
    ImagesBannerComponent,
    ImagesSelectorComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SingleMemberComponent, canActivate: [SingleMemberGuard] },
    ])
  ],
})
export class SingleMemberModule { }
