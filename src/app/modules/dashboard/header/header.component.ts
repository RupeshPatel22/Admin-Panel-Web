import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Roles } from 'src/app/shared/models';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { NotificationData } from './model/header';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  notificationList: NotificationData[] = [];
  totalNotificationRecords: number;
  showTotalNotificationRecords: boolean = true;
  currentNotificationPage: number = 0;
  notifactionPageSize: number = 10;
  userName: string;
  roles: Roles[];
  subcriptions: Subscription[] = [];
  constructor(private pushNotificationService: PushNotificationsService, private router: Router, private toastMsgService: ToastService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
    this.roles = this.sharedService.roles;
    this.getPushNotificationsData();
  }

  /**
   * Method that filters all notification data
   */
  getPushNotificationsData() {
    const data = {
      filter: { user_type: ['admin'] },
      pagination: {
        page_index: this.currentNotificationPage,
        page_size: this.notifactionPageSize
      }
    }
    this.pushNotificationService.filterPushNotifications(data).subscribe(res => {
      this.totalNotificationRecords = res['result']['total_records'];
      for (const i of res['result']['records']) {
        this.notificationList.push(NotificationData.fromJson(i));
      }
    })
  }


  /**
   * Method that load more notifications by calling 
   * getPushNotificationsData() method
   */
  loadMoreNotificationsData() {
    this.currentNotificationPage += 1;
    this.getPushNotificationsData();
  }
  /**
   * Method that reloads notifications data to get new notifications if any.
   * this method invokes on notification icon click
   */
  reloadNotificationsData() {
    this.currentNotificationPage = this.totalNotificationRecords = 0;
    this.notificationList = [];
    this.getPushNotificationsData();
  }


  /**
   * Method that logouts user and navigate to login page
   */
  logout() {
    this.subcriptions.push(
    this.pushNotificationService.deletePushNotificationToken().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['login']);
      this.toastMsgService.showSuccess('Logged Out Successfully');
    })
    );
  }

    /**
   * Method that calls API to change read status of particular notifcation
   * @param notification
   */
    changePushNotificationReadStatus(notification: NotificationData) {
      const data = {
        push_notification_ids: [notification.id],
        mark_as_read: !notification.markAsRead,
      };
  
      this.subcriptions.push(
        this.pushNotificationService.changePushNotificationStatus(data).subscribe((res) => {
          notification['markAsRead'] = !notification['markAsRead'];
        })
      );
    }
}
