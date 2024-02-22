import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { Services } from 'src/app/shared/models';
import { MasterCategory } from 'src/app/modules/data-dump/grocery-master-category/modal/master-category';

@Component({
  selector: 'app-add-new-dialog',
  templateUrl: './add-new-dialog.component.html',
  styleUrls: ['./add-new-dialog.component.scss']
})
export class AddNewDialogComponent implements OnInit {

  title: string;
  inputFiledLabel: string;

  name = new FormControl('', Validators.required);
  masterCategory = new FormControl(null, [Validators.required]);
    // discountRate = new FormControl('',);

  showMasterCategoryField: boolean;
  masterCategoryList: MasterCategory[] = [];

  constructor(public dialogRef: MatDialogRef<AddNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private outletService: OutletsService) {
    }  

  ngOnInit(): void {
    if (this.data.openedFrom === 'category') {
      if (!this.data.isEdit) {
        this.title = 'Add New Category';
      } else {
        this.title = 'Edit Category';
      }
      this.inputFiledLabel = 'Category Name';
      if ( this.outletService.service === Services.Grocery || this.outletService.service === Services.Pharmacy || this.outletService.service === Services.Pet) {
        this.showMasterCategoryField = true;
        this.outletService.masterCategoryList$.subscribe(data => {
          if(data) this.masterCategoryList = data;
        })
      }
    } else {
      if (!this.data.isEdit) {
        this.title = 'Add New Add On Group';
      } else {
        this.title = 'Edit Add On Group';
      }
      this.inputFiledLabel = 'Add On Group Name';
    }
    this.name.setValue(this.data.name);
    this.masterCategory.setValue(this.data.masterCategoryId);
    // this.discountRate.setValue(this.data.discountRate);
  }

  /**
   * Method that adds name
   */
  onAdd() {
    if (this.name.status === 'INVALID' || (this.showMasterCategoryField && this.masterCategory.status === 'INVALID')) {
      this.name.markAsTouched();
      this.masterCategory.markAllAsTouched();
      return;
    }
    const masterCategory = this.showMasterCategoryField ? this.masterCategory.value : undefined;
    this.dialogRef.close({ flag: true, name: this.name.value, masterCategory, addAction: this.data.openedFrom })
  }

  /**
   * Method that close dialog
   */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }
}
