import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { maxFileUploadSizeAllowed } from 'src/app/shared/models';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UploadDataService } from 'src/app/shared/services/upload-data.service';
import { Banner } from '../model/banner';

@Component({
  selector: 'app-banner-dialog',
  templateUrl: './banner-dialog.component.html',
  styleUrls: ['./banner-dialog.component.scss']
})
export class BannerDialogComponent implements OnInit {

  bannerForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    imageName: new FormControl('', [Validators.required]),
    bannerLink: new FormControl('', [Validators.required]),
  })
  constructor(public dialogRef: MatDialogRef<BannerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public bannerDetails: Banner,
    private uploadDataService: UploadDataService, private toastMsgService: ToastService) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.bannerForm.patchValue({ ...this.bannerDetails });
  }

  get imageName() {
    return this.bannerForm.get('imageName').value;
  }
  /**
   * Method that checks whether user is uploading file with correct extn
   * and then gets url to upload the file with api call
   * @param file 
   */
  getFileUploadUrl(file: FileList) {
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1).toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExtn)) {
      this.toastMsgService.showError('Kindly choose correct file')
      return;
    }
    if (file.item(0).size > maxFileUploadSizeAllowed) return this.toastMsgService.showError('Kindly check the size of file');
    this.uploadDataService.getFileUploadUrl(fileExtn).subscribe(res => {
      this.bannerForm.get('imageName').setValue(res['result']['file_name']);
      this.fileUpload(res['result']['uploadUrl'], file);

    });
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file) {
    this.uploadDataService.uploadFile(uploadUrl, file.item(0)).subscribe();
  }

  /**
   * Method that sends data to its parent component
   * to add or edit banner
   * @returns 
   */
  submitBanner() {
    if (this.bannerForm.status === 'INVALID') {
      this.bannerForm.markAllAsTouched();
      return;
    }
    const formValues: Banner = this.bannerForm.getRawValue();
    const dataToSend = {
      title: formValues.title,
      status: this.bannerDetails?.status || 'created',
      banner_link: formValues.bannerLink,
      image: this.bannerDetails?.imageName !== formValues.imageName ? { name: formValues.imageName } : undefined
    };
    this.dialogRef.close({ flag: true, dataToSend });
  }

  /**
   * Method that close the dialog
  */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }
}
