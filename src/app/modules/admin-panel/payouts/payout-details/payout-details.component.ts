import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PayoutsService } from 'src/app/shared/services/payouts.service';
import { Payout, PayoutAction, PayoutStatusList } from '../model/payout';
import { environment } from 'src/environments/environment';
import { Order, orderStatusesList } from '../../orders/model/order';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
@Component({
  selector: 'app-payout-details',
  templateUrl: './payout-details.component.html',
  styleUrls: ['./payout-details.component.scss']
})
export class PayoutDetailsComponent implements OnInit {

  totalOrderRecords: number;
  pageIndex: number = 0;
  pageSize: number = pageSize;
  pageSizeOptions = pageSizeOptions;

  @Input() payoutDetails: Payout;
  @Output() takeAction: EventEmitter<any> = new EventEmitter();
  readonly payoutAction = PayoutAction;
  readonly payoutStatusList = PayoutStatusList;
  readonly orderStatusList = orderStatusesList;
  constructor(private payoutsService: PayoutsService, private router: Router, private ordersService: OrdersService) { }
  ngOnInit(): void {
    this.getOrdersByPayoutId();
  }

  /**
   * Method that gets payout orders based on payout id
   */
  getOrdersByPayoutId() {
    const data = {
      filter: {
        payout_transaction_id: [this.payoutDetails.payoutId]
      },
      pagination: {
        page_index: this.pageIndex,
        page_size: this.pageSize
      }
    };
    data['filter']['payout_transaction_id'] = [this.payoutDetails.payoutId];
    this.ordersService.getOrdersData(data).subscribe(res => {
      this.payoutDetails.payoutOrders = [];
      this.totalOrderRecords = res['result']['total_records'];
      for (const i of res['result']['records']) {
        this.payoutDetails.payoutOrders.push(Order.fromJson(i));
      }
    })
  }
  /**
   * Method that emits the action to be taken on payout
   * @param action 
   */
  actionOnPayout(action: PayoutAction) {
    this.takeAction.emit(action);
  }
  /**
 * Method that opens one view dashboard in new tab
 * @param orderId 
 */
  goToOneViewWebsite(orderId: number) {
    const link = this.router.serializeUrl(this.router.createUrlTree(['home'], { queryParams: { service: this.payoutsService.service, orderId } }));
    window.open(`${environment.oneViewDashboardBaseUrl}${link}`);
  }

   /**
  * Method that invokes on page change
  * @param event
  */
    onPageChange(event) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.getOrdersByPayoutId();
    }
}
