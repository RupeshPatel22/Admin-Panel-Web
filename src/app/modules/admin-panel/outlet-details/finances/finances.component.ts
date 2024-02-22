import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { maxFileUploadSizeAllowed, permissionDeniedErrorMsg, Services } from 'src/app/shared/models';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { PayoutsService } from 'src/app/shared/services/payouts.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Outlet } from '../../outlets/model/outlet';
import { gstCategoryList } from './model/finances';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.scss']
})
export class FinancesComponent implements OnInit {

  currentOutletId: string;
  allowedFileExtn = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'odt', 'pdf'];
  intermediateFileName: string;
  financesForm = new FormGroup({
    commission: new FormControl(''),
    beneficiaryName: new FormControl(''),
    bankAccountNumber: new FormControl(''),
    ifscCode: new FormControl(''),
    bankDocName: new FormControl(''),
    bankDocUrl: new FormControl(),
    kycDocName: new FormControl(''),
    kycDocUrl: new FormControl(),
    pan: new FormControl('', [Validators.required, Validators.pattern("([A-Z]){5}([0-9]){4}([A-Z]){1}")]),
    panOwnerName: new FormControl('', [Validators.required]),
    panDocName: new FormControl('', [Validators.required]),
    panDocUrl: new FormControl(''),
    gstCategory: new FormControl('', [Validators.required]),
    hasGST: new FormControl(null, [Validators.required]),
    gstNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}")]),
    gstDocName: new FormControl('', [Validators.required]),
    gstDocUrl: new FormControl(''),
    businessName: new FormControl('', [Validators.required]),
    businessAddress: new FormControl('', [Validators.required]),
    registrationNumber: new FormControl('', [Validators.required]),
    registrationDocName: new FormControl('', [Validators.required]),
    registrationDocUrl: new FormControl(''),
    hasRegistration: new FormControl(null),
  })
  speedyyChargesForm = new FormGroup({
    isSpeedyyChargesApplied: new FormControl(null, [Validators.required]),
    speedyyChargesType: new FormControl(null, [Validators.required]),
    speedyyChargesRate: new FormControl('', [Validators.required]),
  }, {validators: this.speedyyChargesRateValidator()})
  outletDetails: Outlet;
  payoutAccountsList: any[] = [];
  gstCategoryList: any;
  service: string;
  readonly Services = Services;
  showGstCategoryField: boolean = true;

  constructor(private payoutsService: PayoutsService, private outletsService: OutletsService, private toastMsgService: ToastService,
    private activeRoute: ActivatedRoute, private sharedService: SharedService) {
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.outletDetails = this.outletsService.outletDetails;
    this.getPayoutAccounts();
    this.financesForm.patchValue({ ...this.outletDetails });
    this.speedyyChargesForm.patchValue({ ...this.outletDetails });
    this.financesForm.disable();
    if (this.sharedService.hasEditAccessForOutletDetails) {
      this.enableFormFields();
      this.onHasGSTChange();
      this.onhasRegistrationChange();
      this.onSpeedyyChargesAppliedChange();
    } else {
      this.financesForm.disable();
      this.speedyyChargesForm.disable();
    }
    this.gstCategoryList = gstCategoryList[this.outletsService.service];
    this.service = this.sharedService.service;
    if (this.outletsService.service === Services.Paan || this.outletsService.service === Services.Flower || this.outletsService.service === Services.Pharmacy) {
      this.showGstCategoryField = false;
      this.financesForm.get('gstCategory').disable();
    }
    if (this.service === Services.Pet) {
      this.financesForm.get('hasRegistration').disable();
    }

  }

  /**
   * method that enable few selected form-fields
   */
  enableFormFields() {
    this.financesForm.get('pan').enable();
    this.financesForm.get('panOwnerName').enable();
    this.financesForm.get('panDocName').enable();
    this.financesForm.get('panDocUrl').enable();
    this.financesForm.get('gstCategory').enable();
    this.financesForm.get('hasGST').enable();
    this.financesForm.get('gstNumber').enable();
    this.financesForm.get('gstDocName').enable();
    this.financesForm.get('businessName').enable();
    this.financesForm.get('businessAddress').enable();
    this.speedyyChargesForm.get('isSpeedyyChargesApplied').enable();
    this.speedyyChargesForm.get('speedyyChargesType').enable();
    this.speedyyChargesForm.get('speedyyChargesRate').enable();
    this.financesForm.get('registrationNumber').enable();
    this.financesForm.get('registrationDocName').enable();
    this.financesForm.get('hasRegistration').enable();
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
  fileUpload(uploadUrl, file, controlName: string) {
    this.outletsService.uploadFile(uploadUrl, file.item(0)).subscribe(res => {
      this.financesForm['controls'][controlName].setValue(this.intermediateFileName);
      this.financesForm['controls'][controlName].markAsDirty();
    });
  }

  viewFile(controlName) {
    window.open(this.financesForm.get(controlName).value)
  }

  /**
   * Method that gets all payouts account associated with this restaurant
   */
  getPayoutAccounts() {
    this.payoutsService.getPayoutAccountsDetails(this.outletDetails.id).subscribe(res => {
      this.payoutAccountsList = [];
      for (const i of res['result']) {
        this.payoutAccountsList.push(i)
      }
    })
  }

  /**
   * Method that updates outlet details
   * @returns 
   */
  updateOutletDetails() {
    if (this.financesForm.status === 'INVALID') {
      this.toastMsgService.showError('Kindly fill up all the fields')
      this.financesForm.markAllAsTouched();
      return;
    }

    const panDetails = {};
    panDetails['pan_number'] = this.financesForm.get('pan').value;
    panDetails['pan_owner_name'] = this.financesForm.get('panOwnerName').value;
    panDetails['pan_document'] = { name: this.financesForm.get('panDocName').value };
    const gstDetails = {};
    gstDetails['gst_category'] = this.financesForm.get('gstCategory').value;
    gstDetails['has_gstin'] = this.financesForm.get('hasGST').value;
    if (this.hasGST) {
      gstDetails['gstin_number'] = this.financesForm.get('gstNumber').value;
      gstDetails['gstin_document'] = { name: this.financesForm.get('gstDocName').value }
    } else {
      gstDetails['business_name'] = this.financesForm.get('businessName').value;
      gstDetails['business_address'] = this.financesForm.get('businessAddress').value;
    }
    let registratoinDetails: any;
    if (this.service === Services.Paan || this.service === Services.Flower || this.service === Services.Pharmacy || this.service === Services.Pet) {
      registratoinDetails = {};
      registratoinDetails['has_registration'] = this.financesForm.get('hasRegistration').value;
      if(this.hasRegistration){
        registratoinDetails['registration_number'] = this.financesForm.get('registrationNumber').value;
        registratoinDetails['registration_document'] = { name: this.financesForm.get('registrationDocName').value };
      }
    }

    const data = {
      pan_details: panDetails,
      gst_details: gstDetails,
      registration_details: registratoinDetails
    }
    this.outletsService.updateOutletDetails(data, this.currentOutletId).subscribe((res) => {
      this.financesForm.patchValue({ ...this.outletsService.outletDetails });
      this.financesForm.markAsPristine();
      this.toastMsgService.showSuccess('Outlet details updated successfully');

      if (gstDetails['gst_category'] === 'hybrid' && this.service === 'food') {
        this.toastMsgService.showWarning('Kindly Updated GST Details In Menu For Items & Adds On')
      }
    });
  }

  /**
   * Method that resets form values
   */
   onCancel() {
    this.financesForm.patchValue({ ...this.outletsService.outletDetails });
    this.financesForm.markAsPristine();
    this.onHasGSTChange();
    this.onhasRegistrationChange();
  }

  /**
   * Method that updates speedyy charges details of the outlet
   * @returns 
   */
  updateSpeedyyCharges() {
    if (this.speedyyChargesForm.status === 'INVALID') {
      this.speedyyChargesForm.markAllAsTouched();
      this.toastMsgService.showError('Kindly fill up all the fields');
      return;
    }
    const data = {
      speedyy_charge_applied: this.speedyyChargesForm.get('isSpeedyyChargesApplied').value,
      speedyy_charge_type: this.speedyyChargesForm.get('speedyyChargesType').value,
      speedyy_charge_rate: this.speedyyChargesForm.get('speedyyChargesRate').value
    }

    this.outletsService.putSpeedyyChargesOnOutlet(this.currentOutletId, data).subscribe(res => {
      this.outletDetails.isSpeedyyChargesApplied = res['result']['speedyy_charge_applied'];
      this.outletDetails.speedyyChargesType = res['result']['speedyy_charge_type'];
      this.outletDetails.speedyyChargesRate = res['result']['speedyy_charge_rate'];
      this.speedyyChargesForm.markAsPristine();
      this.toastMsgService.showSuccess('Speedyy charges details updated successfully');
    })
  }

  /**
   * Method that resets form values of speedyy charges
   */
  onCancelSpeedyyCharges() {
    this.speedyyChargesForm.patchValue({ ...this.outletDetails });
    this.speedyyChargesForm.markAsPristine();
    this.onSpeedyyChargesAppliedChange();
  }

  /**
   * Method that invokes on gst change radio btn
   */
  onHasGSTChange() {
    if (this.hasGST) {
      this.financesForm['controls']['gstNumber'].enable();
      this.financesForm['controls']['gstDocName'].enable();
      this.financesForm['controls']['businessName'].disable();
      this.financesForm['controls']['businessAddress'].disable();
    } else {
      this.financesForm['controls']['gstNumber'].disable();
      this.financesForm['controls']['gstDocName'].disable();
      this.financesForm['controls']['businessName'].enable();
      this.financesForm['controls']['businessAddress'].enable();
    }
  }

  /**
   * Method that invokes on speedyy charges applied radio btn change
   */
  onSpeedyyChargesAppliedChange() {
    if (this.isSpeedyyChargesApplied) {
      this.speedyyChargesForm.get('speedyyChargesType').enable();
      this.speedyyChargesForm.get('speedyyChargesRate').enable();
    } else {
      this.speedyyChargesForm.get('speedyyChargesType').disable();
      this.speedyyChargesForm.get('speedyyChargesRate').disable();
    }
  }

  /**
   * Method that validates speedyy charges rate
   * @returns
   */
   speedyyChargesRateValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      if (this.speedyyChargesForm) {
        if (
          group.get('speedyyChargesType').value === 'percent' &&
          group['controls']['speedyyChargesRate'].value > 100
        ) {
          group['controls']['speedyyChargesRate'].setErrors({ max: { max: 100 } });
        } else {
          group['controls']['speedyyChargesRate'].setErrors(null);
        }
      }
      return;
    };
  }


  get hasGST() {
    return this.financesForm.get('hasGST').value;
  }

  get isSpeedyyChargesApplied() {
    return this.speedyyChargesForm.get('isSpeedyyChargesApplied').value;
  }

  onhasRegistrationChange() {
    if(this.hasRegistration) {
      this.financesForm['controls']['registrationNumber'].enable();
      this.financesForm['controls']['registrationDocName'].enable();
    }else{
      this.financesForm['controls']['registrationNumber'].disable();
      this.financesForm['controls']['registrationDocName'].disable();
    }
  }

  get hasRegistration() {
    return this.financesForm.get('hasRegistration').value;
  } 
}
