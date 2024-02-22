import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Payout } from '../model/payout';
@Component({
  selector: 'app-payouts-dialog',
  templateUrl: './payouts-dialog.component.html',
  styleUrls: ['./payouts-dialog.component.scss']
})
export class PayoutsDialogComponent implements OnInit {
  payoutDetails: Payout;
  paymentDetailsForm = new FormGroup({
    txnId: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required])
  })
  currentTime = moment(new Date()).format('h:mm a');
  constructor(public dialogRef: MatDialogRef<PayoutsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    if (this.data.action === 'view-details') {
      this.payoutDetails = this.data.payoutDetails;
    }
  }
  /**
   * Method that validates the form and sends payment date
   * @returns 
   */
  onConfirm() {
    if (this.paymentDetailsForm.status === 'INVALID') {
      this.paymentDetailsForm.markAllAsTouched();
      return;
    }
    const dateTime = moment(this.paymentDetailsForm.get('date').value, 'YYYY-MM-DD').format('YYYY-MM-DD')
      + ' ' + moment(this.paymentDetailsForm.get('time').value, 'h:mm A').format('HH:mm:ss');
    this.dialogRef.close({ flag: true, txnId: this.paymentDetailsForm.get('txnId').value, paymentDate: dateTime })
  }
  /**
   * Method that close the dialog
   */
  onDismiss() {
    this.dialogRef.close({ flag: false })
  }
}
