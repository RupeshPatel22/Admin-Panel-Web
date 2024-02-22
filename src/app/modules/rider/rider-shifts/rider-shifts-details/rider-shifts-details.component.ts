import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Roles } from 'src/app/shared/models';
import { AllRiderShifts, ISettleShift } from '../model/rider-shifts';
import { DeliveryStatusList } from '../../rider-orders/model/rider-order';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-rider-shifts-details',
  templateUrl: './rider-shifts-details.component.html',
  styleUrls: ['./rider-shifts-details.component.scss']
})
export class RiderShiftsDetailsComponent implements OnInit {

  @Input() allRiderShiftDetails: AllRiderShifts;
  @Output() takeAction: EventEmitter<ISettleShift> = new EventEmitter();

  showSettleShiftForm: boolean;
  readonly deliveryStatusList = DeliveryStatusList;
  settleShiftForm = new FormGroup({
    payoutAmt: new FormControl('', [Validators.required]),
    settlementMsg: new FormControl('', [Validators.required]),
  })
  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.showSettleShiftForm = [Roles.superadmin, Roles.admin, Roles.ops_manager].some(r => this.sharedService.roles.includes(r));
  }

  /**
   * Method that emits data for settlement of rider shift
   * @returns 
   */
  onConfirm() {
    if (this.settleShiftForm.status === 'INVALID') return this.settleShiftForm.markAllAsTouched();
    const formValues = this.settleShiftForm.getRawValue();
    this.takeAction.emit({ riderShiftId: this.allRiderShiftDetails.id, ...formValues });
  }

  /**
   * Method that resets settle shift form
   */
  onClear() {
    this.settleShiftForm.reset();
  }

  /**
   * Method that navigates to rider-orders page to show orders with that orderId
   * @param orderId 
   */
  navigateToRiderOrdersPage(orderId: string) {
    window.open(`/rider/orders?orderId=${orderId}`,'_blank');
  }
  
}
