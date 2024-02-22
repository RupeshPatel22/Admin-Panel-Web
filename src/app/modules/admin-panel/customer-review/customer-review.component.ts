import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { CustomerReview, FilterCustomerReview } from './model/customer-review';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss']
})
export class CustomerReviewComponent implements OnInit {

  currentOutletId: string;
  service: string;
  customerReview: MatTableDataSource<CustomerReview>;
  displayedColumns = ['id','outletDetail','customerName','comments','reviewedAt','orderPlacedTime','voteType']; 
  pageIndex: number = 0;
  pageSize: number = pageSize;
  pageSizeOptions = pageSizeOptions;
  filterCutomerReview: FilterCustomerReview = new FilterCustomerReview();
  totalRecords: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  showFilterFields: boolean;
  outletIds: string;

  constructor(private outletsService: OutletsService, private activeRoute: ActivatedRoute, private sharedService: SharedService, private router: Router) { 
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.service = this.outletsService.service;
    this.getCustomerReview();
  }

  /**
   * Method that get customer reviews 
   * @param filterFlag 
   */
  getCustomerReview(filterFlag?: boolean) {
    if(filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0
    }
    this.filterCutomerReview.pageIndex = this.pageIndex;
    this.filterCutomerReview.pageSize = this.pageSize;
    if(!this.filterCutomerReview.outletIds || this.outletIds === "" || !this.outletIds) {
      this.filterCutomerReview.outletIds = [];
    } else {
      this.filterCutomerReview.outletIds = this.outletIds.split(',');
    }
    const data = this.filterCutomerReview.toJson(this.service);
    this.outletsService.postCustomerReview(data).subscribe(res => {
      this.totalRecords = res['result']['total_records'];
      this.customerReview = new MatTableDataSource<CustomerReview>(res['result']['records'].map(i => CustomerReview.fromJson(i)));
      this.customerReview.sort = this.sort;
    })
  }

  /**
   * Method that invokes on page change
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCustomerReview();
  }

  /**
   * Method that reset filter params
   * @param fieldName 
   */
  clearFilter(fieldName?: 'rating' | 'all' | 'voteType' | 'ratingGt' | 'ratingLt') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterCutomerReview.rating = this.filterCutomerReview.voteType =this.filterCutomerReview.ratingGt = this.filterCutomerReview.ratingLt = null;
    } else if (fieldName === 'rating') {
      this.filterCutomerReview.rating = null;
    } else if (fieldName === 'voteType') {
      this.filterCutomerReview.voteType = null;
    } else if (fieldName === 'ratingGt') {
      this.filterCutomerReview.ratingGt = null;
    } else if (fieldName === 'ratingLt') {
      this.filterCutomerReview.ratingLt = null;
    }
    this.getCustomerReview();
  }

  /**
   * Method that navigates to another tab based on Restaurant Id
   * @param outletId
   * @param outletName
   */
  navigateToOutletDetailsInNewWindow(outletId: string, outletName: string) {
    this.sharedService.navigateToOutletDetailsInNewWindow(outletId,outletName);
  }

  /**
   * Method that opens one view dashboard in new tab
   * @param orderId 
   */
  goToOneViewWebsite(orderId: number) {
    const link = this.router.serializeUrl(this.router.createUrlTree(['home'], { queryParams: { service: this.outletsService.service, orderId: orderId } }));
    window.open(`${environment.oneViewDashboardBaseUrl}${link}`);
  }
}
