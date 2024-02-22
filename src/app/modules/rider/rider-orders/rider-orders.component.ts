import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { dateLongTimeFormat, pageSize, pageSizeOptions, Services } from 'src/app/shared/models/constants/constant.type';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CancelledByList, DeliveryStatusList, FilterRiderOrder, ISettleOrder, RiderOrder, RiderOrderAction, SettlementStatusList, IManualAllocationOrders, IRemoveRider } from './model/rider-order';
import { downloadFile } from 'src/app/shared/functions/modular.functions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-rider-orders',
  templateUrl: './rider-orders.component.html',
  styleUrls: ['./rider-orders.component.scss']
})
export class RiderOrdersComponent implements OnInit {
  riderOrdersList: MatTableDataSource<RiderOrder> = new MatTableDataSource();
  displayedColumns: string[] = ['orderId', 'clientOrderId', 'riderName','createdAt', 'totalAmount', 'deliveryCharges', 'DeliveryStatus', 'pickupOperationalZoneDetails','action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalRiderOrdersRecords: number;
  kind: string;
  pageHeading: string;
  action: RiderOrderAction;
  showFilterFields: boolean;
  settlementStatus: string[] = [];
  deliveryStatus: string[] =[];
  filterRiderOrderFields: FilterRiderOrder = new FilterRiderOrder();
  readonly deliveryStatusList = DeliveryStatusList;
  readonly cancelledByList = CancelledByList;
  readonly settlementStatusList = SettlementStatusList;
  readonly dateLongTimeFormat = dateLongTimeFormat;
  manualAssignmentValue = [
    {key: true, value: 'Yes'},
    {key: false, value: 'No'}
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private riderService: RiderService, private activeRoute: ActivatedRoute, private router: Router,
    private toastMsgService: ToastService, private sharedService: SharedService) {
    if (Object.keys(activeRoute.snapshot.queryParams).length) {
      this.showFilterFields = true;
      const queryParams = activeRoute.snapshot.queryParams;
      this.filterRiderOrderFields.riderId = queryParams.riderId;
      this.filterRiderOrderFields.payoutId = queryParams.payoutId;
      this.filterRiderOrderFields.orderId = queryParams.orderId;
      this.filterRiderOrderFields.riderShiftId = queryParams.riderShiftId;
      if (queryParams.deliveryStatus) this.filterRiderOrderFields.deliveryStatus = queryParams.deliveryStatus?.split(', ');
    }
    this.activeRoute.data.subscribe(data => {
      this.kind = data.kind;
      if (this.kind === 'settlement') {
        this.pageHeading = 'Rider Orders Settlement';
        this.action = RiderOrderAction.Settle;
        this.settlementStatus = ['pending'];
      }
      else if (this.kind === 'manual-allocation') {
        this.pageHeading = 'Riders Allocation';
        this.action = RiderOrderAction.ManualAssignment;
        this.deliveryStatus = ['PENDING'];
        this.filterRiderOrderFields.manualAssignment = true;
      }
       else {
        this.pageHeading = 'Rider Orders';
        this.action = RiderOrderAction.RemoveRider;
      }
    })
  }
  ngOnInit(): void {
    this.getriderOrdersList();
  }
  /**
   * Method that gets orders list
   * @param filterFlag 
   */
  getriderOrdersList(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    // this is to update queryparams on change in filter values, so that on refreshing the page we can filter with latest data
    this.router.navigate([], {
      queryParams: {
        riderId: this.filterRiderOrderFields.riderId || undefined,
        payoutId: this.filterRiderOrderFields.payoutId || undefined,
        orderId: this.filterRiderOrderFields.orderId || undefined,
        riderShiftId: this.filterRiderOrderFields.riderShiftId || undefined,
        deliveryStatus: this.filterRiderOrderFields.deliveryStatus.join(', ') || undefined
      }
    });
    this.filterRiderOrderFields.pageIndex = this.pageIndex;
    this.filterRiderOrderFields.pageSize = this.pageSize;
    if (this.settlementStatus.length) this.filterRiderOrderFields.settlementStatus = this.settlementStatus;
    if (this.deliveryStatus.length) this.filterRiderOrderFields.deliveryStatus = this.deliveryStatus;
    const data = this.filterRiderOrderFields.toJson();
    this.riderService.filterRiderOrders(data).subscribe(res => {
      this.totalRiderOrdersRecords = res['result']['total_records'];
      this.riderOrdersList.data = [];
      for (const i of res['result']['records']) {
        this.riderOrdersList.data.push(RiderOrder.fromJson(i));
      }
      this.riderOrdersList.sort = this.sort;
    })
  }
  /**
   * Method that calls the method based on action received
   * @param event 
   * @returns 
   */
  takeAction(event: ISettleOrder | IManualAllocationOrders | IRemoveRider) {
    if (this.action === RiderOrderAction.Settle) return this.settleOrder(event as ISettleOrder);
    if (this.action === RiderOrderAction.ManualAssignment) return this.assignRider(event as IManualAllocationOrders);
    if (this.action === RiderOrderAction.RemoveRider) return this.removeRiderFromOrder(event as IRemoveRider);
  }
  /**
   * Method that settle order by id passed
   * @param settlementDetails 
   */
  settleOrder(settlementDetails: ISettleOrder) {
    const data = {
      rider_payout_settlement_amount: settlementDetails.settlementAmt
    }
    this.riderService.postRiderOrderSettlement(settlementDetails.orderId, data).subscribe(res => {
      this.toastMsgService.showSuccess(`Order ID: ${settlementDetails.orderId} is settled successfully`);
      this.getriderOrdersList();
    })
  }

  /**
   * Method that removes rider from the order
   * @param details 
   */
  removeRiderFromOrder(details: IRemoveRider) {
    const data = {
      reason: details.reason
    }
    this.riderService.removeRiderFromOrder(details.orderId, data).subscribe(res => {
      this.toastMsgService.showSuccess(`Rider is successfully removed from Order ID: ${details.orderId}`);
      this.getriderOrdersList();
    })
  }
  /**
   * Method that invokes on page change
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getriderOrdersList();
  }
  /**
   * Method that clear filter params
   * @param fieldName 
   */
  clearFilter(fieldName: 'all' | 'startDate' | 'endDate') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterRiderOrderFields = new FilterRiderOrder();
    }
    else if (fieldName === 'startDate') this.filterRiderOrderFields.startDate = null;
    else if (fieldName === 'endDate') this.filterRiderOrderFields.endDate = null;
    this.getriderOrdersList();
  }

   /**
   * Method that assign rider
   * @param riderId 
   */
   assignRider(manualAllocation: IManualAllocationOrders) {
    const data = {
      rider_id: manualAllocation.riderId
    }
    this.riderService.assignRiderManually(manualAllocation.orderId, data).subscribe(res => {
      if (res) {
        this.toastMsgService.showSuccess(res['result']);
        this.getriderOrdersList();
      }
    })
  }
   /**
   * Method to download filtered rider shifts in csv
   */
   exportRiderOrdersInCsv() {
    const data = this.filterRiderOrderFields.toJson();
    data['filter']['in_csv'] = true;
  
    this.riderService.downloadCsvFile('riderOrders', data).subscribe(
      res => {
        downloadFile(res, 'orders');
      });
  }
  
  /**
 * Method that opens one view dashboard in new tab
 * @param orderId 
 */
   goToOneViewWebsite(clientOrderId: string) {
    const [client, orderId] = clientOrderId.split('_');
    let service: string;
    if (client === 'RES') service = Services.Food;
    const link = this.router.serializeUrl(this.router.createUrlTree(['home'], { queryParams: { service, orderId } }));
    window.open(`${environment.oneViewDashboardBaseUrl}${link}`);
  }
}
