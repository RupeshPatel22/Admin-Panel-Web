import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rider, RiderTypeList } from '../model/rider-lists';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Roles, maxFileUploadSizeAllowed } from 'src/app/shared/models';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { OperationalCity } from '../../operational-city/model/operational-city';
import { OperationalZone } from '../../operational-zone/model/operational-zone';
import { SharedService } from 'src/app/shared/services/shared.service';
import { originalOrder } from 'src/app/shared/functions/modular.functions';

@Component({
  selector: 'app-rider-details',
  templateUrl: './rider-details.component.html',
  styleUrls: ['./rider-details.component.scss']
})
export class RiderDetailsComponent implements OnInit {

  @Input() riderDetails: Rider;
  @Output() takeAction: EventEmitter<any> = new EventEmitter();

  opCityList: OperationalCity[];
  opZoneList: OperationalZone[];
  riderOpZones: { id: number; name: string }[] = [];
  toBeDeletedRiderOpZones: any[] = [];
  riderOpZoneAction: 'Add' | 'Delete';
  riderDetailsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    riderImageName: new FormControl(''),
    maxPodInHand: new FormControl(null, [Validators.required]),
    sponsoredById: new FormControl('', [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    ifscCode: new FormControl(''),
    rejectedOrderCount: new FormControl(''),
    rejectReason: new FormControl(''),
    approvedAdminName: new FormControl(''),
    approvedAdminId: new FormControl(''),
    latitude: new FormControl(''),
    longitude: new FormControl(''),
    outOfOperationalZoneSince: new FormControl(''),
    currentOperationalZoneId: new FormControl(''),
    currentOperationalZoneName: new FormControl(''),
    aadharFrontDoc: new FormControl(''),
    aadharBackDoc: new FormControl(''),
    panDoc: new FormControl(''),
    drivingLicenseDoc: new FormControl(''),
    cancelledChequeDoc: new FormControl(''),
    createdAt: new FormControl(''),
    updatedAt: new FormControl(''),
    blockedBy: new FormControl(''),
    blockedReason: new FormControl(''),
    accountNumber: new FormControl('')
  })
  riderOpZoneForm = new FormGroup({
    opCityId: new FormControl(),
    opZoneId: new FormControl(null, [Validators.required]),
  })
  isEditRiderImage: boolean;
  reason = new FormControl('', [Validators.required]);
  readonly roles = Roles;
  showEditIcon: boolean;
  readonly riderTypes = RiderTypeList;
  readonly originalOrder = originalOrder;

  constructor(private riderService: RiderService, private toastMsgService: ToastService, private outletsService: OutletsService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getRiderOpZones();
    this.riderDetailsForm.patchValue({ ...this.riderDetails });
    this.riderDetailsForm.disable();
    if([this.roles.superadmin, this.roles.ops_manager].some(r => this.sharedService.roles.includes(r))) {
      // this.showEditIcon = true;
      this.enableFormFields();
    }
  }

  enableFormFields(){
    this.riderDetailsForm.get('name').enable();
    this.riderDetailsForm.get('phone').enable();
    this.riderDetailsForm.get('dob').enable();
    this.riderDetailsForm.get('maxPodInHand').enable();
    this.riderDetailsForm.get('type').enable();
    this.riderDetailsForm.get('sponsoredById').enable();
  }

  /**
   * Method that gets operational zones of rider
   */
  getRiderOpZones() {
    this.riderService.getRiderOperationalZones(this.riderDetails.id).subscribe(res => {
      this.riderOpZones = res['result'].map(record => ({id: record['operational_zone_id'], name: record['operational_zone_name']}));
    })
  }

  /**
   * Method that sets action for rider op zone
   * @param action 
   * @returns 
   */
  onRiderOpZoneAction(action: 'Add' | 'Delete') {
    if (this.riderOpZoneAction) return;
    if (action === 'Add') this.getOperationalCities();
    this.riderOpZoneAction = action;
  }

  /**
   * Method that does mapping of rider and operational zones
   * @returns 
   */
  addRiderOpZones() {
    console.log(this.riderOpZoneForm.get('opZoneId').value)
    if (this.riderOpZoneForm.status === 'INVALID') return this.riderOpZoneForm.markAllAsTouched();

    const data = {
      operational_zone_ids: this.riderOpZoneForm.get('opZoneId').value
    }
    this.riderService.addRiderOperationalZones(this.riderDetails.id, data).subscribe(res => {
      this.toastMsgService.showSuccess('Rider Operational zones are added successfully');
      this.riderOpZoneAction = null;
      this.riderOpZoneForm.reset();
      this.getRiderOpZones();
    })
  }

