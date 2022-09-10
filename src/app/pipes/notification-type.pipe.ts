import { NotificationModel } from './../../../../secondhalf-firebase/functions/src/models/notification-model';
import { Pipe, PipeTransform } from '@angular/core';
import { LikeNotificationModel, NotificationType, ChatNotificationModel } from '../models/notification-model';

@Pipe({
  name: 'isNotificationTypeOf'
})
export class NotificationTypePipe implements PipeTransform {

  transform(value: Readonly<NotificationModel>, typeName: 'chat-notification'): value is Readonly<ChatNotificationModel>;
  transform(value: Readonly<NotificationModel>, typeName: 'like-notification'): value is Readonly<LikeNotificationModel>;
  transform(value: Readonly<NotificationModel>, typeName: NotificationType): boolean {
    return value.type === typeName;
  }

}
