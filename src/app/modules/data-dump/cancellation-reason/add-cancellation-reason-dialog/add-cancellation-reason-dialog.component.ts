import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Services } from 'src/app/shared/models';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { UserType } from '../model/cancellation-reason';

@Component({
  selector: 'app-add-cancellation-reason-dialog',
  templateUrl: './add-cancellation-reason-dialog.component.html',
  styleUrls: ['./add-cancellation-reason-dialog.component.scss']
})
export class AddCancellationReasonDialogComponent implements OnInit {

  action: string;
  service: string;
  cancellationReasonForm = new FormGroup({
    userType: new FormControl(null, [Validators.required]),
    cancellationReason: new FormControl('', [Validators.required]),
  })

  readonly services = Services;
  readonly userType = UserType;
  constructor(public dialogRef: MatDialogRef<AddCancellationReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataDumpService: DataDumpService) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.service = this.dataDumpService.service;
    this.action = this.data.action;
    if (this.action === 'UPDATE') {
      this.cancellationReasonForm['controls']['userType'].setValue(this.data.userType);
      this.cancellationReasonForm['controls']['cancellationReason'].setValue(this.data.cancellationReason);
    }
  }

  /**
   * Method that sends cancellation reason details to parent component
   * and closed the dialog
   * @returns 
   */
  onConfirm() {
    if (this.cancellationReasonForm.status === 'INVALID') {
      this.cancellationReasonForm.markAllAsTouched();
      return;
    }
    const userType = this.cancellationReasonForm.get('userType').value;
    const cancellationReason = this.cancellationReasonForm.get('cancellationReason').value;
    this.dialogRef.close({ flag: true, userType, cancellationReason });
  }

  /**
   * Method that closes the dialog
   */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }

}
