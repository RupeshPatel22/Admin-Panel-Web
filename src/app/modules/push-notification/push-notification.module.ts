import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PushNotificationRoutingModule } from './push-notification-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    PushNotificationRoutingModule,
    SharedModule,
    RouterModule,
  ]
})
export class PushNotificationModule { }
