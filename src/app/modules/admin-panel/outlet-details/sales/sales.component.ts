import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Duration, Sales } from './model/sales';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  salesReportList: MatTableDataSource<Sales> = new MatTableDataSource();
  displayedColumns = ['displayDate', 'salesAmount', 'ordersCount', 'customerCancelledOrdersCount', 'vendorCancelledOrdersCount',
    'deliveryPartnerCancelledOrdersCount', 'avgOrdersRating'];
  currentDate = new Date();
  filterSalesReportByStartTime: Date;
  filterSalesReportByEndTime: Date;
  salesReportDurationType: Duration = 'this_month';
  showCustomDateFilterFields: boolean;
  showSelectCustomDateRangeIcon: boolean;


  currentOutletId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private outletsService: OutletsService, private toastMsgService: ToastService, private activeRoute: ActivatedRoute) { 
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.getSalesReport()
  }

  /**
   * Method that gets sales report
   */
  getSalesReport() {
    const data = {
      duration: this.salesReportDurationType
    }
    if (this.salesReportDurationType === 'custom_range' && (!this.filterSalesReportByStartTime || !this.filterSalesReportByEndTime))
     return this.toastMsgService.showError('Kindly enter start date and end date');

    if (this.filterSalesReportByStartTime && this.filterSalesReportByEndTime) {
      data['start_epoch'] = moment(this.filterSalesReportByStartTime).unix();
      data['end_epoch'] = moment(new Date(this.filterSalesReportByEndTime).setHours(23, 59, 59)).unix();
      this.showSelectCustomDateRangeIcon = false;

    }
    this.outletsService.filterOutletSalesReport(this.currentOutletId, data).subscribe(res => {
      this.salesReportList.data = [];
      for (const i of res['result']['duration_wise_order_sales']) {
        this.salesReportList.data.push(Sales.fromJson(this.salesReportDurationType, i));
      }
      this.salesReportList.paginator = this.paginator;
      this.salesReportList.sort = this.sort;
      // this.calculateSalesBarHeight()
    })
  }

  clearDateFilters() {
    this.filterSalesReportByStartTime = this.filterSalesReportByEndTime = null;
    this.showSelectCustomDateRangeIcon = true;
  }

  /**
 * Method that invokes on change of duration type
 * @param durationType 
 */
  salesReportDurationChange(durationType: Duration) {
    this.salesReportDurationType = durationType;
    this.filterSalesReportByStartTime = null;
    this.filterSalesReportByEndTime = null;
    if (durationType === 'custom_range') {
      this.showCustomDateFilterFields = true;
      this.showSelectCustomDateRangeIcon = true;
    } else {
      this.showCustomDateFilterFields = false;
      this.showSelectCustomDateRangeIcon = false;
      this.getSalesReport();
    }

  }

    /**
   * Method that calculates bar height of each data marking max vendor amount as 100%
   */
    //  calculateSalesBarHeight() {
    //   const arr = []
    //   for (const i of this.salesReportList.data) {
    //     arr.push(i.totalVendorPayout, 
    //       i.totalVendorCompletedOrdersPayout, 
    //       i.totalVendorCancelledOrdersPayout, 
    //       i.totalCustomerPayout, 
    //       i.totalDeliveryPartnerPayout);
    //   }
    //   const maxValue = Math.max(...arr);
    //   for (const i of this.salesReportList.data) {
    //     if(i['totalVendorPayout']) i['totalPayoutBarHeight'] = i['totalVendorPayout'] / maxValue * 100;
    //     if(i['totalVendorCompletedOrdersPayout']) i['totalCompletedOrdersPayoutBarHeight'] = i['totalVendorCompletedOrdersPayout'] / maxValue * 100;
    //     if(i['totalVendorCancelledOrdersPayout']) i['totalCancelledOrdersPayoutBarHeight'] = i['totalVendorCancelledOrdersPayout'] / maxValue * 100;
    //     if(i['totalCustomerPayout']) i['totalCustomerPayoutBarHeight'] = i['totalCustomerPayout'] / maxValue * 100;
    //     if(i['totalDeliveryPartnerPayout']) i['totalDeliveryPartnerBarHeight'] = i['totalDeliveryPartnerPayout'] / maxValue * 100;
    //   }
    // }
}
