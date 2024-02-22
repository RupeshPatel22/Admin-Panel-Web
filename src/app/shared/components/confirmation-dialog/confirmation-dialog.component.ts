import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  title: string;
  message: string;
  confirmBtnText: string;
  dismissBtnText: string;
  icon: string;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
    this.confirmBtnText = data.confirmBtnText;
    this.dismissBtnText = data.dismissBtnText;
    this.icon = data.icon;
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onDismiss() {
    this.dialogRef.close(false);
  }
}
