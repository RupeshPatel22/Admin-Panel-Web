import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { dateShortTimeFormat, pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FilterSubscription, ISubscriptionActionData, Subscription, SubscriptionAction, SubscriptionAuthStatus, SubscriptionCancelledBy, SubscriptionStatus } from './model/subscriptions';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  subscriptionsList: MatTableDataSource<Subscription> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'planName', 'outletName', 'planType', 'startDate', 'endDate', 'currentCycle', 'status', 'action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalSubscriptionsRecords: number;
  showFilterFields: boolean;
  filterSubscriptionFields: FilterSubscription = new FilterSubscription();
  maxDate = new Date();

  readonly subscriptionStatus = SubscriptionStatus;
  readonly subscriptionAuthStatus = SubscriptionAuthStatus;
  readonly subscriptionCancelledBy = SubscriptionCancelledBy;
  readonly dateShortTimeFormat = dateShortTimeFormat;
  readonly originalOrder = originalOrder;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private subscriptionsService: SubscriptionsService, private toastMsgService: ToastService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getSubscriptions();
  }

  /**
   * Method that gets all subscription data based on filter
   * @param filterFlag 
   */
  getSubscriptions(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterSubscriptionFields.pageIndex = this.pageIndex;
    this.filterSubscriptionFields.pageSize = this.pageSize;

    if(this.filterSubscriptionFields.startDate && !this.filterSubscriptionFields.endDate){
      this.toastMsgService.showError("Enter end date");
      return;
    }
    if(!this.filterSubscriptionFields.startDate && this.filterSubscriptionFields.endDate){
      this.toastMsgService.showError("Enter start date");
      return;
    }
    if(!this.filterSubscriptionFields.startDate && (this.filterSubscriptionFields.startTime || this.filterSubscriptionFields.endTime)){
      this.toastMsgService.showError("Enter start date and end date");
      return;
    }
    if(!this.filterSubscriptionFields.endDate && (this.filterSubscriptionFields.startTime || this.filterSubscriptionFields.endTime)){
      this.toastMsgService.showError("Enter start date and end date");
      return;
    }
    const data = this.filterSubscriptionFields.toJson();
    this.subscriptionsService.filterSubscriptions(data).subscribe(res => {
      this.subscriptionsList.data = [];
      this.totalSubscriptionsRecords = res['result']['total_records'];
      for (const i of res['result']['records']) {
        this.subscriptionsList.data.push(Subscription.fromJson(i));
      }
      this.subscriptionsList.sort = this.sort;
    })
  }

  takeAction(event: ISubscriptionActionData, subscription: Subscription) {
    if (event.action === SubscriptionAction.Cancel) this.cancelSubscription(event, subscription);
    else if (event.action === SubscriptionAction.RetryPayment) this.retryPayment(event, subscription);
    else if (event.action === SubscriptionAction.Activate) this.activateSubscription(event, subscription);
  }

  /**
   * Method that cancels the existing subscription
   * @param event 
   * @param subscription 
   */
  cancelSubscription(event: ISubscriptionActionData, subscription: Subscription) {
    const data = {
      cancellation_reason: event.sendData
    }
    this.subscriptionsService.cancelSubscription(subscription.id, data).subscribe(res => {
      this.toastMsgService.showSuccess(`ID: ${subscription.id} is cancelled successfully`);
      this.getSubscriptions();
    });
  }

  /**
   * Method that retry payment for subscription that is on hold
   * @param event 
   * @param subscription 
   */
  retryPayment(event: ISubscriptionActionData, subscription: Subscription) {
    const data = {
      next_payment_on: event.sendData || undefined
    }
    this.subscriptionsService.retrySubscriptionPayment(subscription.id, data).subscribe(res => {
      this.toastMsgService.showSuccess(`Retry for ID: ${subscription.id} is done successfully`);
      this.getSubscriptions();
    });
  }

  /**
   * Method that activate subscription that is on hold
   * @param event 
   * @param subscription 
   */
  activateSubscription(event: ISubscriptionActionData, subscription: Subscription) {
    const data = {
      next_payment_on: event.sendData || undefined
    }
    this.subscriptionsService.activateSubscription(subscription.id, data).subscribe(res => {
      this.toastMsgService.showSuccess(`ID: ${subscription.id} is activated successfully`);
      this.getSubscriptions();
    });
  }

  /**
    * Method that invokes on page change
    * @param event 
    */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getSubscriptions();
  }

  /**
 * Method that reset filter params
 * @param fieldName 
 */
  clearFilter(fieldName: 'all' | 'date' | 'nextPaymentDate'| 'startTime' | 'endTime') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterSubscriptionFields = new FilterSubscription();
    }
    else if (fieldName === 'date') {
      this.filterSubscriptionFields.startDate = this.filterSubscriptionFields.endDate = this.filterSubscriptionFields.startTime = this.filterSubscriptionFields.endTime = null;
    }
    else if (fieldName === 'startTime') {
      this.filterSubscriptionFields.startTime = null;
    }
    else if (fieldName === 'endTime') {
      this.filterSubscriptionFields.endTime = null;
    }
    else if (fieldName === 'nextPaymentDate'){
      this.filterSubscriptionFields.nextPaymentDate = null;
    }
    this.getSubscriptions();
  }

    /**
   * Method that navigates to another tab based on outlet Id
   * @param outletId
   */
    navigateToOutletDetailsInNewWindow(outletId: string, outletName: string) {
      this.sharedService.navigateToOutletDetailsInNewWindow(outletId, outletName);
    }
}

