import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})
export class CustomerDialogComponent implements OnInit {

  title: string;
  comments = new FormControl('',[Validators.required])

  constructor(public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.title = data.title;
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
  }
  /**
  * Method that gets invokes on 'yes' button click
  */
  onConfirm() {
    if (this.comments.status === 'INVALID') {
      this.comments.markAsTouched();
      return;
    }
    this.dialogRef.close({flag: true, comments: this.comments.value});
  }

  /**
   * Method that gets invokes on 'Discard' button click
   */
  onDismiss() {
    this.dialogRef.close({flag: false});
  }

}
