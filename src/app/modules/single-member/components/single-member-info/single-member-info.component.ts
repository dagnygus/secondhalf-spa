/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MemberModel } from 'src/app/models/member-model';

@Component({
  selector: 'app-single-member-info',
  templateUrl: './single-member-info.component.html',
  styleUrls: ['./single-member-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMemberInfoComponent {
  @Input() member!: MemberModel;
  @Input() withNames = true;
  @Input() withAddressInfo = true;
  @Input() withAboutMySelf = true;

  get hasAddressInfo(): boolean {
    return this.member.city != null && this.member.street != null && this.member.state != null && this.member.country != null;
  }

  constructor() {  }
}
