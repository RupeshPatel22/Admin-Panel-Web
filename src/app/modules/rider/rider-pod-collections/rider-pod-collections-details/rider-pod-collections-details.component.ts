import { RiderPodCollections, RiderShiftPayout } from '../model/rider-pod-collection';
import { Component, Input, OnInit } from '@angular/core';
import { DeliveryStatusList } from '../../rider-orders/model/rider-order';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { dateLongTimeFormat } from 'src/app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { DepositMethodList } from '../../rider-pod-deposit/model/rider-pod-deposit';

@Component({
  selector: 'app-rider-pod-collections-details',
  templateUrl: './rider-pod-collections-details.component.html',
  styleUrls: ['./rider-pod-collections-details.component.scss'],
})
export class RiderPodCollectionsDetailsComponent implements OnInit {

  @Input() riderPodCollectionsDetail: RiderPodCollections;
  readonly deliveryStatusList = DeliveryStatusList;
  readonly depositMethodList = DepositMethodList;
  readonly dateLongTimeFormat = dateLongTimeFormat;
  pageIndex: number = 0;
  pageSize: number = 5;
  pageSizeOptions = [5, 10, 25, 50];
  totalRiderPodCollectionShiftsRecords: number;
  riderPodCollectionShiftsDetails: RiderShiftPayout[];

  addPodDepositForm = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    depositMethod: new FormControl(null, [Validators.required]),
    remarks: new FormControl('', [Validators.required]),
  })

  constructor(private router: Router, private riderService: RiderService,
    private toastMsgService: ToastService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getRiderPodCollectionShifts();
  }

  /**
   * Method that navigates to rider-orders page to show orders with that orderId
   * @param orderId 
   */
  navigateToRiderOrdersPage(orderId: string) {
    this.router.navigate(['rider/orders'], { queryParams: { orderId } })
  }

  /**
   * Method that gets details by rider shifts
   */
  getRiderPodCollectionShifts() {
    const data = {
      filter: {
        rider_id: this.riderPodCollectionsDetail.riderId
      },
      pagination: {
        page_index: this.pageIndex,
        page_size: this.pageSize
      }
    };
    this.riderService.filterRiderPodCollectionShifts(data).subscribe(res => {
      this.totalRiderPodCollectionShiftsRecords = res['result']['total_records'];
      this.riderPodCollectionShiftsDetails = [];
      for (const i of res['result']['records']) {
        this.riderPodCollectionShiftsDetails.push(RiderShiftPayout.fromJson(i));
      }
    })
  }

  /**
   * Method that adds pod deposit for rider
   * @returns 
   */
  addDeposit() {
    if (this.addPodDepositForm.status === 'INVALID')
      return this.addPodDepositForm.markAllAsTouched();

    const data = {
      amount: this.addPodDepositForm.get('amount').value,
      deposit_method: this.addPodDepositForm.get('depositMethod').value,
      note: this.addPodDepositForm.get('remarks').value,
    }

    this.riderService.addRiderPodDeposit(this.riderPodCollectionsDetail.riderId, data).subscribe(res => {
      this.riderPodCollectionsDetail.totalPodDeposit
        += res['result']['rider_deposit']['amount'];
      this.riderPodCollectionsDetail.cashInHand
        = this.riderPodCollectionsDetail.podCollection - this.riderPodCollectionsDetail.totalPodDeposit;
      this.addPodDepositForm.reset();
      this.toastMsgService.showSuccess('Deposit added successfully');
      this.getRiderPodCollectionShifts();
    })
  }

  /**
  * Method that invokes on page change
  * @param event
  */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getRiderPodCollectionShifts();
  }
}
