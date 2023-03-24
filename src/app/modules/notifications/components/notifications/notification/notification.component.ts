import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification-model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {

  @Input() notification!: Readonly<NotificationModel>;

  constructor() { }

}
