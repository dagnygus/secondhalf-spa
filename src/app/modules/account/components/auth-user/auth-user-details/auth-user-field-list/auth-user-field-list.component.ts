import { DetailsControls, DetailsKeys } from './../../../../services/user-details.service';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auth-user-field-list[fieldNames][controls][labels][pendingFieldName]',
  templateUrl: './auth-user-field-list.component.html',
  styleUrls: ['./auth-user-field-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthUserFieldListComponent {
  @Input() fieldNames!: readonly DetailsKeys[]
  @Input() controls!: DetailsControls
  @Input() labels!: readonly string[]
  @Input() pendingFieldName: string | null = null

  @Output() detailSubmit = new EventEmitter<DetailsKeys>();
  @Output() detailCancel = new EventEmitter<void>()
}
