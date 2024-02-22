import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { dateAndTimeValidator } from 'src/app/shared/functions/common-validation.functions';

@Component({
  selector: 'app-holiday-slots-action-dialog',
  templateUrl: './holiday-slots-action-dialog.component.html',
  styleUrls: ['./holiday-slots-action-dialog.component.scss']
})
export class HolidaySlotsActionDialogComponent implements OnInit {

  action: string;
  holidaySlotsForm = new FormGroup({
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
  }, { validators: [dateAndTimeValidator('date', 'time')] })
  currentDate = new Date();
  currentTime = moment(new Date()).format('h:mm a');
  minDate = new Date();


  constructor(public dialogRef: MatDialogRef<HolidaySlotsActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.action;
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  /**
   * Method that sends endDate in epoch format for holiday slots
   * @returns 
   */
  onConfirm() {
    if (this.action === 'add') {
      if (this.holidaySlotsForm.status === 'INVALID') {
        this.holidaySlotsForm.markAllAsTouched();
        return;
      }
      const date = moment(this.holidaySlotsForm.get('date').value).format('YYYY-MM-DD');
      const time = moment(this.holidaySlotsForm.get('time').value, 'h:mm A').format('HH:mm:ss');
      const endDate = new Date(date + ' ' + time);
      this.dialogRef.close({ flag: true, endDate: moment(endDate).unix() })
    } else {
      this.dialogRef.close({ flag: true, endDate: null })
    }
  }

  /**
   * Method that that gets invoked when the user clicks on the not now button.
   */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }
}
