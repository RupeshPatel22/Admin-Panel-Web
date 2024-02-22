/// <reference types="@types/googlemaps" />
import { ElementRef, ViewChild } from '@angular/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { maxFileUploadSizeAllowed, permissionDeniedErrorMsg, Services } from 'src/app/shared/models/constants/constant.type';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { CityAreaService } from 'src/app/shared/services/city-area.service';
import { UserService } from 'src/app/shared/services/user.service';
import { RestaurantPocDesignation } from '../../outlets/model/outlet';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  cuisineList = [];
  primaryCuisinesList: any[];
  generalForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    areaId: new FormControl('', [Validators.required]),
    // type: new FormControl(''),
    cuisines: new FormControl(),
    status: new FormControl(),
    longDistanceAllowed: new FormControl(),
    isPureVeg: new FormControl(''),
    id: new FormControl(''),
    // slug: new FormControl(''),
    // uuid: new FormControl(''),
    brandId: new FormControl(''),
    totalReviews: new FormControl(''),
    avgRating: new FormControl(''),
    cityId: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    searchLocation: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    ownerContactNumber: new FormControl(''),
    managerContactNumber: new FormControl(''),
    latitude: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    ownerEmailId: new FormControl(''),
    managerEmailId: new FormControl(''),
    likeCount: new FormControl(''),
    dislikeCount: new FormControl(''),
    branchName: new FormControl(''),
    state: new FormControl('', [Validators.required]),
    pocNumber: new FormControl(''),
    speedyyAccountManagerId: new FormControl(''),
    genuinePrice: new FormControl('', [Validators.required]),
    outletType: new FormControl('', [Validators.required]),
    pocList: this.formBuilder.array([]),
    primaryManagerId: new FormControl(null),
    primaryManagerName: new FormControl(''),
    hasSponsoredRider: new FormControl(''),
    drugLicenseNumber: new FormControl('', [Validators.required]),
    drugRetailDoc: new FormControl('', [Validators.required]),
    drugRetailDocUrl: new FormControl(''),
    drugWholeSaleDoc: new FormControl('', [Validators.required]),
    drugWholeSaleDocUrl: new FormControl(''),
    turnDebugModeOn: new FormControl('', Validators.required),
    primaryCuisines: new FormControl()
  });
  readonly Services = Services;
  readonly restaurantPocDesignation = RestaurantPocDesignation;
  service: string;
  currentOutletId: string;
  lat: number;
  long: number;
  geoCoder;
  zoom: number;
  @ViewChild('search')
  public searchLocation: ElementRef;
  cityList: any[] = [];
  areaList: any[] = [];
  adminNames: any[] = [];
  intermediateFileName: string;
  allowedFileExtn = ['jpg', 'jpeg', 'png', 'doc', 'docx', 'odt', 'pdf'];

  constructor(
    private dataDumpService: DataDumpService,
    private outletsService: OutletsService,
    private activeRoute: ActivatedRoute,
    private toastMsgService: ToastService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private cityAreaService: CityAreaService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.service = this.outletsService.service;
    if (this.service !== Services.Grocery) {
      this.setCuisineList();
    } 
    this.generalForm.patchValue({ ...this.outletsService.outletDetails });
    this.generalForm.disable();
    this.setCityList();
    this.setAdminNameList();
    this.setAreaList();
    if (this.sharedService.hasEditAccessForOutletDetails) this.enableFormFields();
    this.lat = this.outletsService.outletDetails.latitude;
    this.long = this.outletsService.outletDetails.longitude;
    this.fillUpPocList();
    if(this.service !== Services.Pharmacy){
      this.generalForm.get('drugLicenseNumber').disable();
      this.generalForm.get('drugRetailDoc').disable();
      this.generalForm.get('drugRetailDocUrl').disable();
      this.generalForm.get('drugWholeSaleDoc').disable();
      this.generalForm.get('drugWholeSaleDocUrl').disable();
    }
  }

  initPocList() {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      pocNumber: new FormControl('', [Validators.required]),
      isPrimary: new FormControl('', [Validators.required]),
      designation: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Method that enables few form controls
   */
  enableFormFields() {
    this.generalForm.get('name').enable();
    this.generalForm.get('branchName').enable();
    this.generalForm.get('cityId').enable();
    this.generalForm.get('areaId').enable();
    this.generalForm.get('searchLocation').enable();
    this.generalForm.get('latitude').enable();
    this.generalForm.get('longitude').enable();
    this.generalForm.get('postalCode').enable();
    this.generalForm.get('pocNumber').enable();
    this.generalForm.get('speedyyAccountManagerId').enable();
    this.generalForm.get('genuinePrice').enable();
    if(this.service === Services.Food){
      this.generalForm.get('outletType').enable();
    }
    this.generalForm.get('pocList').enable();
    this.generalForm.get('primaryManagerId').enable();
    this.generalForm.get('hasSponsoredRider').enable();
    this.generalForm.get('drugLicenseNumber').enable();
    this.generalForm.get('drugRetailDoc').enable();
    this.generalForm.get('drugWholeSaleDoc').enable();
    if(this.service === Services.Food)
    this.generalForm.get('turnDebugModeOn').enable();
    this.generalForm.get('isPureVeg').enable();
    this.generalForm.get('cuisines').enable();
    this.generalForm.get('primaryCuisines').enable();
  }

  /**
 * Getter method to access the FormArray named 'pocList' from the generalForm.
 * @returns {FormArray} The 'pocList' FormArray.
 */
  get pocListArray() {
    return this.generalForm.get('pocList') as FormArray;
  }
  
  /**
 * Method to Clears the existing POC list array and populates it with POC items from outletDetails.
 */
  fillUpPocList(){
    this.pocListArray.clear();
    this.outletsService.outletDetails.pocList.forEach((pocItem, index) => {
      this.pocListArray.push(this.initPocList());
      this.pocListArray['controls'][index].patchValue(pocItem);
    })
    if (!this.sharedService.hasEditAccessForOutletDetails) this.pocListArray.disable();
  }

  addPocEntry() {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    this.pocListArray.push(this.initPocList());
    this.pocListArray.markAsDirty();
  }

  /**
 * Removes the POC entry at the specified index from the 'pocList' FormArray
 * and marks the FormArray as dirty.
 * @param {number} index - The index of the POC entry to remove.
 */
  
  removePocEntry(index: number) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    this.pocListArray.removeAt(index);
    this.pocListArray.markAsDirty()
  }

  /**
   * Method that sets cuisines list
   */
  setCuisineList() {
    this.dataDumpService.getCuisinesList().subscribe((res) => {
      this.cuisineList = res['result'];
      this.primaryCuisinesList = this.cuisineList.filter(c => this.generalForm.get('cuisines').value.includes(c.id));
    });
  }

  /**
   * Method that sets city list
   */
  setCityList() {
    this.cityAreaService.getCityList().subscribe(res => {
      this.cityList = [];
      for (const c of res['result']) {
        this.cityList.push(c);
      }
    })
  }

  /**
   * Method that sets area list based on cityId
   * @returns 
   */
  setAreaList() {
    if (!this.generalForm.get('cityId').value) {
      return
    }
    const data = {
      filter: {
        city_ids: [this.generalForm.get('cityId').value]
      }
    }
    this.cityAreaService.postFilterAreaPolygon(data).subscribe(res => {
      this.areaList = [];
      // this.generalForm.get('areaId').reset();
      for (const c of res['result']) {
        this.areaList.push(c);
      }
    })
  }

  /**
   * Updates the outlet details and updates the 'outletName' parameter in the URL.
   * @param data The updated outlet details.
   */
  updateOutletDetails() {
    if (this.generalForm.status === 'INVALID') {
      this.toastMsgService.showError('Kindly fill up all the fields');
      this.generalForm.markAllAsTouched();
      return;
    }

    const pocListValues = this.generalForm.get('pocList').value.map((pocItem: any) => {
      return {
        name: pocItem.name,
        number: pocItem.pocNumber,
        is_primary: pocItem.isPrimary,
        designation: pocItem.designation
      };
    });
    const data = {
      name: this.generalForm.get('name').value,
      branch_name: this.generalForm.get('branchName').value || null,
      postal_code: this.generalForm.get('postalCode').value,
      lat: this.generalForm.get('latitude').value,
      long: this.generalForm.get('longitude').value,
      location: this.generalForm.get('address').value,
      state: this.generalForm.get('state').value,
      area_id: this.generalForm.get('areaId').value,
      city_id: this.generalForm.get('cityId').value,
      speedyy_account_manager_id: this.generalForm.get('speedyyAccountManagerId').value || null,
      genuine_price: this.generalForm.get('genuinePrice').value,
      type: this.generalForm.get('outletType').value,
      poc_list: pocListValues.length > 0 ? pocListValues : null,
      primary_manager_id: this.generalForm.get('primaryManagerId').value || null,
      has_sponsored_rider: this.generalForm.get('hasSponsoredRider').value,
      is_pure_veg: this.generalForm.get('isPureVeg').value,
    };
    if(this.service === Services.Food){
      data['turn_debug_mode_on']  = this.generalForm.get('turnDebugModeOn').value;
      if(this.generalForm.get('primaryCuisines').value === null){
        data['primary_cuisine_ids'] = null;
      } else if(this.generalForm.get('primaryCuisines').value){
        if(this.generalForm.get('primaryCuisines').value.length  > 0) {
          data['primary_cuisine_ids'] = this.generalForm.get('primaryCuisines').value
        } else {
          data['primary_cuisine_ids'] = null;
        }
      }
    }
    if(this.generalForm.get('cuisines').value === null) {
      data['cuisine_ids'] = null;
    } else if(this.generalForm.get('cuisines').value) {
      if(this.generalForm.get('cuisines').value.length > 0) {
        data['cuisine_ids'] = this.generalForm.get('cuisines').value
      } else {
        data['cuisine_ids'] = null;
      }
    }
    if(this.service === Services.Pharmacy) {
        data['drug_license_details'] =  { 
          drug_license_number: this.generalForm.get('drugLicenseNumber').value,
          drug_retail_document: { name: this.generalForm.get('drugRetailDoc').value },
          drug_wholesale_document: { name: this.generalForm.get('drugWholeSaleDoc').value }
        }
      }
 // Update the 'outletName' parameter in the URL
    this.outletsService.updateOutletDetails(data, this.currentOutletId).subscribe((res) => {
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { outletName: res['result']['name'] },
        queryParamsHandling: 'merge',
      });
      this.generalForm.markAsPristine();
      this.toastMsgService.showSuccess('Outlet details updated successfully');
    });
    this.setCuisineList();
  }


  /**
   * Method that resets form values
   */
  onCancel() {
    this.generalForm.patchValue({ ...this.outletsService.outletDetails });
    this.setAreaList();
    this.fillUpPocList();
    this.generalForm.markAsPristine();
  }

  /**
   * Method that invokes when agm-map is initialized
   */
  onMapReady() {
    this.geoCoder = new google.maps.Geocoder();
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchLocation.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        this.lat = place.geometry.location.lat();
        this.long = place.geometry.location.lng();
        this.zoom = 12;
        this.getAddress(this.lat, this.long);
      });
    });
  }

  /**
   * Method that sets lat, lang and address after
   * user sets pin on one place
   * @param event
   */
  markerDragged(event) {
    this.lat = event.coords.lat;
    this.long = event.coords.lng;
    this.getAddress(this.lat, this.long);
  }

  /**
  * Method that inovokes when user changes lat/long field
  * and then updates pincode, location and marker in map
  * @param changeType 
  */
  latLongChange(changeType: 'lat' | 'long') {
    if (changeType === 'lat') {
      this.lat = Number(this.generalForm['controls']['latitude']['value']);
    }
    if (changeType === 'long') {
      this.long = Number(this.generalForm['controls']['longitude']['value']);
    }
    this.getAddress(this.lat, this.long)
  }

  /**
   * Method that get address based on parameter passed
   * @param latitude
   * @param longitude
   */
  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            for (const a in results[0]['address_components']) {
              if (
                results[0]['address_components'][a]['types'].includes(
                  'administrative_area_level_1'
                )
              ) {
                this.generalForm['controls']['state'].setValue(
                  results[0]['address_components'][a]['long_name']
                );
              }
              if (
                results[0]['address_components'][a]['types'].includes(
                  'postal_code'
                )
              ) {
                this.generalForm['controls']['postalCode'].setValue(
                  results[0]['address_components'][a]['long_name']
                );
              }
            }
            this.zoom = 12;
            this.generalForm['controls']['address'].setValue(
              results[0].formatted_address
            );
            this.generalForm['controls']['latitude'].setValue(this.lat);
            this.generalForm['controls']['longitude'].setValue(this.long);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }
  /**
 * Method that sets admin name list
 */
  setAdminNameList() {
    const data = {
      "pagination": {
        "page_index": 0,
        "page_size": 50
      }
    };
    this.userService.filterAdminUsers(data).subscribe(res => {
      this.adminNames = [];
      for (const a of res['result'].records) {
        this.adminNames.push(a);
      }
    })
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
      this.generalForm['controls'][controlName].setValue(this.intermediateFileName);
      this.generalForm['controls'][controlName].markAsDirty();
    });
  }

  viewFile(controlName: string) {
    window.open(this.generalForm['controls'][controlName].value);
  }


}
