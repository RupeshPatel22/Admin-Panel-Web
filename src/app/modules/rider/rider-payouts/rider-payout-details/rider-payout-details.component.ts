import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RiderPayoutStatusList, RiderPayout, RiderPayoutAction } from '../model/rider-payout';
import { DeliveryStatusList } from '../../rider-orders/model/rider-order';
@Component({
  selector: 'app-rider-payout-details',
  templateUrl: './rider-payout-details.component.html',
  styleUrls: ['./rider-payout-details.component.scss']
})
export class RiderPayoutDetailsComponent implements OnInit {
  @Input() payoutDetails: RiderPayout;
  @Output() takeAction: EventEmitter<any> = new EventEmitter();
  readonly payoutAction = RiderPayoutAction;
  readonly deliveryStatusList = DeliveryStatusList;
  readonly payoutStatusList = RiderPayoutStatusList;
  constructor(private router: Router) { }
  ngOnInit(): void {
  }

  /**
 * Method that emits the action to be taken on payout
 * @param action 
 */
  actionOnPayout(action: RiderPayoutAction) {
    this.takeAction.emit(action);
  }

  /**
   * Method that navigates to rider-orders page to show orders with that orderId
   * @param orderId 
   */
  navigateToRiderOrdersPage(orderId: string) {
    this.router.navigate(['rider/orders'], { queryParams: { orderId } })
  }
}
