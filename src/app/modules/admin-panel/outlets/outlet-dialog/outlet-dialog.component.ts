import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-outlet-dialog',
  templateUrl: './outlet-dialog.component.html',
  styleUrls: ['./outlet-dialog.component.scss']
})
export class OutletDialogComponent implements OnInit {

  title: string;
  comments = new FormControl('',[Validators.required])
  constructor(public dialogRef: MatDialogRef<OutletDialogComponent>,
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
    * Method that gets invokes on 'no' button click
    */
   onDismiss() {
     this.dialogRef.close({flag: false});
   }

}
