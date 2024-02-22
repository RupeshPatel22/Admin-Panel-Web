import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { dateShortTimeFormat, pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FilterSubscriptionPayment, SubscriptionPayment, SubscriptionPaymentStatus } from './model/subscription-payment';
@Component({
  selector: 'app-subscription-payments',
  templateUrl: './subscription-payments.component.html',
  styleUrls: ['./subscription-payments.component.scss']
})
export class SubscriptionPaymentsComponent implements OnInit {
  subscriptionPaymentsList: MatTableDataSource<SubscriptionPayment> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'subscriptionId', 'planName', 'outletName', 'amount', 'scheduledDate', 'txnDate', 'currentCycle', 'status', 'failureReason'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalSubscriptionPaymentsRecords: number;
  showFilterFields: boolean;
  filterSubscriptionPaymentFields: FilterSubscriptionPayment = new FilterSubscriptionPayment();
  readonly subscriptionPaymentStatus = SubscriptionPaymentStatus;
  readonly dateShortTimeFormat = dateShortTimeFormat;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private subscriptionsService: SubscriptionsService, private router: Router, private toastMsgService: ToastService) { }
  ngOnInit(): void {
    this.getSubscriptionPayments();
  }
  /**
   * Method that gets all payment data of subscriptions
   * @param filterFlag 
   */
  getSubscriptionPayments(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterSubscriptionPaymentFields.pageIndex = this.pageIndex;
    this.filterSubscriptionPaymentFields.pageSize = this.pageSize;
    const data = this.filterSubscriptionPaymentFields.toJson();
    this.subscriptionsService.filterSubscriptionPayment(data).subscribe(res => {
      this.totalSubscriptionPaymentsRecords = res['result']['total_records'];
      this.subscriptionPaymentsList.data = [];
      for (const i of res['result']['records']) {
        this.subscriptionPaymentsList.data.push(SubscriptionPayment.fromJson(i));
      }
      this.subscriptionPaymentsList.sort = this.sort;
    })
  }
  /**
    * Method that invokes on page change
    * @param event 
    */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getSubscriptionPayments();
  }
  /**
 * Method that reset filter params
 * @param fieldName 
 */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterSubscriptionPaymentFields = new FilterSubscriptionPayment();
    }
    this.getSubscriptionPayments();
  }
}
