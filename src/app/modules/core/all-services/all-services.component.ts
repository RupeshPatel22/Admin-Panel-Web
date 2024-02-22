import { Component, OnInit, ViewChild } from '@angular/core';
import { AllServicesService } from 'src/app/shared/services/all-services.service';
import { AllServices } from './model/all-services';
import { Roles, pageSizeOptions } from 'src/app/shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent implements OnInit {
  allServicesList: AllServices[];
  displayedColumns: string[] = ['imageUrl', 'name', 'sequence', 'showOnAndroid', 'showOnIos', 'statusOnAndroid', 'statusOnIos', 'edit'];
  pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedService: AllServices;
  showServiceDetailsModal: boolean;
  subscriptions: Subscription[] = [];
  serviceFormGroup: FormGroup;
  serviceImageUrl: any;
  serviceImageName: string;

  constructor(
    private allServices: AllServicesService,
    private outletsService: OutletsService,
    private toastMsgService: ToastService,
    private sanitizer: DomSanitizer,
    private sharedServices: SharedService
  ) {}

  ngOnInit(): void {
    this.setAllServicesList();
    this.initServiceFormGroup();
    if([Roles.admin].some(r => this.sharedServices.roles.includes(r))) {
      this.displayedColumns = this.displayedColumns.filter(c => c !== 'edit');
    }
  }

  /**
   * Method that set value in form controls
   */
  initServiceFormGroup() {
    this.serviceFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
      sequence: new FormControl('', [Validators.required]),
      showOnAndroid: new FormControl('', [Validators.required]),
      showOnIos: new FormControl('', [Validators.required]),
      statusOnAndroid: new FormControl('', [Validators.required]),
      statusOnIos: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [Validators.required]),
      imageName: new FormControl('',[Validators.required])
    });
  }

  /**
   * Method that show all service list
   */
  setAllServicesList() {
    this.allServices.getAllServices().subscribe((data) => {
      if (data['status'] === true) {
        this.allServicesList = data['result']['services'].map((c) => AllServices.fromJson(c));
      }
    });
  }

  /**
   * Method that open service detail modal
   * @param service 
   */
  openServiceDetailsModal(service: AllServices) {
    this.selectedService = service;
    this.showServiceDetailsModal = true;
    this.serviceFormGroup.patchValue(this.selectedService);
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
    this.subscriptions.push(this.outletsService.getFileUploadUrl(fileExtn).subscribe(data => {
      const res = data;
      this.serviceImageName = res['result']['file_name'];
      this.serviceFormGroup['controls']['imageName'].setValue(res['result']['file_name']);
      this.serviceFormGroup['controls']['imageUrl'].setValue(res['result']['uploadUrl']);
      this.fileUpload(res['result']['uploadUrl'], file);

    }));
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file) {
    this.subscriptions.push(this.outletsService.uploadFile(uploadUrl, file.item(0)).subscribe(data => {
      const res = data;
      this.serviceImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file.item(0)));  //to show image preview
      this.serviceFormGroup['controls']['imageUrl'].setValue(this.serviceImageUrl);
    }));
  }

  /**
   * Method that close service detail modal
   */
  closeServiceDetailsModal() {
    this.showServiceDetailsModal = false;
  }

  /**
   * Method that update service details 
   * @param id 
   */
  updateServices(id: string) {
    const imageName = this.serviceFormGroup.get('imageName').value;
    const data = {
      name: this.serviceFormGroup.get('name').value,
      sequence: this.serviceFormGroup.get('sequence').value,
      show_on_android: this.serviceFormGroup.get('showOnAndroid').value,
      show_on_ios: this.serviceFormGroup.get('showOnIos').value,
      status_on_android: this.serviceFormGroup.get('statusOnAndroid').value,
      status_on_ios: this.serviceFormGroup.get('statusOnIos').value,
      image: {
        name: imageName
      }
    }
    if(imageName === "" || imageName === null || this.serviceFormGroup.get('imageName').value !== this.serviceImageName){
      data['image'] = null;
    }
    this.allServices.putServices(id, data).subscribe(res => {
      this.toastMsgService.showSuccess('Service details updated successfully');
      this.setAllServicesList();
      this.serviceFormGroup.reset();
      this.serviceImageName = "";
    });
    this.showServiceDetailsModal = false;
  }
}
