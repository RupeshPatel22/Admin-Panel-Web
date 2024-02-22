import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FilterInquiryOrder, InquiryOrder, InquiryOrderStatus, inquiryOrderStatusList } from '../model/inquiry-orders';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { MatTableDataSource } from '@angular/material/table';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-inquiry-orders',
  templateUrl: './inquiry-orders.component.html',
  styleUrls: ['./inquiry-orders.component.scss']
})
export class InquiryOrdersComponent implements OnInit, OnDestroy {
  
  ordersList: MatTableDataSource<InquiryOrder> = new MatTableDataSource();
  displayedColumns: string[] = ['inquiryId', 'orderId', 
  'outletName', 'customerDetails', 'placedAt', 'status', 'action'];
  filterInquiryOrderFields: FilterInquiryOrder = new FilterInquiryOrder();
  showFilterFields: boolean;
  showAllButton: boolean;
  readonly inquiryOrderStatusList = inquiryOrderStatusList;
  inquiryOrderStatus: InquiryOrderStatus[] = [];
  readonly originalOrder = originalOrder;
  totalOrders;
  pageHeading = 'Inquiry Orders';
  kind: string;
  pageSize: number = pageSize;
  pageSizeOptions = this.getPageSizeOptions;
  pageIndex: number = 0;
  expandedRow: number;
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor( private orderService: OrdersService,private router: Router, private activeRoute: ActivatedRoute, private sharedService: SharedService, private toastMsgService: ToastService) { 
    if (Object.keys(activeRoute.snapshot.queryParams).length) {
      this.showFilterFields = true;
      const queryParams = activeRoute.snapshot.queryParams;
      this.filterInquiryOrderFields.inquiryOrderIds = queryParams.expanded;
      if (queryParams.expanded) this.expandedRow = Number(queryParams.expanded); 
    }
  }

  ngOnInit(): void {
    this.getInquiryOrder();
  }

  /**
 * Method that Retrieves inquiry orders based on the specified filters and updates the component's data accordingly.
 *
 * @param {boolean} [filterFlag] - A flag indicating whether to apply filters and update query parameters.
 */
  getInquiryOrder(filterFlag?: boolean) {
    if (filterFlag) {
      this.router.navigate([], { queryParams: this.setQueryParams()});
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    if(this.inquiryOrderStatus.length) {
      this.filterInquiryOrderFields.status = this.inquiryOrderStatus;
    }

    this.filterInquiryOrderFields.pageIndex = this.pageIndex;
    this.filterInquiryOrderFields.pageSize = this.pageSize;
    if(this.filterInquiryOrderFields.startDate && !this.filterInquiryOrderFields.endDate) {
      this.toastMsgService.showError("Enter end date");
      return;
        }
    if(!this.filterInquiryOrderFields.startDate && this.filterInquiryOrderFields.endDate){
      this.toastMsgService.showError("Enter start date");
      return;
    }
    if(!this.filterInquiryOrderFields.startDate && (this.filterInquiryOrderFields.startTime || this.filterInquiryOrderFields.endTime)){
      this.toastMsgService.showError("Enter start date and end date");
      return;
    }
    if(!this.filterInquiryOrderFields.endDate && (this.filterInquiryOrderFields.startTime || this.filterInquiryOrderFields.endTime)){
      this.toastMsgService.showError("Enter start date and end date");
      return;
    }

    const data = this.filterInquiryOrderFields.toJson();

    this.orderService.getInquiryOrder(data).subscribe(res => {
      this.totalOrders = res.result.total_records;
      this.ordersList.data = res.result.records.map(InquiryOrder.fromJson);
      this.ordersList.sort = this.sort;

    })
  }

  /**
 * Method tha clears or resets the specified filter or all filters in the inquiry order search.
 *
 * @param {'all' | 'date' | 'startTime' | 'endTime'} fieldName - The name of the filter field to be cleared.
 */
  clearFilter(fieldName: 'all' | 'date' | 'startTime' | 'endTime') {
    const { filterInquiryOrderFields } = this;
    if (fieldName === 'all') {
      this.filterInquiryOrderFields = new FilterInquiryOrder();
      this.showFilterFields = false;
    } else if (fieldName === 'date') {
      filterInquiryOrderFields.startDate = filterInquiryOrderFields.endDate = filterInquiryOrderFields.startTime = filterInquiryOrderFields.endTime = null;
    }
    else if (fieldName === 'startTime') {
      filterInquiryOrderFields.startTime = null;
    }
    else if (fieldName === 'endTime') {
      filterInquiryOrderFields.endTime = null;
    } else {
      this.router.navigate([], { queryParams: this.setQueryParams() }).then(() => {
      });      
    }
    this.getInquiryOrder();
    this.showAllButton = false;
  }

 

  /**
 * Method that toggles the expanded state of a table row identified by the given ID and updates the route queryParams.
 *
 * @param {number} id - The unique identifier of the table row to be toggled.
 */
  toggleTableRow(id: number) {
    this.expandedRow = (this.expandedRow !== id) ? id : null;
    this.router.navigate([], {
      queryParams: this.setQueryParams()
    })
  }

  /**
 * Method that opens the OneView website in a new window, displaying information related to the specified order ID.
 *
 * @param {number} orderId - The unique identifier of the order to be viewed on the OneView website.
 */
  goToOneViewWebsite(orderId: number) {
    if (!orderId) return;   
    const link = this.router.serializeUrl(this.router.createUrlTree(['home'], {queryParams: { service: this.orderService.service, orderId: orderId}}));
    window.open(`${environment.oneViewDashboardBaseUrl}${link}`)
  }

  /**
 * Method to constructs and returns an object containing query parameters based on the current filter and state.
 */
  setQueryParams() {
    const queryParams = {
      outletId: this.filterInquiryOrderFields.outletId || undefined,
      expanded: this.expandedRow,
    };
    return queryParams;
  }

  /**
 * Method that handles the page change event triggered by the paginator and updates the component's pageIndex and pageSize.
 * Subsequently, triggers the method to retrieve inquiry orders with the updated parameters.
 *
 */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getInquiryOrder();
  }

  /**
   * Method that navigates to another tab based on outlet Id
   * @param outletId
   */
  navigateToOutletDetailsInNewWindow(outletId: string, outletName: string) {
    this.sharedService.navigateToOutletDetailsInNewWindow(outletId, outletName);
  }

   /**
   * Method that keep a watch on routing change
   * and reset data when route contains state = 'reset'
   */
   onResetInitialData() {
    this.subscriptions.push(
      this.router.events.subscribe(res => {
        if (res instanceof NavigationEnd) {
          if (this.router.getCurrentNavigation()?.extras?.state?.data === 'reset') {
            this.clearFilter('all');
          }
        }
      })
    )
  }
  get getPageSizeOptions(): number[] {
    const currentDate = new Date();
    if (currentDate.getHours() >= 2 && currentDate.getHours() < 11) return [25, 50, 100, 200, 500];
    return pageSizeOptions;
  }

   /**
   * Method invokes on destroy of the page
   */
   ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
