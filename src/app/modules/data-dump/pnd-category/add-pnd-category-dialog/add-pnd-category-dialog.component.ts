import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-pnd-category-dialog',
  templateUrl: './add-pnd-category-dialog.component.html',
  styleUrls: ['./add-pnd-category-dialog.component.scss']
})
export class AddPndCategoryDialogComponent implements OnInit {

  categoryName = new FormControl('', [Validators.required]);
  constructor(public dialogRef: MatDialogRef<AddPndCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onConfirm() {
    if (!this.categoryName.value) {
      this.categoryName.markAsTouched();
      return;
    }
    this.dialogRef.close({ flag: true, categoryName: this.categoryName.value });
  }

  onDismiss() {
    this.dialogRef.close({ flag: false });
  }
}
