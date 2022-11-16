import { Pipe, PipeTransform } from '@angular/core';
import { LikeNotificationModel, NotificationType, ChatNotificationModel, NotificationModel } from '../../../models/notification-model';

@Pipe({
  name: 'isNotificationTypeOf'
})
export class NotificationTypePipe implements PipeTransform {

  transform(value: NotificationModel, typeName: 'chat-notification'): value is ChatNotificationModel;
  transform(value: NotificationModel, typeName: 'like-notification'): value is LikeNotificationModel;
  transform(value: NotificationModel, typeName: NotificationType): boolean {
    return value.type === typeName;
  }

}
