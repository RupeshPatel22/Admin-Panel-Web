import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterCategory } from '../modal/master-category';
import { ToastService } from 'src/app/shared/services/toast.service';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { maxFileUploadSizeAllowed } from 'src/app/shared/models';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';

@Component({
  selector: 'app-add-master-category-dialog',
  templateUrl: './add-master-category-dialog.component.html',
  styleUrls: ['./add-master-category-dialog.component.scss']
})
export class AddMasterCategoryDialogComponent implements OnInit {

  masterCategoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    imageName: new FormControl(''),
  })
  masterCategoryImageUrl: string;
  action: 'ADD' | 'EDIT';

  constructor(public dialogRef: MatDialogRef<AddMasterCategoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public masterCategoryDet: MasterCategory, 
  private toastMsgService: ToastService, private outletsService: OutletsService, private dataDumpService: DataDumpService) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    if(this.masterCategoryDet) {
      this.masterCategoryForm.patchValue({...this.masterCategoryDet});
      this.masterCategoryImageUrl = this.masterCategoryDet.imageUrl;
      this.action = 'EDIT';
    }else{
      this.action = 'ADD';
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
      this.masterCategoryForm.get('imageName').setValue(res['result']['file_name']);
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
   * Method that emits master category name to parent component and closses dialog
   */
  submitMasterCategory() {
    const formValues: MasterCategory = this.masterCategoryForm.getRawValue();
    const dataToSend = {
      name: formValues.name, 
      image: formValues.imageName ? { name: formValues.imageName } : null
    };
    if (formValues.imageName) dataToSend['image'] = { name: formValues.imageName }
    this.dialogRef.close({ flag: true, dataToSend});
  }

  /**
  * Method that sets null in imageName
  * to delete uploaded image for the master category
  */
  removeImage() {
    this.masterCategoryForm.get('imageName').setValue(null);
  }

  /**
   * Method that close the dialog box.
   */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }
}
