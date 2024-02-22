import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-add-city-dialog',
  templateUrl: './add-city-dialog.component.html',
  styleUrls: ['./add-city-dialog.component.scss']
})
export class AddCityDialogComponent implements OnInit {
  validPattern = "^[a-zA-Z0-9]{1,25}$";
  cityName = new FormControl('', [Validators.required, Validators.pattern(this.validPattern)]);
  constructor(public dialogRef: MatDialogRef<AddCityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }
  ngOnInit(): void {
  }
  addCity() {
    if (this.cityName.status === 'INVALID') {
      this.cityName.markAsTouched();
      return;
    }
    this.dialogRef.close({ flag: true, cityName: this.cityName.value });
  }
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }
}
