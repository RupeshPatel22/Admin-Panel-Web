import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FilterNotifications, Notification } from './model/notification';
import { filter } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationList: MatTableDataSource<Notification> = new MatTableDataSource();
  filterNotificationsFields: FilterNotifications = new FilterNotifications();
  displayedColumns: string[] = ['pushNotificationId','userId','userType','templateId','deliveryStatus'];
  @ViewChild(MatSort) sort: MatSort;
  pageIndex: number = 0;
  pageSize: number = pageSize;
  readonly pageSizeOptions = pageSizeOptions;
  totalRecords: number;
  showfilterFields: boolean;
  deliveryStatusList: any[] = [
    { id: 'success', name: 'Success' },
    { id: 'failed', name: 'Failed' }
  ];
  userTypeList: any[] = [
    { id: 'admin', name: 'Admin' },
    { id: 'customer', name: 'Customer' },
    { id: 'rider', name: 'Rider' },
    { id: 'vendor', name: 'Vendor' },
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private sharedService: SharedService, private pushNotificationService: PushNotificationsService) { }

  ngOnInit(): void {
    this.getNotificationData();
  }

  getNotificationData (filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
  
    this.filterNotificationsFields.pageIndex = this.pageIndex;
    this.filterNotificationsFields.pageSize = this.pageSize;
    const data = this.filterNotificationsFields.toJason();
    this.pushNotificationService.postPushNotificationFilter(data).subscribe(res => {
      this.totalRecords = res.result.total_records;
      this.notificationList.data = [];
      if(res['result']['records']) {
        for(const i of res['result']['records']){
          this.notificationList.data.push(Notification.fromJson(i));
        }
      }
      this.notificationList.sort = this.sort;
    })
  }

  /**
  * Method that clears filter params
  * @param fieldName 
  */
  clearFilter(fieldName?: 'all' | 'date' | 'startTime' | 'endTime') {
    if (fieldName === 'all') {
      this.showfilterFields = false;
      this.filterNotificationsFields = new FilterNotifications();
    }
    if(fieldName === 'date'){
      this.filterNotificationsFields.startDate = this.filterNotificationsFields.endDate = this.filterNotificationsFields.startTime = this.filterNotificationsFields.endTime = null;
    }else if(fieldName === 'startTime'){
      this.filterNotificationsFields.startTime = null;
    }else if(fieldName === 'endTime'){
      this.filterNotificationsFields.endTime = null;
    }
    this.getNotificationData();
  }

  /**
 * Method that invokes on page change
 * @param event 
 */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getNotificationData();
  }
}
