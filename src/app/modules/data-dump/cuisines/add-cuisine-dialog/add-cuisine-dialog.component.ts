import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Services, maxFileUploadSizeAllowed } from 'src/app/shared/models';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Cuisine } from '../modal/cuisines';

@Component({
  selector: 'app-add-cuisine-dialog',
  templateUrl: './add-cuisine-dialog.component.html',
  styleUrls: ['./add-cuisine-dialog.component.scss']
})
export class AddCuisineDialogComponent implements OnInit {

  cuisineForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    imageName: new FormControl(''),
    ageRestricted: new FormControl('',[Validators.required])
  })
  cuisineImageUrl: string;
  action: 'ADD' | 'EDIT';
  readonly Services = Services;
  service: string;

  constructor(public dialogRef: MatDialogRef<AddCuisineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public cuisineDet: Cuisine,
    private outletsService: OutletsService, private toastMsgService: ToastService) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.cuisineDet) {
      this.cuisineForm.patchValue({ ...this.cuisineDet });
      this.cuisineImageUrl = this.cuisineDet.imageUrl;
      this.action = 'EDIT';
    } else {
      this.action = 'ADD';
    }
    this.service = this.outletsService.service;
    if(this.service !== Services.Paan) {
      this.cuisineForm.get('ageRestricted').disable();
    }
  }

  /**
   * Method that checks whether user is uploading file with correct extn
   * and then gets url to upload the file with api call
   * @param file 
   */
  getFileUploadUrl(file: FileList) {
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1)
    if (!['jpg', 'jpeg', 'png'].includes(fileExtn)) {
      this.toastMsgService.showError('Kindly choose correct file')
      return;
    }
    if (file.item(0).size > maxFileUploadSizeAllowed) return this.toastMsgService.showError('Kindly check the size of file');
    this.outletsService.getFileUploadUrl(fileExtn).subscribe(res => {
      this.cuisineForm.get('imageName').setValue(res['result']['file_name']);
      this.fileUpload(res['result']['uploadUrl'], file);

    });
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file) {
    this.outletsService.uploadFile(uploadUrl, file.item(0)).subscribe();
  }

  /**
   * Method that sets null in imageName
   * to delete uploaded image for the cuisine
   */
  removeImage() {
    this.cuisineForm.get('imageName').setValue(null);
  }

  /**
   * Method that emits cuisine name to parent component and closses dialog
   * @returns 
   */

  submitCuisine() {
    if (this.cuisineForm.status === 'INVALID') {
      this.cuisineForm.markAllAsTouched();
      return;
    }
    const formValues: Cuisine = this.cuisineForm.getRawValue();
    const dataToSend = {
      name: formValues.name,
      status: this.cuisineDet?.status || 'active',
      image: formValues.imageName ? { name: formValues.imageName } : null
    };
    if(this.service === Services.Paan){
      dataToSend['age_restricted'] = formValues.ageRestricted;
    }
    if (formValues.imageName) dataToSend['image'] = { name: formValues.imageName }
    this.dialogRef.close({ flag: true, dataToSend });
  }

  /**
   * Method that close the dialog
   */

  onDismiss() {
    this.dialogRef.close({ flag: false });
  }
}
