import { RiderSearchResult } from './../../../rider/rider-orders/model/rider-order';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Invoice, Order, OrderAction, orderStatusesList } from '../model/order';
import { dateLongTimeFormat, Services, Roles } from 'src/app/shared/models/constants/constant.type';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { CancellationReason } from 'src/app/modules/data-dump/cancellation-reason/model/cancellation-reason';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  cancellationReason = new FormControl('', [Validators.required]);
  refundOrderForm = new FormGroup({
    vendorPayoutAmount: new FormControl('', [Validators.required]),
    deliveryPartnerAmount: new FormControl('', [Validators.required]),
    customerRefundableAmount: new FormControl('', [Validators.required]),
    remarksForVendor: new FormControl('', [Validators.required]),
    remarksForDeliveryPartner: new FormControl('', [Validators.required]),
    remarksForCustomer: new FormControl('', [Validators.required]),
  })
  readonly orderAction = OrderAction;
  readonly orderStatusList = orderStatusesList;
  readonly dateLongTimeFormat = dateLongTimeFormat;
  service: string;
  cancellationReasonsList: CancellationReason[];
  subscriptions: Subscription[] = [];
  readonly Services = Services
  @Input() orderDetails: Order;
  invoice: Invoice;
  @Input() action: string;
  @Output() takeAction: EventEmitter<any> = new EventEmitter();
  readonly Roles = Roles;
  showMarkForRefundBtn: boolean;
  pickupLat: number;
  pickupLong: number;
  showAllocationHistory: boolean;
  isSendNotificationButtonDisable: boolean = true;
  constructor(private ordersService: OrdersService, private toastMsgService: ToastService, private dialog: MatDialog, private sharedService: SharedService, private router: Router) { }
  ngOnInit(): void {
    this.service = this.ordersService.service;
    if (this.service === Services.PND) {
      this.refundOrderForm.removeControl('vendorPayoutAmount');
      this.refundOrderForm.removeControl('remarksForVendor');
    }
    this.subscriptions.push(this.ordersService.cancellationReasons$.subscribe(data => this.cancellationReasonsList = data))
    this.canShowMakrForRefundBtn();
    if ( this.orderDetails.orderStatus === orderStatusesList.completed) {
      this.pickupLat = this.orderDetails.deliveryPartnerAllocationHistory.pickupLat;
      this.pickupLong = this.orderDetails.deliveryPartnerAllocationHistory.pickupLong;
    }
  }
  /**
 * Method that emits cancellation/refund details to its parent component
 * based on 'action'
 * @returns 
 */
  onConfirm() {
    if (this.action === OrderAction.CancelOrder) {
      if (this.cancellationReason.status === 'INVALID') {
        this.cancellationReason.markAsTouched();
        return;
      }
      this.takeAction.emit({ orderId: this.orderDetails.orderId, cancellationReason: this.cancellationReason.value })
    }
    else if (this.action === OrderAction.SettleRefund) {
      if (this.refundOrderForm.status === 'INVALID') {
        this.refundOrderForm.markAllAsTouched();
        return;
      }
      const refundData = {};
      Object.keys(this.refundOrderForm.controls).forEach(control => {
        refundData[control] = this.refundOrderForm.get(control).value;
      })
      this.takeAction.emit({ orderId: this.orderDetails.orderId, refundData });
    }
  }
  /**
   * Method that reset form
   */
  onClear() {
    if (this.action === OrderAction.CancelOrder) {
      this.cancellationReason.reset();
    } else if (this.action === OrderAction.SettleRefund) {
      this.refundOrderForm.reset();
    }
  }
  /**
   * Method that mark completed orders for refund
   */
  markOrderForRefund() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to mark order id: ${this.orderDetails.orderId} for refund?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.ordersService.markOrderForRefund(this.orderDetails.orderId).subscribe(res => {
          this.orderDetails['refundStatus'] = res['result']['refund_status'];
          this.toastMsgService.showSuccess(`Order ID: ${this.orderDetails.orderId} is marked for refund successfully`);
          this.canShowMakrForRefundBtn();
        });
      }
    })
  }

  canShowMakrForRefundBtn(){
    this.showMarkForRefundBtn = this.orderDetails.orderStatus === orderStatusesList.completed && 
    !this.orderDetails.refundStatus && !this.orderDetails.payoutId &&
    [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.finance_manager].some(r => this.sharedService.roles.includes(r));
  }
     /**
   * Method that opens one view dashboard in new tab
   * @param orderId 
   */
  showCouponDetails(couponId: number){
    const link = this.router.serializeUrl(this.router.createUrlTree(['view-coupon']));
    window.open(`${environment.couponDashboardBaseUrl}${link}/${couponId}`);
  }
  /**
  * Method that opens up google map and shows distance between outlet and rider
  * @param riderlat 
  * @param riderLng 
  */
  openMapfromPickupLocationToRiderDistance(riderlat: number, riderLng: number) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${this.pickupLat},${this.pickupLong}
    &destination=${riderlat},${riderLng}&travelmode=driving`;
    window.open(url, '_blank');
  }

  /**
 * Method that Sends a notification to the vendor for the specified order.
 *
 * @param orderId - The unique identifier of the order.
 * @param data - Additional data to be included in the notification (optional).
 * @returns An observable that represents the HTTP response from the server.
 */
  sendNotificationToVendor(orderId: number, data?: any) {
  this.ordersService.postSendNotificationToVendor(orderId, data).subscribe(
    (response) => {
      this.toastMsgService.showSuccess(`Order ID: ${this.orderDetails.orderId} notification sent successfully`);
      this.isSendNotificationButtonDisable = false;
      setTimeout(() => {
        this.isSendNotificationButtonDisable = true;
      }, 60000);
        return response;
    },
  );
}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
