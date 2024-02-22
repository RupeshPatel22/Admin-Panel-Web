import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { deliveryStatusesList, FilterOrder, Order, orderAcceptanceStatusesList, OrderAction, OrderStatus, orderStatusesList, RefundStatus, refundStatusesList, clientServiceTypeList } from './model/order';
import { environment } from 'src/environments/environment';
import { pageSize, pageSizeOptions, Services } from 'src/app/shared/models/constants/constant.type';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { originalOrder, downloadFile } from 'src/app/shared/functions/modular.functions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { validateEmail, validatePhone } from 'src/app/shared/functions/common-validation.functions';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  ordersList: MatTableDataSource<Order> = new MatTableDataSource();
  displayedColumns: string[] = ['orderId', 'outletName', 'outletType', 'clientServiceType',
    'customerDetails', 'placedAt', 'orderAcceptanceStatus','cancelledBy', 'deliveryStatus', 'orderStatus', 'preparationTime', 'totalOrderDuration','totalBill', 'action'];
  totalOrders;
  showFilterFields: boolean;
  pageIndex: number = 0;
  pageSize: number = pageSize;
  pageSizeOptions = this.getPageSizeOptions;
  readonly originalOrder = originalOrder;
  service: string;
  orderStatus: OrderStatus[] = [];
  refundStatus: RefundStatus[] = [];
  filterOrderFields: FilterOrder = new FilterOrder();
  readonly Services = Services;
  readonly orderAcceptanceStatusesList = orderAcceptanceStatusesList;
  readonly deliveryStatusesList = deliveryStatusesList;
  readonly orderStatusesList = orderStatusesList;
  readonly refundStatusesList = refundStatusesList;
  readonly clientServiceTypeList = clientServiceTypeList;
  showOrderLogsModal: boolean;
  selectedOrderDetails: Order;
  kind: string;
  pageHeading: string;
  action: string;
  maxDate = new Date();
  expandedRow: number;
  showAllButton: boolean;
  subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  typeList: any[] = [
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'tea_and_coffee', name: 'Tea & Coffee' },
    { id: 'bakery', name: 'Bakery'}
  ];
  constructor(private ordersService: OrdersService, private toastMsgService: ToastService, private router: Router,
    private activeRoute: ActivatedRoute, private sharedService: SharedService,  private location: Location) {
    this.activeRoute.data.subscribe(data => {
      this.kind = data.kind;
      if (data.kind === 'all') {
        this.pageHeading = 'Orders';
        this.action = null;
      }
      else if (data.kind === 'cancellation') {
        this.pageHeading = 'Orders For Cancellation';
        this.action = OrderAction.CancelOrder;
        this.orderStatus = ["placed"];
        this.displayedColumns = this.displayedColumns.filter(c => c !== 'cancelledBy')
        this.getCancellationReasonsList();
      }
      else if (data.kind === 'refund') {
        this.pageHeading = 'Orders For Refund';
        this.action = OrderAction.SettleRefund;
        this.orderStatus = ['cancelled', 'completed'];
        this.refundStatus = ['approval_pending'];
      }
      else if (data.kind === 'customer-orders') {
        const customerName = this.activeRoute.snapshot.queryParams.customerName || '';
        this.pageHeading = `${customerName ? `${customerName}`: ''} Orders`;
        this.action = null;
      }
      

    });
    if (Object.keys(activeRoute.snapshot.queryParams).length) {
      this.showFilterFields = true;
      const queryParams = activeRoute.snapshot.queryParams;
      this.filterOrderFields.orderId = queryParams.expanded;
      this.filterOrderFields.payoutId = queryParams.payoutId;
      queryParams.customerPhoneNumber ? (this.filterOrderFields.customerPhone = queryParams.customerPhoneNumber, this.showFilterFields = false) : null;
      if (queryParams.expanded) this.expandedRow = Number(queryParams.expanded);
    }
  }
  ngOnInit(): void {
    this.getOrders();
    this.service = this.ordersService.service;
    if (this.service === Services.PND) {
      this.displayedColumns = this.displayedColumns.filter(c => c !== 'outletName' && c !== 'orderAcceptanceStatus' && c !== 'preparationTime' && c !== 'outletType' && c !== 'clientServiceType');
    }
    if(this.service === Services.Grocery || this.service === Services.Paan || this.service === Services.Flower || this.service === Services.Pharmacy || this.service === Services.Pet) {
      this.displayedColumns = this.displayedColumns.filter(c => c !== 'outletType' && c !== 'clientServiceType');
    }
    this.onResetInitialData();
    this.react();

  }

  react() {
    var getRageValue = function() {
      return 10
    }
    console.log(getRageValue());
    const getArrowValue = (m,b) => 20*m+b
    
    console.log(getArrowValue(5,50));
  }

  /**
   * Method that navigates to another tab based on outlet Id
   * @param outletId
   */
   navigateToOutletDetailsInNewWindow(outletId: string, outletName: string) {
    this.sharedService.navigateToOutletDetailsInNewWindow(outletId, outletName);
  }

  /**
 * Retrieves the orders data based on the filter fields and updates the orders list.
 * @param filterFlag Optional flag to reset the page index and paginator if true.
 */
  getOrders(filterFlag?: boolean): void {
    if (!this.isValidFilterFields()) return;
    if (filterFlag) {
      this.router.navigate([], { queryParams: this.setQueryParams()});
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    
    if (this.orderStatus.length) {
      this.filterOrderFields.orderStatus = this.orderStatus;
    }

    if (this.activeRoute.snapshot.queryParams.customerPhoneNumber) {
      this.filterOrderFields.customerPhone = this.activeRoute.snapshot.queryParams.customerPhoneNumber;
    }
    
    if(this.refundStatus.length){
      this.filterOrderFields.refundStatus = this.refundStatus;
    }
    this.filterOrderFields.pageIndex = this.pageIndex;
    this.filterOrderFields.pageSize = this.pageSize;
    if(this.filterOrderFields.startDate && !this.filterOrderFields.endDate){
      this.toastMsgService.showError("Enter end date");
      return;
    }
    if(!this.filterOrderFields.startDate && this.filterOrderFields.endDate){
      this.toastMsgService.showError("Enter start date");
      return;
    }
    if(!this.filterOrderFields.startDate && (this.filterOrderFields.startTime || this.filterOrderFields.endTime)){
      this.toastMsgService.showError("Enter start date and end date");
      return;
    }
    if(!this.filterOrderFields.endDate && (this.filterOrderFields.startTime || this.filterOrderFields.endTime)){
      this.toastMsgService.showError("Enter start date and end date");
      return;
    }


    const data = this.filterOrderFields.toJson(this.ordersService.service);
  
    this.ordersService.getOrdersData(data).subscribe(res => {
      this.totalOrders = res.result.total_records;
      this.ordersList.data = res.result.records.map(Order.fromJson);
      this.ordersList.sort = this.sort;
    });
  }
  
 /**
 * Fetches the orders data for the current date with a specific time range.
 * The time range is from 6:00 AM of the current date to 2:00 AM of the next day.
 */
 getOrdersForCurrentDate(): void {
  const currentDate = new Date();

  // Set the start time to 6:00 AM of the current date
 let startDate= new Date(new Date().setHours(6,0,0,0))

  // Set the end time to 2:00 AM of tomorrow
  let endDate = new Date(currentDate);
  endDate.setDate(currentDate.getDate() + 1); // Add 1 day to get tomorrow's date
  endDate.setHours(2, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 2:00 AM

  if (currentDate.getHours() >= 0 && currentDate.getHours() < 2 ) {
    startDate.setDate(startDate.getDate() -1);
    endDate.setDate(endDate.getDate() -1);
  }

  // Set the start time to 6:00 AM and end time to 2:00 AM
  const startTime = "06:00";
  const endTime = "02:00";

  this.filterOrderFields.startDate = startDate;
  this.filterOrderFields.endDate = endDate;

  // Set the orderStatus to include only "placed" and "completed"
  this.filterOrderFields.orderStatus = ["placed", "completed"];

  // Set the start time and end time in filterOrderFields object
  this.filterOrderFields.startTime = startTime;
  this.filterOrderFields.endTime = endTime;

  this.showAllButton = true;
  this.getOrders(true);
}

 /**
 * Fetches the orders data for yesterday with a specific time range.
 * The time range is from 6:00 AM of yesterday to 2:00 AM of today.
 */
 getOrdersForYesterday(): void {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate()); // Subtract 1 day to get yesterday's date

  // Set the start time to 6:00 AM of yesterday
  const startTime = "06:00";
  let startDate= new Date(new Date().setHours(6,0,0,0))
  startDate.setDate(startDate.getDate()-1)

  // Set the end time to 2:00 AM of the current date (technically 2:00 AM of yesterday)
  const endTime = "02:00";
  const endDate = new Date();
  endDate.setHours(2, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 2:00 AM

  if (currentDate.getHours() >= 0 && currentDate.getHours() < 2 ) {
    startDate.setDate(startDate.getDate() -1);
    endDate.setDate(endDate.getDate() -1);
  }

  this.filterOrderFields.startDate = startDate;
  this.filterOrderFields.endDate = endDate;
  this.filterOrderFields.orderStatus = ["placed", "completed"];
  this.filterOrderFields.startTime = startTime;
  this.filterOrderFields.endTime = endTime;
  this.showAllButton = true;
  this.getOrders(true);
}

  /**
   * Method that gets cancellation reasons list for admin
   */
  getCancellationReasonsList() {
    this.ordersService.getCancellationReasonsForAdmin().subscribe();
  }
  /**
   * Method that invokes on page change
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getOrders();
  }
  /**
   * Method invokes when order-details page emits value,
   * this method calls cancel order or settle refund method
   * based on value of action var
   * @param event 
   */
  takeAction(event: any) {
    if (this.action === OrderAction.CancelOrder) this.cancelOrder(event);
    if (this.action === OrderAction.SettleRefund) this.settleRefund(event);
  }
  /**
   * Method that cancel order based on order id
   * @param cancellationDetails 
   */
  cancelOrder(cancellationDetails: any) {
    const data = {
      cancellation_reason: cancellationDetails.cancellationReason
    }
    this.ordersService.cancelOrder(cancellationDetails.orderId, data).subscribe(res => {
      this.checkAndResetOrdersPage();
      this.getOrders();
      this.toastMsgService.showSuccess(`order ID: ${cancellationDetails.orderId} is cancelled successfully`);
    })
  }
  /**
   * Method that settle refund for orderId passed in parameter
   * @param refundDetails 
   */
  settleRefund(refundDetails: any) {
    const data = {
      refund_settled_vendor_payout_amount: refundDetails.refundData.vendorPayoutAmount,
      refund_settled_delivery_charges: refundDetails.refundData.deliveryPartnerAmount,
      refund_settled_customer_amount: refundDetails.refundData.customerRefundableAmount,
      refund_settlement_note_to_vendor: refundDetails.refundData.remarksForVendor,
      refund_settlement_note_to_delivery_partner: refundDetails.refundData.remarksForDeliveryPartner,
      refund_settlement_note_to_customer: refundDetails.refundData.remarksForCustomer,
    }
    this.ordersService.refundOrder(refundDetails.orderId, data).subscribe(res => {
      this.checkAndResetOrdersPage();
      this.getOrders();
      this.toastMsgService.showSuccess(`Refund is settled for Order ID:${refundDetails.orderId}`);
    })
  }

  /**
   * Method that reset page based on condition
   * will be used when particular order not going to be part of that page after some action is performed
   */
  checkAndResetOrdersPage() {
    if (this.ordersList.data.length === 1 && this.pageIndex > 0) {
      this.pageIndex -= 1;
      this.paginator.pageIndex = this.pageIndex;
    }
  }
  /**
   * Method that clears all filter parameters
   */
  clearFilter(fieldName: 'all' | 'date' | 'startTime' | 'endTime') {
    const { filterOrderFields, router } = this;
    if (fieldName === 'all') {
      this.filterOrderFields = new FilterOrder();
      this.showFilterFields = false;
    } else if (fieldName === 'date') {
      filterOrderFields.startDate = filterOrderFields.endDate = filterOrderFields.startTime = filterOrderFields.endTime = null;
    }
    else if (fieldName === 'startTime') {
      filterOrderFields.startTime = null;
    }
    else if (fieldName === 'endTime') {
      filterOrderFields.endTime = null;
    }
    if (this.router.url.includes('/customer-orders')) {
      this.filterOrderFields.customerPhone = filterOrderFields.customerPhone || null;
    } else {
      this.filterOrderFields.customerPhone = null;
      this.router.navigate([], { queryParams: this.setQueryParams() }).then(() => {
      });
    }
    this.getOrders(true);
    this.showAllButton = false;
  } 

  /**
   * method that checks the validity of the filter fields
   * @returns 
   */
  isValidFilterFields(): boolean {
    const validationItems = [
      {validator: validatePhone, args: [this.filterOrderFields.customerPhone]},
      {validator: validateEmail, args: [this.filterOrderFields.customerEmail]},
    ]
    for (const item of validationItems) {
      const errorMsg = item.validator.apply(null, item.args);
      if (errorMsg) {
        this.toastMsgService.showError(errorMsg);
        return false;
      }
    }
    return true
  }
  
  /**
   * Method to download filtered orders in csv
   */
  exportOrdersInCsv() {
    const data = this.filterOrderFields.toJson(this.ordersService.service);
    data['filter']['in_csv'] = true;
    this.ordersService.downloadOrdersCsvFile(data).subscribe(res => {
      downloadFile(res, 'orders')
    })
  }

  /**
   * Method that expand/collapse table row
   * @param id 
   */
  toggleTableRow(id: number) {
    this.expandedRow = (this.expandedRow !== id) ? id : null;
    this.router.navigate([], {
      queryParams: this.setQueryParams()
    })
  }

  /**
   * Method that sets query params for this route
   * @returns 
   */
  setQueryParams() {
    const queryParams = {
      payoutId: this.filterOrderFields.payoutId || undefined,
      // customerPhoneNumber: this.filterOrderFields.customerPhone || undefined,
      expanded: this.expandedRow,
    };
  
    if (this.router.url.includes('/customer-orders')) {
      const customerName = sessionStorage.getItem('customerName');
      if (customerName) queryParams['customerName'] = customerName;
    }
  
    return queryParams;
  } 

  /**
   * Method that opens one view dashboard in new tab
   * @param orderId 
   */
  goToOneViewWebsite(orderId: number) {
    const link = this.router.serializeUrl(this.router.createUrlTree(['home'], { queryParams: { service: this.ordersService.service, orderId: orderId } }));
    window.open(`${environment.oneViewDashboardBaseUrl}${link}`);
  }

/**
Opens customer orders page for a specific customer based on customer name and phone number.
@param customerName - The name of the customer.
@param customerPhoneNumber - The phone number of the customer.
*/
  getCustomerOrdersByName(customerName: string, customerPhoneNumber: string): void {
    sessionStorage.setItem('customerName', customerName);
    window.open(this.router.createUrlTree([`/${this.ordersService.service}/customer-orders`], { queryParams: { customerPhoneNumber: customerPhoneNumber.replace(/^\+91/, ''), customerName } }).toString(), '_blank');
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

  /**
   * Method that returns different pageSizeOptions if time is b/w 2:00 AM to 11:00 AM
   */
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
