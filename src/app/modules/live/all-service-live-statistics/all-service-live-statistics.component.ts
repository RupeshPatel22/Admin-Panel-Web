import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AllOrders, ClientServiceType, FilterAllOrders, serviceTypeList } from './model/all-service-live-statistics';
import { SharedService } from 'src/app/shared/services/shared.service';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { MatSort } from '@angular/material/sort';
import { LiveService } from 'src/app/shared/services/live.service';
import { Router } from '@angular/router';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-all-service-live-statistics',
  templateUrl: './all-service-live-statistics.component.html',
  styleUrls: ['./all-service-live-statistics.component.scss']
})
export class AllServiceLiveStatisticsComponent implements OnInit {

  ordersList: MatTableDataSource<AllOrders> = new MatTableDataSource();
  displayedColumns: string[] = ['orderId','clientServiceType','outletName','customerName','orderPlacedAt','orderStatus','orderAcceptanceStatus','deliveryStatus','paymentStatus','refundStatus'];
  filterAllOrders: FilterAllOrders = new FilterAllOrders();
  @ViewChild(MatSort) sort: MatSort;
  readonly typeList = serviceTypeList;
  readonly originalOrder = originalOrder;
  maxDate = new Date();
  readonly clientServiceType = ClientServiceType;
  private subscription: Subscription;
  
  constructor(private sharedService: SharedService, private orderService: OrdersService, private liveService: LiveService, private router: Router) { }

  ngOnInit(): void {
    this.getAllLiveOrders();
    this.subscription = interval(30000).subscribe(() => {
      this.getAllLiveOrders();
    });
  }

  /**
   * Fetches live orders for various services and combines them into a single list.
   */
  getAllLiveOrders(filterFlag?: boolean) {
    const data = this.filterAllOrders.toJson(this.orderService.service);
    this.liveService.getActiveOrder(data).subscribe(res => {
      this.ordersList = new MatTableDataSource<AllOrders>([]);
      this.ordersList.data = [
        ...res.result.food_orders.map(AllOrders.fromJson),
        ...res.result.grocery_orders.map(AllOrders.fromJson),
        ...res.result.paan_orders.map(AllOrders.fromJson),
        ...res.result.flower_orders.map(AllOrders.fromJson),
        ...res.result.pickup_and_drop_orders.map(AllOrders.fromJson),
        ...res.result.pet_orders.map(AllOrders.fromJson),
        ...res.result.pharmacy_orders.map(AllOrders.fromJson)
      ];
      for(const i of this.ordersList.data) {
        if(i.clientServiceType === undefined){
          i.clientServiceType = this.clientServiceType.pnd;
        }
      }
    })
  }

  /**
   * Navigates to the orders page in a new browser window/tab.
   * @param orderId The ID of the order to navigate to.
   */
  navigateToOrdersPageInNewWindow(orderId: string, clientServiceType: string) {
    if(clientServiceType === 'Tea and Coffee' || clientServiceType === 'Bakery') {
      clientServiceType = 'food';
    }
    const link = this.router.serializeUrl(this.router.createUrlTree([clientServiceType.toLocaleLowerCase(), 'orders'], { queryParams: { expanded: orderId } }));
    window.open(link);
  }

  /**
   * Method that clears all filter parameters
   */
  clearFilter(fieldName: 'date' | 'startTime' | 'endTime') {
    if(fieldName === 'date'){
      this.filterAllOrders.startDate = this.filterAllOrders.endDate = this.filterAllOrders.startTime = this.filterAllOrders.endTime = null;
    }else if(fieldName === 'startTime'){
      this.filterAllOrders.startTime = null;
    }else if(fieldName === 'endTime'){
      this.filterAllOrders.endTime = null;
    }
    this.getAllLiveOrders();
  }

  /**
   * Method that navigates to another tab based on parameter
   * @param outletId
   */
  navigation(id: string, customerPhoneNumber: string, clientServiceType: string, customerName: string) {
    if(clientServiceType === 'Tea and Coffee' || clientServiceType === 'Bakery') {
      clientServiceType = 'food';
    }
    if(id){
      const link = this.router.serializeUrl(this.router.createUrlTree([clientServiceType.toLocaleLowerCase(), 'outlet-details'], { queryParams: { id }} ));
      window.open(link);
    }
    if(customerPhoneNumber){
      sessionStorage.setItem('customerName', customerName);
      window.open(this.router.createUrlTree([clientServiceType.toLocaleLowerCase(), 'customer-orders'], { queryParams: { customerName, customerPhoneNumber: customerPhoneNumber.replace(/^\+91/, '') } }).toString(), '_blank');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}