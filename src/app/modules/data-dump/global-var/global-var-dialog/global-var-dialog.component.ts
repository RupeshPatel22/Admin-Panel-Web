import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Roles } from 'src/app/shared/models';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { GlobalVar } from '../model/global-var';

@Component({
  selector: 'app-global-var-dialog',
  templateUrl: './global-var-dialog.component.html',
  styleUrls: ['./global-var-dialog.component.scss']
})
export class GlobalVarDialogComponent implements OnInit {

  globalVarDetails: GlobalVar;
  fileName: string = 'No file chosen';
  canEdit: boolean;

  globalVarForm = new FormGroup({
    key: new FormControl({ disabled: true, value: '' }, [Validators.required]),
    type: new FormControl({ disabled: true, value: '' }, [Validators.required]),
    value: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  })
  constructor(public dialogRef: MatDialogRef<GlobalVarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private outletsService: OutletsService, private sharedService: SharedService) { dialogRef.disableClose = true;}

  ngOnInit(): void {
    this.globalVarDetails = this.data.globalVar;
    this.globalVarForm.patchValue({ ...this.globalVarDetails });
    if (!this.globalVarDetails.isEditable) {
      this.globalVarForm.get('value').disable();
      this.globalVarForm.get('description').disable();
    }
    this.canEdit = [Roles.superadmin].some(r => this.sharedService.roles.includes(r));
  }

   /**
    * Method that checks whether user is uploading file with correct extn
    * and then gets url to upload the file with api call
    * @param file 
    */
    getFileUploadUrl(file: FileList) {
      const index = (file.item(0).name.lastIndexOf('.'))
      const fileExtn = file.item(0).name.substring(index + 1);
      this.outletsService.getFileUploadUrl(fileExtn).subscribe(res => {
        
        this.globalVarDetails.value = null; //for hiding 'view file' btn as new file is being uploaded
        this.globalVarForm['controls']['value'].setValue(''); // in case file didn't get uploaded then to show error on 'save' btn click 
        this.fileName = res['result']['file_name']; // will be used for displaying the file name in dialog
        this.fileUpload(res['result']['uploadUrl'], file);
  
      });
    }
  
    /**
     * Method that upload file to aws-s3 bucket with api call
     * @param uploadUrl 
     * @param file 
     */
    fileUpload(uploadUrl: string, file: FileList) {
      this.outletsService.uploadFile(uploadUrl, file.item(0)).subscribe(() => {
        this.globalVarForm['controls']['value'].setValue(this.fileName); // will be used for sending data through API
      });
    }

  /**
  * Method that sends global var details to parent component
  * and closed the dialog
  * @returns 
  */
  onConfirm() {
    if (this.globalVarForm.status === 'INVALID')  return this.globalVarForm.markAllAsTouched();

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to update ${this.globalVarDetails.key}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        let value = this.globalVarForm.get('value').value;
        const description = this.globalVarForm.get('description').value;
        if (this.globalVarForm.get('type').value === 'json') {
          value = JSON.parse(value);
        }
        if (this.globalVarForm.get('type').value === 'number') {
          value = Number(value);
        }
        this.dialogRef.close({ flag: true, value, description });
      }
    })
  }

  /**
   * Method that closes the dialog
   */
  onDismiss() {
    this.dialogRef.close({ flag: false });
  }

}
