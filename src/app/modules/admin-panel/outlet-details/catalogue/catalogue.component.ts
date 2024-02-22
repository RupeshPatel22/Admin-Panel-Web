import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { maxFileUploadSizeAllowed, permissionDeniedErrorMsg, Services } from 'src/app/shared/models/constants/constant.type';
import { IOutletImage, Outlet, OutletImageAction, PackagingChargesTypes, packagingChargesTypesList } from '../../outlets/model/outlet';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { DeliverySplitting, SplittingShareType } from './model/catalogue';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit, AfterViewChecked {

  outletPrimaryImage: IOutletImage;
  outletImages: IOutletImage[];
  canEditImages: boolean;
  catalogueForm = new FormGroup({
    minOrderAmount: new FormControl(''),
    defaultPrepTime: new FormControl('', [Validators.required, Validators.min(5), Validators.max(120)]),
    costOfTwo: new FormControl('', Validators.required),
    deliveryChargesPaidBy: new FormControl({disabled: true, value: ''}, [Validators.required]),
    isDeliveryChargesPaidByOutlet: new FormControl({disabled: true, value: ''}, [Validators.required]),
    minOrderValForFreeDeliveryByOutlet: new FormControl({disabled: true, value: ''}, [Validators.required]),
    deliveryChargesThreshold: new FormControl(''),
    codLimit: new FormControl(''),
    codVerifaicationLimit: new FormControl(''),
    minimumCharges: new FormControl(''),
    orderLevelPackagingCharges: new FormControl({disabled: true, value: ''}, [Validators.required, Validators.max(50)]),
    serviceCharges: new FormControl(''),
    deliveryCharges: new FormControl(''),
    nightDeliveryCharges: new FormControl(''),
    itemCGST: new FormControl(''),
    itemSGST: new FormControl(''),
    itemIGST: new FormControl(''),
    isItemInclusive: new FormControl(''),
    packagingChargesCGST: new FormControl(''),
    packagingChargesSGST: new FormControl(''),
    packagingChargesIGST: new FormControl(''),
    isPackagingChargesInclusive: new FormControl(''),
    serviceCGST: new FormControl(''),
    serviceSGST: new FormControl(''),
    serviceIGST: new FormControl(''),
    packagingChargesType: new FormControl('', [Validators.required]),
    agreedSpeedyyChargePercentage: new FormControl(''),
    packgingChargeSlabApplied: new FormControl(''),
  })

  deliverySplittingForm = new FormGroup({
    normal: new FormArray([], {validators: [this.customOrderValueValidator()]}),
  })
  readonly Services = Services;
  service: string;
  @ViewChild('carouselHolder') carouselHolder: ElementRef;
  isCarouselVisible: boolean;
  subscriptions: Subscription[] = [];
  currentOutletId: string;
  openImageActionModal: boolean;
  fileName: string;
  outletImageAction: OutletImageAction;
  showPackagingChargesField: boolean;
  showMinOrderValForFreeDeliveryByOutletField: boolean;
  outletDetails: Outlet;
  readonly originalOrder = originalOrder;
  readonly packagingChargesTypesList = packagingChargesTypesList;
  readonly splittingShareType = SplittingShareType;

  constructor(private dialog: MatDialog, private outletsService: OutletsService, private activeRoute: ActivatedRoute,private toastMsgService: ToastService,private sharedService: SharedService) {
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
   }

  ngOnInit(): void {
    this.service = this.outletsService.service;
    this.outletDetails = this.outletsService.outletDetails;
    this.catalogueForm.patchValue({ ...this.outletDetails })
    this.outletPrimaryImage = this.outletDetails.outletPrimaryImage
    this.outletImages = this.outletDetails.outletImages;
    this.onPackagingChargesTypeChange();
    this.onDeliveryChargesPaidByOutletChange();
    this.fillUpDeliverySplittingForm();
    this.catalogueForm.get('agreedSpeedyyChargePercentage').disable()
    if (!this.sharedService.hasEditAccessForOutletDetails) this.catalogueForm.disable();
  }

  ngAfterViewChecked() {
    this.showCarousel();
  }

  viewFile() {
    window.open(this.catalogueForm.get('outletImageUrl').value)
  }

  /**
   * Method that checks width of parent element of carousel is greater than 0 
   * and sets isCarouselVisible = true 
   */
  showCarousel(): void {
    if (this.carouselHolder.nativeElement.clientWidth > 0 && !this.isCarouselVisible) {
      setTimeout(() => {
        this.isCarouselVisible =  true;
      }, 0);
    }
  }
  /**
   * Method that opens all images in the modal
   */
  toggleImagesModal(){
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    this.openImageActionModal = !this.openImageActionModal;
    this.isCarouselVisible = !this.isCarouselVisible;
  }

  /**
  * Method that checks whether user is uploading file with correct extn
  * and then gets url to upload the file with api call
  * @param file 
  */
  getFileUploadUrl(file: FileList, action: OutletImageAction, additionalImgIndex?: number) {
    const index = (file.item(0).name.lastIndexOf('.'))
    const fileExtn = file.item(0).name.substring(index + 1).toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExtn)) {
      this.toastMsgService.showError('Kindly choose image file')
      return;
    }
    if (file.item(0).size > maxFileUploadSizeAllowed) return this.toastMsgService.showError('Kindly check the size of file');
    this.outletImageAction = action;
    this.outletsService.getFileUploadUrl(fileExtn).subscribe(res => {
      this.fileName = res['result']['file_name'];
      this.fileUpload(res['result']['uploadUrl'], file, additionalImgIndex);

    });
  }

  /**
   * Method that upload file to aws-s3 bucket with api call
   * @param uploadUrl 
   * @param file 
   */
  fileUpload(uploadUrl, file: FileList, additionalImgIndex?: number) {
    this.outletsService.uploadFile(uploadUrl, file.item(0)).subscribe(res => {
      if (this.outletImageAction === 'AddAdditional') {
        this.addOutletImage();
      } else {
        this.editOutletImage(additionalImgIndex);
      }
      
    });
  }

  /**
   * Method that adds additional outlet image and then update outlet details through api call
   */
  addOutletImage() {
    const images: IOutletImage[] = this.outletImages;
    images.push({ name: this.fileName });
    const data = this.outletImagesToJson(images);
    this.updateOutletDetails(data);
  }

  /**
   * Method that edits primary or additional outlet image and then update outlet details through api call
   * @param index 
   */
  editOutletImage(index?: number) {
    let images: IOutletImage[];

    if (this.outletImageAction === 'EditAdditional') {
      images = this.outletImages;
      images[index]['name'] = this.fileName;
    }
    if (this.outletImageAction === 'EditPrimary') {
      images = [{ name: this.fileName }];
    }
    const data = this.outletImagesToJson(images);
    this.updateOutletDetails(data);
  }

  /**
   * Method that deletes additional outlet image and then update outlet details through api call
   * @param index 
   */
  deleteOutletImage(index: number) {
    const images: IOutletImage[] = this.outletImages;
    images.splice(index, 1);

    const data = this.outletImagesToJson(images);
    this.updateOutletDetails(data);
  }

  /**
   * Method that updates outlet details
   * @param data 
   */
  updateOutletDetails(data: any) {
    this.outletsService.updateOutletDetails(data,this.currentOutletId).subscribe(res => {
      this.outletPrimaryImage = res['result']['image'];
      this.outletImages = res['result']['images']; 
      this.toastMsgService.showSuccess('Outlet details updated successfully');
    });
  }

  /**
   * Method that returns data to be sent via api call
   * @param outletImages 
   * @returns 
   */
  outletImagesToJson(outletImages: IOutletImage[]) {
    const data = {};

    if (this.outletImageAction === 'EditPrimary') {
      data['image'] = { name: outletImages[0]['name'] };
    }
    else {
      data['images'] = [];
      outletImages.forEach(img => {
        data['images'].push({ name: img.name });
      })
    }
    return data;
  }

  /**
   * Method that edits outlet details
   */
   editOutletDetails(){
    if (this.catalogueForm.status === 'INVALID') {
      this.toastMsgService.showError('Kindly fill up all the fields');
      this.catalogueForm.markAllAsTouched();
      return;
    } 
    const data = {
      default_preparation_time: this.catalogueForm.get('defaultPrepTime').value,
      // delivery_charge_paid_by: this.catalogueForm.get('deliveryChargesPaidBy').value,
      packing_charge_type: this.catalogueForm.get('packagingChargesType').value,
      packging_charge_slab_applied: this.catalogueForm.get('packgingChargeSlabApplied').value,
      cost_of_two: this.catalogueForm.get('costOfTwo').value
    }
    if ((this.catalogueForm.get('packagingChargesType').value as PackagingChargesTypes) === 'order') {
      data['packing_charge_order'] =   {
        packing_charge: this.catalogueForm.get('orderLevelPackagingCharges').value
      }
    }
    const isDeliveryChargesPaidByOutlet = this.catalogueForm.get('isDeliveryChargesPaidByOutlet').value;
    const minOrderValForFreeDeliveryByOutlet = isDeliveryChargesPaidByOutlet 
      ? this.catalogueForm.get('minOrderValForFreeDeliveryByOutlet').value : undefined;
    
    // if (this.outletsService.service === Services.Food) {
    //   data['delivery_charge_paid_by_restaurant'] = isDeliveryChargesPaidByOutlet;
    //   data['min_order_value_for_restaurant_free_delivery'] = minOrderValForFreeDeliveryByOutlet;
    // } else if (this.outletsService.service === Services.Grocery) {
    //   data['delivery_charge_paid_by_store'] = isDeliveryChargesPaidByOutlet;
    //   data['min_order_value_for_store_free_delivery'] = minOrderValForFreeDeliveryByOutlet;
    // }
    // else if (this.outletsService.service === Services.Paan || this.outletsService.service === Services.Flower || this.outletsService.service === Services.Pharmacy || this.outletsService.service === Services.Pet){
    //   data['delivery_charge_paid_by_outlet'] = isDeliveryChargesPaidByOutlet;
    //   data['min_order_value_for_outlet_free_delivery'] = minOrderValForFreeDeliveryByOutlet;
    // }
    this.catalogueForm.markAsPristine();
    this.updateOutletDetails(data);
  }
  
  /**
   * Method that resets form values
   */
  onCancel() {
    this.catalogueForm.patchValue({ ...this.outletsService.outletDetails });
    this.onPackagingChargesTypeChange();
    this.onDeliveryChargesPaidByOutletChange();
    this.catalogueForm.markAsPristine();
  }

  /**
   * Method that fill up delivery splitting form
   */
  fillUpDeliverySplittingForm() {
    this.normalDeliverySplittingArr.clear();
    this.removeLongDistanceDeliverySplitting();
    if (this.outletDetails.deliverySplitting?.normal) {
      this.outletDetails.deliverySplitting.normal.forEach(() => this.addNormalDeliverySplittingSlab());
    }
    if (this.outletDetails.deliverySplitting.longDistance) {
      this.addLongDistanceDeliverySplitting();
    }
    this.deliverySplittingForm.patchValue({ ...this.outletDetails.deliverySplitting });
  }

  /**
   * Metohd that returns common formControls
   * which will be used in normal and longDistance
   * @returns 
   */
  commonDeliverySplittingControls() {
    return {
      shareType: new FormControl(null, [Validators.required]),
      vendorShare: new FormControl(),
      customerShare: new FormControl(),
      speedyyShare: new FormControl(),
    }
  }

  get normalDeliverySplittingArr() {
    return this.deliverySplittingForm.get('normal') as FormArray;
  }

  /**
   * Method that returns fg for normalDS slab
   * @returns 
   */
  initNormalDeliverySplittingSlab() {
    return new FormGroup({
      minOrderValue: new FormControl(null, [Validators.required]),
      maxOrderValue: new FormControl(),
      ...this.commonDeliverySplittingControls()
    }, {validators: [this.customDeliverySplittingValidator()]})
  }

  /**
   * adds normalDS slab
   */
  addNormalDeliverySplittingSlab() {
    this.normalDeliverySplittingArr.push(this.initNormalDeliverySplittingSlab());
  }

  /**
   * removed normalDS slab from particular index
   * @param index 
   */
  removeNormalDeliverySplittingSlab(index: number) {
    if (this.normalDeliverySplittingArr.length > 1) {
      this.normalDeliverySplittingArr.removeAt(index);
    }
  }

  get longDistanceDeliverySplittingGrp() {
    return this.deliverySplittingForm.get('longDistance') as FormGroup;
  }

  /**
   * Method that returns fg for long distance DS
   * @returns 
   */
  initLongDistanceDeliverySplitting() {
    return new FormGroup({ ...this.commonDeliverySplittingControls() }, {validators: [this.customDeliverySplittingValidator()]});
  }

  /**
   * adds long-distance DS
   */
  addLongDistanceDeliverySplitting() {
    this.deliverySplittingForm.addControl('longDistance', this.initLongDistanceDeliverySplitting());
  }

  /**
   * removes fg for long-distance DS
   */
  removeLongDistanceDeliverySplitting() {
    this.deliverySplittingForm.removeControl('longDistance');
  }

  /**
   * Method that updates delivery splitting
   * @returns 
   */
  updateDeliverySplitting() {
    if (this.deliverySplittingForm.status === 'INVALID') {
      this.deliverySplittingForm.markAllAsTouched();
      this.toastMsgService.showError('Kindly fill up all the fields');
      return;
    }
    const formValues = this.deliverySplittingForm.getRawValue();
    const data = new DeliverySplitting();
    Object.assign(data, formValues);
    this.outletsService.putDeliverySplittingOnOutlet(this.currentOutletId, data.toJson()).subscribe(res => {
      this.outletDetails.deliverySplitting = DeliverySplitting.fromJson(res['result']['delivery_splitting']);
      this.deliverySplittingForm.markAsPristine();
      this.toastMsgService.showSuccess('Delivery Splitting updated successfully');
    })
  }

  /**
   * Method that resets delivery splitting
   */
  onCancelDeliverySplitting() {
    this.fillUpDeliverySplittingForm();
    this.deliverySplittingForm.markAsPristine();
  }

  /**
   * Method that validates delivery share based on shareType
   * @returns 
   */
  customDeliverySplittingValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const shareType = group['controls']['shareType']['value'];
      const vendorShare = group['controls']['vendorShare'];
      const customerShare = group['controls']['customerShare'];
      const speedyyShare = group['controls']['speedyyShare'];
      if (shareType) {
        const entries = 
        (vendorShare.value == null ? 0 : 1) +
        (customerShare.value == null ? 0 : 1) +
        (speedyyShare.value == null ? 0 : 1)
        if (shareType === 'percent') {
          if (entries !== 3) vendorShare.setErrors({deliveryShareFieldLimit: 'all'});
          else if (vendorShare.value + customerShare.value + speedyyShare.value !== 100) vendorShare.setErrors({deliveryShareMax: true});
          else vendorShare.setErrors(null)
        }
        else if (shareType === 'fixed') {

          if (entries !== 2) vendorShare.setErrors({deliveryShareFieldLimit: 'exact 2'})
          else vendorShare.setErrors(null)
        }
      }
      return
    }
  }

  /**
   * Method that validates min and max order value of all slabs
   * @returns 
   */
  customOrderValueValidator(): ValidatorFn {
    return (arr: FormArray): ValidationErrors => {
      for (let i = 0; i < arr.length; i++) {
        const slab = arr['controls'][i] as FormGroup;
        const nextSlab = arr['controls'][i + 1] as FormGroup;
        const slabMinOrderVal = slab['controls']['minOrderValue'];
        const slabMaxOrderVal = slab['controls']['maxOrderValue'];
        if (slabMaxOrderVal.value && slabMinOrderVal.value >= slabMaxOrderVal.value ) slabMaxOrderVal.setErrors({maxOrderVal: true});
        else slabMaxOrderVal.setErrors(null);
        
        if (nextSlab) {
          const nextSlabMinOrderVal = nextSlab['controls']['minOrderValue'];
          if (slabMaxOrderVal.value !== nextSlabMinOrderVal.value) nextSlabMinOrderVal.setErrors({nextSlabMinOrderVal: i + 1});
          else {
            if (nextSlabMinOrderVal.errors) {
              delete nextSlabMinOrderVal.errors.nextSlabMinOrderVal;
              if (Object.keys(nextSlabMinOrderVal.errors).length === 0) {
                nextSlabMinOrderVal.setErrors(null); // Remove all errors if none are left
              } 
            }
          }
        }
      }
      return
    }
  }

  /**
   * Method that show/hide packaging charges field based on type selected
   */
  onPackagingChargesTypeChange() {
    const packagingChargesType: PackagingChargesTypes = this.catalogueForm.get('packagingChargesType').value;
    if (packagingChargesType === 'order') {
      this.showPackagingChargesField = true;
      this.catalogueForm.get('orderLevelPackagingCharges').enable();
    } else {
      this.showPackagingChargesField = false;
      this.catalogueForm.get('orderLevelPackagingCharges').disable();
    }
  }

  /**
   * Method that shows min order value field based on isDeliveryChargesPaidByOutlet
   */
  onDeliveryChargesPaidByOutletChange() {
    if (this.catalogueForm.get('isDeliveryChargesPaidByOutlet').value) {
      this.showMinOrderValForFreeDeliveryByOutletField = true;
      this.catalogueForm.get('minOrderValForFreeDeliveryByOutlet').enable();
    } else {
      this.showMinOrderValForFreeDeliveryByOutletField = false;
      this.catalogueForm.get('minOrderValForFreeDeliveryByOutlet').disable();
    }
  }
}
