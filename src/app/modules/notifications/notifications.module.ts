import { ToogleOverflowDirective } from './directives/toogle-overflow.directive';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { NotificationComponent } from './components/notifications/notification/notification.component';
import { NotificationsComponent } from './components/notifications/notifications.component';



@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationComponent,
    ToogleOverflowDirective
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    NotificationsComponent,
  ]
})
export class NotificationsModule { }
