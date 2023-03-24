import { Router } from '@angular/router';
/* eslint-disable @typescript-eslint/member-ordering */
import { MemberModel } from 'src/app/models/member-model';
// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, } from '@angular/core';

@Component({
  selector: 'app-single-member-header',
  templateUrl: './single-member-header.component.html',
  styleUrls: ['./single-member-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMemberHeaderComponent {

  @ViewChild('image') imageElRef!: ElementRef<HTMLElement>;

  @Input() likePending = false;
  @Input() member!: MemberModel;
  @Input() isAuth = false;

  @Output() readonly liked = new EventEmitter<string>();
  @Output() readonly chat = new EventEmitter<void>();

  constructor() {}


  onLikedBtnClickHandler(): void {
    if (this.member.liked) { return; }
    this.liked.emit(this.member.userId);
  }

  onChatBtnClick(): void {
    this.chat.emit();
  }
}
