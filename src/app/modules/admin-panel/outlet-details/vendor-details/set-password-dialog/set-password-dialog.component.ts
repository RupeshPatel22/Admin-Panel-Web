import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-set-password-dialog',
  templateUrl: './set-password-dialog.component.html',
  styleUrls: ['./set-password-dialog.component.scss']
})
export class SetPasswordDialogComponent implements OnInit {
  
  setPasswordForm = new FormGroup({
    loginId: new FormControl({value: '', disabled: true}),
    setPassword: new FormControl('',[Validators.required])
  })
  
  constructor(private dialogRef: MatDialogRef<SetPasswordDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,  private outletsService: OutletsService, private toasterMsgService: ToastService) { }

  ngOnInit(): void {
    this.setPasswordForm['controls']['loginId'].setValue(this.data.loginId);
  }

  /**
   * Method that reset the vendor password
   */
  onSetPassword() {
    const data = {
      login_id: this.data.loginId,
      password: this.setPasswordForm['controls']['setPassword'].value
    }
    this.outletsService.setVendorPassword(data).subscribe(res => {
      this.toasterMsgService.showSuccess('Password Set Successfully !!!');
    })
    this.onCancel();
  }

  /**
   * Method that close reset vendor password dialog box
   */
  onCancel() {
    this.dialogRef.close({flag: false});
  }
}
