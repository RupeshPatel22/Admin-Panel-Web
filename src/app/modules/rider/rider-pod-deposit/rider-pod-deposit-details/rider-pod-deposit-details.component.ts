import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { dateLongTimeFormat } from 'src/app/shared/models';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RiderPodDeposit } from '../model/rider-pod-deposit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rider-pod-deposit-details',
  templateUrl: './rider-pod-deposit-details.component.html',
  styleUrls: ['./rider-pod-deposit-details.component.scss']
})
export class RiderPodDepositDetailsComponent implements OnInit {

  @Input() riderPodDepositDetails: RiderPodDeposit;
  readonly dateLongTimeFormat = dateLongTimeFormat;
  cancellationReason = new FormControl('', [Validators.required])

  constructor(private riderService: RiderService, private toastMsgService: ToastService, private router : Router) { }

  ngOnInit(): void {
  }

  /**
   * Method that cancels pod deposited amount
   */
   cancelDeposit() {
    if (this.cancellationReason.status === 'INVALID') return this.cancellationReason.markAsTouched();

    const data = {
      cancellation_reason: this.cancellationReason.value
    }

    this.riderService.cancelRiderPodDeposit(this.riderPodDepositDetails.id, data).subscribe(res => {
      this.riderPodDepositDetails['cancelledAt'] = res['result']['rider_deposit']['cancelled_at'];
      this.riderPodDepositDetails['cancelledBy'] = localStorage.getItem('userName');
      this.riderPodDepositDetails['cancellationReason'] = res['result']['rider_deposit']['cancellation_reason'];
      this.toastMsgService.showSuccess('Deposit is cancelled successfully');
    })
  }

  navigateToRiderOrdersPage(riderShiftId: string) {
   const link = this.router.serializeUrl(this.router.createUrlTree(['rider/orders'], {
    queryParams: {riderShiftId}
   }))
   window.open(link)
  }

}
