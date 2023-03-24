import { MemberModel } from 'src/app/models/member-model';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, AfterViewChecked, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { StateStatus } from 'src/app/state/utils';

@Component({
  selector: 'app-members-list[members][membersStateStatus]',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersListComponent implements OnChanges, AfterViewChecked {
  @Input() members!: readonly MemberModel[]
  @Input() membersStateStatus!: StateStatus;
  @Input() pendingIndex = -1;
  @Input() isAuth = false;
  @Output() readonly like = new EventEmitter<string>()
  @Output() readonly pendingIndexChange = new EventEmitter<number>()
  readonly Status = StateStatus;

  constructor(private _cdRef: ChangeDetectorRef) {}


  ngOnChanges(_: SimpleChanges): void {
    this._cdRef.reattach()
  }

  ngAfterViewChecked(): void {
    this._cdRef.detach()
  }

  trackBy(_: number, model: MemberModel): string {
    return model.userId;
  }
}
