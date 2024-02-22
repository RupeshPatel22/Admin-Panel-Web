import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-add-new-child',
  templateUrl: './add-new-child.component.html',
  styleUrls: ['./add-new-child.component.scss']
})
export class AddNewChildComponent implements OnInit {

  childOutletForm = new FormGroup({
    parentOutletId: new FormControl({value: '', disabled: true}),
    childOutletId: new FormControl('',[Validators.required])
  })

  constructor(private outletsService: OutletsService, private toasterMsgService: ToastService, private dialogRef: MatDialogRef<AddNewChildComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.childOutletForm['controls']['parentOutletId'].setValue(this.data.parentId);
  }

  /**
   * Method that make outlet as child reatuarant 
   */
  onSubmit() {
    const data = {
      parent_restaurant_id: this.data.parentId,
    }
    this.outletsService.putChildRestaurant(this.childOutletForm['controls']['childOutletId'].value,data).subscribe(res => {
      this.toasterMsgService.showSuccess('Child Outlet added successfully, kindly refresh !!!');
    })
    this.onCancel();
  }

  /**
   * Method that close add new child restaurant dialog box
   */
  onCancel() {
    this.dialogRef.close({flag: false});
  }
}