  /**
   * Method that deletes rider-operational zone mapping
   */
  deleteRiderOpZones() {
    const data = {
      operational_zone_ids: this.toBeDeletedRiderOpZones
    }
    console.log(data)
    this.riderService.deleteRiderOperationalZones(this.riderDetails.id, data).subscribe(res => {
      this.toastMsgService.showSuccess('Rider Operational zones are deleted successfully');
      this.riderOpZoneAction = null;
      this.toBeDeletedRiderOpZones = [];
    })
  }

  /**
   * method that invokes on clicking of delete icon on mat-chip
   * it adds ids of op-zones in a variable
   * @param id 
   */
  removedOpZoneIds(id: number) {
    const index = this.riderOpZones.findIndex(zone => zone.id === id);
    this.riderOpZones.splice(index, 1);
    this.toBeDeletedRiderOpZones.push(id);
  }

  /**
  * Method that gets all city list
  */
  getOperationalCities() {
    const data = {
      filter: {}
    }
    this.riderService.filterOperationalCity(data).subscribe(res => {
      this.opCityList = [];
      for (const i of res['result']['records']) {
        this.opCityList.push(OperationalCity.fromJson(i));
      }
    })
  }

  /**
   * Method that gets all zones by city id
   */
   getOpZonesByCityId() {
    if (!this.riderOpZoneForm.get('opCityId').value) return;
    const data = {
      filter: {
        operational_city_id: [this.riderOpZoneForm.get('opCityId').value],
        is_deleted: false
      }
    }
    this.riderService.filterOperationalZone(data).subscribe(res => {
      this.opZoneList = [];
      for (const i of res['result']['records']) {
        this.opZoneList.push(OperationalZone.fromJson(i));
      }
    })
  }

  /**
   * Method that opens file in new tab
   * @param url 
   */
  viewFile(url: string) {
    window.open(url)
  }

  unblockRider() {
    this.takeAction.emit({ action: 'un-block', riderId: this.riderDetails.id })
  }

  /**
   * Method that emits reason to block/unblock rider
   * @returns 
   */
  blockRider() {
    if (this.reason.status === 'INVALID') {
      this.reason.markAsTouched();
      return;
    }
    this.takeAction.emit({ action: 'block', riderId: this.riderDetails.id, reason: this.reason.value });
  }

  /**
   * Method that clear reason formControl
   */
  onClear() {
    this.reason.reset();
  }

  /**
   * Method that update rider details
   * @param riderId 
   */
  updateRiderDetails(riderId: string) {
    let data: any = {
      name: this.riderDetailsForm.get('name').value,
      phone: this.riderDetailsForm.get('phone').value,
      date_of_birth: this.riderDetailsForm.get('dob').value,
      image: { name: this.riderDetailsForm.get('riderImageName').value },
      max_pod_in_hand: this.riderDetailsForm.get('maxPodInHand').value,
      type: this.riderDetailsForm.get('type').value,
    }
    if (data.type === 'sponsored') {
      data.sponsored_by_id = this.riderDetailsForm.get('sponsoredById').value;
    }
    this.riderService.putRiderDetailUpdate(riderId, data).subscribe(res => {
      this.riderDetailsForm.markAsPristine();
      this.toastMsgService.showSuccess('Rider details updated successfully');
      this.riderDetails.riderImageUrl = res['result']['image'].url;
    });
    this.isEditRiderImage = false;
  }

  /**
   * Method that cancel updation of rider details
   */
  onCancel() {
    this.riderDetailsForm.patchValue({ ...this.riderDetails });
    this.riderDetailsForm.markAsPristine();
    this.isEditRiderImage = false;
  }

  /**
    * Method that checks whether user is uploading file with correct extn
    * and then gets url to upload the file with api call
    * @param file 
    */
  getFileUploadUrl(file: FileList) {
    this.isEditRiderImage = true;
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1)
    if (!['jpg', 'jpeg', 'png'].includes(fileExtn)) {
      this.toastMsgService.showError('Kindly choose correct file')
      return;
    }
    if (file.item(0).size > maxFileUploadSizeAllowed) return this.toastMsgService.showError('Kindly check the size of file');
    this.outletsService.getFileUploadUrl(fileExtn).subscribe(res => {
      this.riderDetailsForm.get('riderImageName').setValue(res['result']['file_name']);
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

}
