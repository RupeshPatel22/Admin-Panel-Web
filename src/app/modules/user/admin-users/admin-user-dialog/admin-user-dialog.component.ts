import { Component, Inject, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-user-dialog',
  templateUrl: './admin-user-dialog.component.html',
  styleUrls: ['./admin-user-dialog.component.scss']
})
export class AdminUserDialogComponent implements OnInit {

  title: string;
  comments = new FormControl('',[Validators.required])

  constructor(public dialogRef: MatDialogRef<AdminUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {
      this.title = data.title;
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
  }

  /**
  * Method that gets invokes on 'yes' button click
  */
  onConfirm(){
    if (this.comments.status === 'INVALID') {
      this.comments.markAsTouched();
      return;
    }
    this.dialogRef.close({flag: true, comments: this.comments.value});
  }

  onDismiss() {
    this.dialogRef.close({flag: false});
  }
}
