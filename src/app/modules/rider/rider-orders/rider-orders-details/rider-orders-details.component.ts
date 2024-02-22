import { IManualAllocationOrders, IRemoveRider, RiderSearchResult } from '../model/rider-order';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { dateLongTimeFormat } from 'src/app/shared/models';
import { RiderService } from 'src/app/shared/services/rider.service';
import { AllocationHistory, DeliveryStatusList, ISettleOrder, RiderManualAllocation, RiderOrder, RiderOrderAction, SettlementStatusList, StatusHistory } from '../model/rider-order';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-rider-orders-details',
  templateUrl: './rider-orders-details.component.html',
  styleUrls: ['./rider-orders-details.component.scss']
})
export class RiderOrdersDetailsComponent implements OnInit {

  @Input() riderOrderDetails: RiderOrder;
  @Input() action: RiderOrderAction;
  @Output() takeAction: EventEmitter<ISettleOrder| IManualAllocationOrders | IRemoveRider> = new EventEmitter();
  orderAllocationHistory: AllocationHistory[] = [];
  orderStatusHistory: StatusHistory[] = [];
  readonly deliveryStatusList = DeliveryStatusList;
  readonly settlementStatusList = SettlementStatusList;
  readonly riderOrderAction = RiderOrderAction;
  readonly dateLongTimeFormat = dateLongTimeFormat;
  showAvailableRiderActionModal: boolean;
  manualAllocationRiderList: RiderManualAllocation[] = [];
  settlementAmt = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  showRiderSearchModal: boolean;
  noRiderSearchLogs: boolean;
  zoom: number = 10;
  pickupLat: number;
  pickupLong: number;
  removeRiderReason = new FormControl('', [Validators.required]);
  constructor(private riderService: RiderService, private renderer: Renderer2, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.getOrderAllocationHistory();
    this.getOrderStatusHistory();
    const o = this.riderOrderDetails.orderLocation.find(o => o.type === 'pickup')
    this.pickupLat = o.lat;
    this.pickupLong = o.long;
  }

  /**
   * Method that gets allocation history of order
   */
  getOrderAllocationHistory() {
    this.riderService.getOrderAllocationHistory(this.riderOrderDetails.orderId).subscribe(res => {
      for (const i of res['result']) {
        const allocationHistory = AllocationHistory.fromJson(i);
        this.orderAllocationHistory.push(allocationHistory);
      }

    })
  }

  /**
   * Metohd that gets status history of order
   */
  getOrderStatusHistory() {
    this.riderService.getOrderStatusHistory(this.riderOrderDetails.orderId).subscribe(res => {
      for (const i of res['result']) {
        this.orderStatusHistory.push(StatusHistory.fromJson(i));
      }
    })
  }

  /**
   * Method that show the list of available riders
   */
  getAvailableRidersForManuallyAllocating() {
    this.riderService.getAvailableRidersForManuallyAssigning(this.riderOrderDetails.orderId).subscribe(res => {
      this.manualAllocationRiderList = [];
      for (const i of res['result']) {
        this.manualAllocationRiderList.push(RiderManualAllocation.fromJson(i));
      }
    })
  }

  /**
   * Method that open the modal of available riders
   */
  openAvailableRiderModal() {
    this.showAvailableRiderActionModal = true;
    this.renderer.addClass(document.body, 'overlay-enabled');
    this.getAvailableRidersForManuallyAllocating();
  }

  /**
   * Method to close the available riders modal
   */
  closeAvailableRiderModal() {
    this.showAvailableRiderActionModal = false;
    this.renderer.removeClass(document.body, 'overlay-enabled');
  }

  /**
   * emits settlement data 
   * @returns 
   */
  onConfirm() {
    if (this.settlementAmt.status === 'INVALID') return this.settlementAmt.markAsTouched();
    this.takeAction.emit({ orderId: this.riderOrderDetails.orderId, settlementAmt: this.settlementAmt.value });
  }

  /**
   * resets formcontrol
   */
  onClear() {
    this.settlementAmt.reset();
  }

  /**
   * Method that sends rider and order id based on action taken to parent component
   * @param riderId 
   */
  onRiderAllocation(riderId: string){
    this.takeAction.emit({orderId: this.riderOrderDetails.orderId, riderId: riderId});
    this.closeAvailableRiderModal();
  }

  /**
   * Method that emits data to remove rider from the order
   * @returns 
   */
  onRemoveRider() {
    if (this.removeRiderReason.status === 'INVALID') return this.removeRiderReason.markAsTouched();
    this.takeAction.emit({ orderId: this.riderOrderDetails.orderId, reason: this.removeRiderReason.value });
  }

  /**
   * Method that clears the fromControl
   */
  onRemoveRiderReasonClear() {
    this.removeRiderReason.reset();
  }

  /**
   * Open Rider Search Results logs modal
   */
  openRiderSearchResultModal(){
    this.showRiderSearchModal = true;
  }

  /**
   * Close Rider Search Result logs modal
   */
  closeRiderSearchResultModal(){
    this.showRiderSearchModal = false;
  }

  /**
   * Method that opens up google map and shows distance between outlet and rider
   * @param riderlat 
   * @param riderLng 
   */
  openMapfromPickupLocationToRiderDistance(riderlat:number, riderLng:number){
    const url = `https://www.google.com/maps/dir/?api=1&origin=${this.pickupLat},${this.pickupLong}
    &destination=${riderlat},${riderLng}&travelmode=driving`;
    window.open(url, '_blank');
}
  
}
