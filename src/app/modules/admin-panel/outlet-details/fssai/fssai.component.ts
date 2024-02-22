import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { maxFileUploadSizeAllowed, permissionDeniedErrorMsg, Services } from 'src/app/shared/models';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Outlet } from '../../outlets/model/outlet';

@Component({
  selector: 'app-fssai',
  templateUrl: './fssai.component.html',
  styleUrls: ['./fssai.component.scss']
})
export class FssaiComponent implements OnInit {

  currentOutletId: string;
  allowedFileExtn = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'odt', 'pdf'];
  intermediateFileName: string;
  minDate: string;
  maxDate: string;
  fssaiForm = new FormGroup({
    hasFssaiCertificate: new FormControl('', [Validators.required]),
    fssaiCertNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{14}")]),
    fssaiCertDocName: new FormControl('', [Validators.required]),
    fssaiCertDocUrl: new FormControl(''),
    fssaiExpirationDate: new FormControl('', [Validators.required]),
    fssaiAckNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{17}")]),
    fssaiAckDocName: new FormControl('', [Validators.required]),
    fssaiAckDocUrl: new FormControl(''),
    fssaiApplicationDate: new FormControl('', [Validators.required]),
    fssaiFirmName: new FormControl('', [Validators.required]),
    fssaiFirmAddress: new FormControl('', [Validators.required]),
  })
  outletDetails: Outlet;
  hasFssaiDetails: boolean = true;
  showHasFssaiDetailsField: boolean;
  constructor(private outletsService: OutletsService, private toastMsgService: ToastService, private activeRoute: ActivatedRoute,
    private sharedService: SharedService) {
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.outletDetails = this.outletsService.outletDetails;
    this.fssaiForm.patchValue({ ...this.outletDetails })
    this.onHasFssaiCertiChange();
    this.onHasFssaiDetailsChange(this.outletDetails.hasFssaiCertificate !== null);
    if (!this.sharedService.hasEditAccessForOutletDetails) this.fssaiForm.disable();
  }

  /**
   * Method that checks whether user is uploading file with correct extn
   * and then gets url to upload the file with api call
   * @param file 
   */
  getFileUploadUrl(file: FileList, controlName: string) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1).toLowerCase();
    if (!this.allowedFileExtn.includes(fileExtn)) {
      this.toastMsgService.showError('Kindly choose correct file')
      return;
    }
    if (file.item(0).size > maxFileUploadSizeAllowed) {
      this.toastMsgService.showError('Kindly check the size of the file');
      return;
    }
    this.outletsService.getFileUploadUrl(fileExtn).subscribe(
      res => {
        this.intermediateFileName = res['result']['file_name'];
        this.fileUpload(res['result']['uploadUrl'], file, controlName);
      }
    );
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file, controlName) {
    this.outletsService.uploadFile(uploadUrl, file.item(0)).subscribe(res => {
      this.fssaiForm['controls'][controlName].setValue(this.intermediateFileName);
      this.fssaiForm['controls'][controlName].markAsDirty();
    });
  }

  viewFile(controlName: string) {
    window.open(this.fssaiForm['controls'][controlName].value);
  }

  /**
   * Method that update fssai details
   * @returns 
   */
  updateOutletDetails() {
    if (this.fssaiForm.status === 'INVALID') {
      this.toastMsgService.showError('Kindly fill up all the fields')
      this.fssaiForm.markAllAsTouched();
      return;
    }
    const fssaiDetails = {};
    if (this.hasFssaiDetails) { //this might be false only for 'FLOWER' service
      fssaiDetails['fssai_has_certificate'] = this.fssaiForm.get('hasFssaiCertificate').value;
      fssaiDetails['fssai_firm_name'] = this.fssaiForm.get('fssaiFirmName').value;
      fssaiDetails['fssai_firm_address'] = this.fssaiForm.get('fssaiFirmAddress').value;
      if (this.hasFssaiCerti) {
        fssaiDetails['fssai_cert_number'] = this.fssaiForm.get('fssaiCertNumber').value;
        fssaiDetails['fssai_expiry_date'] = moment(this.fssaiForm.get('fssaiExpirationDate').value).format('YYYY-MM-DD');
        fssaiDetails['fssai_cert_document'] = { name: this.fssaiForm.get('fssaiCertDocName').value }
      } else {
        fssaiDetails['fssai_ack_number'] = this.fssaiForm.get('fssaiAckNumber').value;
        fssaiDetails['fssai_application_date'] = moment(this.fssaiForm.get('fssaiApplicationDate').value).format('YYYY-MM-DD');
        fssaiDetails['fssai_ack_document'] = { name: this.fssaiForm.get('fssaiAckDocName').value }
      }
    }
    else {
      fssaiDetails['fssai_has_certificate'] = null;
    }
    const data = { fssai_details: fssaiDetails };
    this.outletsService.updateOutletDetails(data, this.currentOutletId).subscribe((res) => {
      this.fssaiForm.patchValue({ ...this.outletsService.outletDetails });
      this.fssaiForm.markAsPristine();
      this.toastMsgService.showSuccess('Outlet details updated successfully');
    });
  }

  /**
   * Method that involes on value changes of hasFssaiCerti
   */
  onHasFssaiCertiChange() {
    if (this.hasFssaiCerti) {
      this.fssaiForm['controls']['fssaiCertNumber'].enable();
      this.fssaiForm['controls']['fssaiCertDocName'].enable();
      this.fssaiForm['controls']['fssaiExpirationDate'].enable();
      this.fssaiForm['controls']['fssaiAckNumber'].disable();
      this.fssaiForm['controls']['fssaiAckDocName'].disable();
      this.fssaiForm['controls']['fssaiApplicationDate'].disable();
      this.maxDate = '';
      this.minDate = moment().format('YYYY-MM-DD');
    } else {
      this.fssaiForm['controls']['fssaiCertNumber'].disable();
      this.fssaiForm['controls']['fssaiCertDocName'].disable();
      this.fssaiForm['controls']['fssaiExpirationDate'].disable();
      this.fssaiForm['controls']['fssaiAckNumber'].enable();
      this.fssaiForm['controls']['fssaiAckDocName'].enable();
      this.fssaiForm['controls']['fssaiApplicationDate'].enable();
      this.minDate = moment().subtract(1, 'week').format('YYYY-MM-DD');
      this.maxDate = moment().format('YYYY-MM-DD');
    }
  }

  /**
   * Method that invokes on click of radio btn
   * and enable/disable form based on its value
   * also currently it is only for FLOWER
   * @param event 
   */
  onHasFssaiDetailsChange(event: boolean) {
    if (this.outletsService.service === Services.Flower || this.outletsService.service === Services.Paan || this.outletsService.service === Services.Pet) {
      this.showHasFssaiDetailsField = true;
      this.hasFssaiDetails = event;
      if (this.hasFssaiDetails) {
        this.fssaiForm.enable();
        this.onHasFssaiCertiChange();
      } else {
        this.fssaiForm.disable();
      }
    }    
  }

  /**
   * Method that resets form values
   */
  onCancel() {
    this.fssaiForm.patchValue({ ...this.outletsService.outletDetails });
    this.fssaiForm.markAsPristine();
    this.onHasFssaiCertiChange();
    this.onHasFssaiDetailsChange(this.outletsService.outletDetails.hasFssaiCertificate !== null);
  }

  get hasFssaiCerti() {
    return this.fssaiForm.get('hasFssaiCertificate').value;
  }
}
