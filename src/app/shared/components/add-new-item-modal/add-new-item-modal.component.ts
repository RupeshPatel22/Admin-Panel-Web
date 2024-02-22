import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Addon, AddonGroup, Category, foodTypeList, IPackagingChargesSlab, MenuItem, SubCategory, Variant }
 from 'src/app/modules/admin-panel/outlet-details/menu/model/menu';
import { Services } from '../../models/constants/constant.type';
import { OutletsService } from '../../services/outlets.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { sequence } from '@angular/animations';
import { every } from 'rxjs/operators';
import { Outlet } from 'src/app/modules/admin-panel/outlets/model/outlet';


@Component({
  selector: 'app-add-new-item-modal',
  templateUrl: './add-new-item-modal.component.html',
  styleUrls: ['./add-new-item-modal.component.scss']
})
export class AddNewItemModalComponent implements OnInit, OnDestroy {

  isAddItem: boolean;
  categoryList: Category[] = [];
  subCategoryList: SubCategory[] = [];
  addonGroupList: AddonGroup[] = [];
  addonList: Addon[] = [];
  selectedAddonGroups = [];
  itemImageUrl: any;

  itemActionForm = new FormGroup({
    outletId: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    subCategoryId: new FormControl('', [Validators.required]),
    itemId: new FormControl({ disabled: true, value: '' }, [Validators.required]),
    itemName: new FormControl('', [Validators.required]),
    foodType: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    itemPrice: new FormControl('', [Validators.required]),
    packagingCharges: new FormControl('', [Validators.required]),
    // serviceCharges: new FormControl('', [Validators.required]),
    servesHowMany: new FormControl('', [Validators.required]),
    allowLongDistance: new FormControl(null, [Validators.required]),
    isSpicy: new FormControl(null, [Validators.required]),
    isGstInclusive: new FormControl(null, [Validators.required]),
    itemImage: new FormControl(''),
    addVariantsChoice: new FormControl(null, [Validators.required]),
    variantGroupRow: this.formBuilder.array([]),
    addAddOnsChoice: new FormControl(null, [Validators.required]),
    addOnRow: this.formBuilder.array([]),
    gst: new FormControl('', [Validators.required]),
    weightGrams: new FormControl('',[Validators.required]),
    ageRestricted: new FormControl('', Validators.required),
    // discountRate: new FormControl(''),
  });

  foodTypeList = foodTypeList;
  flags = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' }
  ];

  subscriptions: Subscription[] = [];
  readonly Services = Services;
  service: string;
  packagingChargesSlabs: IPackagingChargesSlab[];
  isVariantGroupSequenceModalVisible: boolean;
  isVariantSequenceModalVisible: boolean;
  itemDetails: MenuItem;
  variantGroupId: number;
  variantList: Variant[];

  @Input() modalData: any;
  @Output() closeModal = new EventEmitter<any>();
  outletDetails: Outlet;
  showPackagingCharges: boolean;

  constructor(private router: Router, private dialog: MatDialog, private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private outletsService: OutletsService, private renderer: Renderer2, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.outletsService.categoryList$.subscribe(data => this.categoryList = data))
    this.subscriptions.push(this.outletsService.addonGroupList$.subscribe(data => this.addonGroupList = data));
    this.service = this.outletsService.service;
    this.outletDetails = this.outletsService.outletDetails;
    this.setSubCategories(this.modalData.categoryId);
    if (this.outletDetails.packagingChargesType === 'item') {
      this.getPackagingChargesSlab();
    }

    if (this.modalData.actionType === 'ADD') {
      this.isAddItem = true;
      this.itemActionForm.patchValue({
        outletId: this.modalData.outletId,
        categoryId: this.modalData.categoryId,
        subCategoryId: this.modalData.subCategoryId,
      });
      if (this.outletDetails.packagingChargesType !== 'item') {
        this.itemActionForm.get('packagingCharges').setValue(0); //setting packing charges = 0 for packagingChargesType = 'order'/'none'
      }
      if ( this.service === 'food') {
        // this.itemActionForm['controls']['isGstInclusive'].disable();
        // this.itemActionForm['controls']['gst'].disable();
        if (this.outletDetails.gstCategory === 'hybrid') {
          this.itemActionForm['controls']['gst'].enable();
        }
      }
    }

    else if (this.modalData.actionType === 'EDIT' || this.modalData.actionType === 'VIEW') {
      this.isAddItem = false;
      this.subscriptions.push(this.outletsService.getItem(this.modalData.itemId).subscribe(res => {
        const itemDetails = MenuItem.fromJson(res['result']);
        this.itemActionForm.patchValue({
          outletId: this.modalData.outletId,
          categoryId: this.modalData.categoryId,
          subCategoryId: this.modalData.subCategoryId,
          itemId: itemDetails['itemId'],
          itemName: itemDetails['itemName'],
          description: itemDetails['description'],
          itemPrice: itemDetails['displayPrice'] ? itemDetails['displayPrice'] : itemDetails['itemPrice'],
          foodType: itemDetails['foodType'],
          packagingCharges: itemDetails['packagingCharges'],
          // serviceCharges: itemDetails['serviceCharges'],
          servesHowMany: itemDetails['servesHowMany'],
          allowLongDistance: itemDetails['allowLongDistance'],
          isSpicy: itemDetails['isSpicy'],
          isGstInclusive: itemDetails['isGstInclusive'],
          gst: itemDetails['gst'],
          itemImage: itemDetails['itemImage'],
          // discountRate: itemDetails['discountRate'],
          addVariantsChoice: itemDetails['variantGroupRow'].length > 0 ? true : false,
          addAddOnsChoice: itemDetails['addOnRow'].length > 0 ? true : false,
          weightGrams: itemDetails['weightGrams'],
          ageRestricted: itemDetails['ageRestricted'],
        });
        if (this.itemActionForm.get('isGstInclusive').value) {
          this.itemActionForm.get('gst').disable();
        }
        for (const i in itemDetails['variantGroupRow']) {
          this.addVariantGroup();
          this.itemActionForm['controls']['variantGroupRow']['controls'][i]['controls']['variantGroupName']
            .setValue(itemDetails['variantGroupRow'][i]['variantGroupName']);
            this.itemActionForm['controls']['variantGroupRow']['controls'][i]['controls']['variantGroupId']
            .setValue(itemDetails['variantGroupRow'][i]['variantGroupId']);

          const arr = this.itemActionForm['controls']['variantGroupRow']['controls'][i]['controls']['variantRow'] as FormArray;
          arr.clear();
          for (const j in itemDetails['variantGroupRow'][i]['variantRow']) {
            arr.push(this.initVariantRows());
            arr['controls'][j].patchValue({
              variantId: itemDetails["variantGroupRow"][i]["variantRow"][j]['variantId'],
              variantName: itemDetails['variantGroupRow'][i]['variantRow'][j]['variantName'],
              variantType: itemDetails['variantGroupRow'][i]['variantRow'][j]['variantType'],
              additionalPrice: itemDetails['variantGroupRow'][i]['variantRow'][j]['additionalPrice'],
              isDefault: itemDetails['variantGroupRow'][i]['variantRow'][j]['isDefault'],
              inStock: itemDetails['variantGroupRow'][i]['variantRow'][j]['inStock'],
              servesHowMany: itemDetails['variantGroupRow'][i]['variantRow'][j]['servesHowMany'],
              weightGrams: itemDetails['variantGroupRow'][i]['variantRow'][j]['weightGrams'],

            })
          }
        }
        for (const i in itemDetails['addOnRow']) {
          this.addAddOns();
          this.setAddons(itemDetails['addOnRow'][i]['addonGroupId'], i);
          this.itemActionForm['controls']['addOnRow']['controls'][i].patchValue({
            addonGroupId: itemDetails['addOnRow'][i]['addonGroupId'],
            addonIds: itemDetails['addOnRow'][i]['addonIds'],
            minLimit: itemDetails['addOnRow'][i]['minLimit'],
            maxLimit: itemDetails['addOnRow'][i]['maxLimit']
          })
        }

        this.itemImageUrl = itemDetails['itemImageUrl'];
        this.itemDetails = itemDetails;
        if (this.modalData.disableAll || this.outletDetails.posId) {
          this.itemActionForm.disable();
        }
        if(this.outletDetails.posId) {
          this.itemActionForm.get('itemImage').enable();
        }
      }))
    }

    this.renderer.addClass(document.body, 'overlay-enabled');
    if(this.service !== Services.Grocery) {
      this.itemActionForm.get('weightGrams').disable();
    }
    if(this.service !== Services.Paan) {
      this.itemActionForm.get('ageRestricted').disable();
    }
    if ( this.service === 'food') {
      // this.itemActionForm['controls']['isGstInclusive'].disable();
      // this.itemActionForm['controls']['gst'].disable();
      if (this.outletDetails.gstCategory === 'hybrid') {
        this.itemActionForm['controls']['gst'].enable();
      }
    }

    if (this.outletDetails.packagingChargesType === 'item' && (this.service !== Services.Food || this.service === Services.Food && !this.outletDetails.packgingChargeSlabApplied)) {
      this.showPackagingCharges = false;
    }
    else{
      this.showPackagingCharges = true;
      this.itemActionForm.setValidators(this.customItemPackagingChargesValidator());
    }
}

  /**
   * Method that sets sub-categories based on categoryId
   * @param categoryId 
   */
  setSubCategories(categoryId: number) {
    this.itemActionForm['controls']['subCategoryId'].setValue(null);
    this.subscriptions.push(this.outletsService.getSubCategories(categoryId).subscribe((res) => {
      this.subCategoryList = [];
      for (const i of res['result']) {
        this.subCategoryList.push(SubCategory.fromJson(i));
      }
    }));
  }

  /**
   * Method that sets all addons based on addonGroupID
   * @param addonGroupId 
   * @param index 
   */
  setAddons(addonGroupId: number, index: number | string) {
    this.addOnArr['controls'][index]['controls']['addonIds'].setValue('');
    this.subscriptions.push(this.outletsService.getAddonByAddonGroupId(addonGroupId).subscribe((res) => {
      const addons = [];
      for (const i of res['result']) {
        addons.push(Addon.fromJson(i));
      }
      this.addonList[index] = addons;
      this.selectedAddonGroups = []
      for (const i in this.addOnArr['controls']) {
        this.selectedAddonGroups.push(this.addOnArr['controls'][i]['controls']['addonGroupId']['value'])
      }
    }))
  }

  /**
   * Method that gets packing charge slabs data from global Var
   */
  getPackagingChargesSlab() {
    this.outletsService.getGlobalVarByKey('ITEM_PACKAGING_CHARGES_SLAB').subscribe(res => {
      this.packagingChargesSlabs = res['result']['value'];
    })
  }

  /**
   * Method that enable/disable and set value of gst field
   * based on selection
   */
  gstSelectionChange() {
    if (this.itemActionForm.get('isGstInclusive').value) {
      this.itemActionForm.get('gst').setValue(0);
      this.itemActionForm.get('gst').disable();
    } else {
      this.itemActionForm.get('gst').setValue('');
      this.itemActionForm.get('gst').enable();
    }
  }

  get variantGroupArr() {
    return this.itemActionForm.get('variantGroupRow') as FormArray;
  }
  get variantArr() {
    return this.itemActionForm['controls']['variantGroupRow']['controls']['variantRow'] as FormArray;
  }
  get addOnArr() {
    return this.itemActionForm.get('addOnRow') as FormArray;
  }
  /**
   * Method that creates new formGroup for item array
   * @returns formGroup
   */
  initVariantGroupRows() {
    return this.formBuilder.group({
      variantGroupName: new FormControl('', [Validators.required]),
      variantGroupId: new FormControl(''),
      variantRow: this.formBuilder.array([this.initVariantRows()])
    }, { validators: [this.customVariantIsDefaultValidator()] });
  }

  initVariantRows() {
    return this.formBuilder.group({
      variantId: new FormControl(""),
      variantName: new FormControl('', [Validators.required]),
      variantType: new FormControl(null, [Validators.required]),
      additionalPrice: new FormControl('', [Validators.required]),
      isDefault: new FormControl(null, [Validators.required]),
      inStock: new FormControl(null, [Validators.required]),
      servesHowMany: new FormControl('', [Validators.required]),
      weightGrams: this.service === Services.Grocery ? new FormControl('', [Validators.required,]) : undefined
    });
  }

  initAddOnRows() {
    return this.formBuilder.group({
      addonGroupId: new FormControl(null, [Validators.required]),
      addonIds: new FormControl(null, [Validators.required]),
      minLimit: new FormControl(null, [Validators.required]),
      maxLimit: new FormControl(null, [Validators.required]),
    }, { validators: [this.customAddonSelectionValidator()] });
  }
  /**
   * Method that adds newly created formGroup to the formArray 
   */
  addVariantGroup() {
    this.variantGroupArr.push(this.initVariantGroupRows());
  }

  addVariant(index) {
    const arr = this.itemActionForm['controls']['variantGroupRow']['controls'][index]['controls']['variantRow'] as FormArray;
    arr.push(this.initVariantRows());
  }

  addAddOns() {
    this.addOnArr.push(this.initAddOnRows());
  }
  /**
    * Method that deletes control from item array
    * @param index 
    */
  deleteVariantGroup(index: number) {
    if (this.variantGroupArr.controls.length > 1) {
      this.variantGroupArr.removeAt(index);
    }
  }

  deleteVariant(i: number, j: number) {
    const arr = this.itemActionForm['controls']['variantGroupRow']['controls'][i]['controls']['variantRow'] as FormArray;
    if (arr.controls.length > 1) {
      arr.removeAt(j);
    }
  }

  deleteAddOn(index: number) {
    if (this.addOnArr.controls.length > 1) {
      this.addOnArr.removeAt(index);
    }
  }
  /**
    * Method that adds variant fields to the item form
    */
  onAddVariantsSelection() {
    this.itemActionForm.get('addVariantsChoice').value ? this.addVariantGroup() : this.variantGroupArr.clear();
  }

  /**
 * Method that adds add-on fields to the form
 */
  onAddOnsSelection() {
    this.itemActionForm.get('addAddOnsChoice').value ? this.addAddOns() : this.addOnArr.clear();
  }

  /**
* Method that checks length of 'variantGroupArr'
* @returns boolean
*/
  checkVariantGroupArrLength() {
    return this.variantGroupArr.length > 0;
  }

  /**
   * Method that checks length of 'addOnArr'
   * @returns boolean
   */
  checkaddOnArrLength() {
    return this.addOnArr.length > 0;
  }

  /**
   * Method that validates only 1 vairant in each variant group should be default
   * @returns 
   */
  customVariantIsDefaultValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      let count = 0;
      const variantRow = group['controls']['variantRow']['controls']
      variantRow.forEach(obj => {
        if (obj['controls']['isDefault']['value']) {
          count++;
        }
      })
      variantRow.forEach(obj => {
        if (count !== 1) {

          obj['controls']['isDefault'].setErrors({ defaultVariant: true });
        }
        else {
          obj['controls']['isDefault'].setErrors(null);
        }
      })
      return
    };
  }

  /**
   * Method that validates min & max limit of each addonRow
   */
  customAddonSelectionValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const addonIds = group['controls']['addonIds']['value'];
      const minLimit = group['controls']['minLimit']['value'];
      const maxLimit = group['controls']['maxLimit']['value'];
      if (addonIds && minLimit && maxLimit) {
        if (minLimit > addonIds.length) {
          group['controls']['minLimit'].setErrors({ ...{ 'minMaxSelection': true } })
        }
        else if (maxLimit > addonIds.length) {
          group['controls']['maxLimit'].setErrors({ ...{ 'minMaxSelection': true } })
        }
        else if (Number(maxLimit) !== -1 && minLimit > maxLimit) {
          group['controls']['minLimit'].setErrors({ ...{ 'minMaxSelection': true } })
        }
        else {
          group['controls']['minLimit'].setErrors(null)
          group['controls']['maxLimit'].setErrors(null)
        }
      }
      return
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
    this.subscriptions.push(this.outletsService.getFileUploadUrl(fileExtn).subscribe(data => {
      const res = data;
      this.itemActionForm['controls']['itemImage'].setValue(res['result']['file_name']);
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
      this.itemImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file.item(0)))  //to show image preview
    }));
  }

  /**
   * Method that warns user in case of unsaved data and then emits event to toggle modal
   * @returns 
   */
  close() {
    if (this.itemActionForm.dirty) {
      this.renderer.removeClass(document.body, 'overlay-enabled');
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Unsaved data will be lost. Do you still want to continue?',
          confirmBtnText: 'OK',
          dismissBtnText: 'Cancel'
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        this.renderer.addClass(document.body, 'overlay-enabled');
        if (res) {
          this.closeModal.emit();
        }
      });
      return;
    }
    this.closeModal.emit();
  }

  /**
   * Method that submit item
   * @returns 
   */
  submitItem() {
    if (this.itemActionForm.status === 'INVALID') {
      this.itemActionForm.markAllAsTouched();
      this.toastMsgService.showWarning('Kindly fill up all the fields')
      return;
    }
    const formValues = this.itemActionForm.getRawValue();
    const data: MenuItem = new MenuItem();
    Object.assign(data, formValues);

    if (this.isAddItem) {
      this.subscriptions.push(this.outletsService.addItem(data.toJson(this.outletsService.service)).subscribe((res) => {
        this.closeModal.emit('close');
        this.toastMsgService.showSuccess(`Item: ${res['result']['menu_item_name']} added successfully`);
      }));
    } else {
      if(this.outletDetails.posId && this.modalData.actionType==='EDIT'){
        const posData ={
          id: data['itemId'],
          restaurant_id: data['outletId'],
          image: {
            name:data['itemImage'],
            url: data['itemImageUrl']
          },
          // sub_category_id: data['subCategoryId']
        };
        this.subscriptions.push(this.outletsService.editItem(data['itemId'], posData).subscribe((res) => {
          this.closeModal.emit('close');
          this.toastMsgService.showSuccess(`Item: ${res['result']['menu_item_name']} updated successfully`);
        }));
      }
      else{
      this.subscriptions.push(this.outletsService.editItem(data['itemId'], data.toJson(this.outletsService.service)).subscribe((res) => {
        this.closeModal.emit('close');
        this.toastMsgService.showSuccess(`Item: ${res['result']['menu_item_name']} updated successfully`);
      }));
    }
  }
  }

  /**
  * Method that validates packing charges lies b/w slab
  * @returns 
  */
  customItemPackagingChargesValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const itemPrice = group['controls']['itemPrice']['value'];
      const itemPackagingCharges = group['controls']['packagingCharges']['value'];

      if (itemPrice && itemPackagingCharges && this.outletDetails.packagingChargesType === 'item') {
        for (const i of this.packagingChargesSlabs) {
          if (itemPrice >= i['minPrice'] && itemPrice <= i['maxPrice']) {
            if (itemPackagingCharges > i['maxCharges']) {
              group['controls']['packagingCharges'].setErrors({ itemPackagingCharges: true })
            }
            else {
              group['controls']['packagingCharges'].setErrors(null)
            }
          }
        }
      }
      return
    }
  }

  /**
   * Method that shows confirmation dialog on refresh page or on closing of tab 
   * @param event 
   */
  @HostListener("window:beforeunload")
  reloadHandler(event: Event) {
    if (this.itemActionForm.dirty)
      event.stopPropagation();
  }

  openVariantGroupSequenceModal(){
    this.isVariantGroupSequenceModalVisible = true;
    this.isVariantSequenceModalVisible = false;
  }

  dropVariantGroupSequence(event: CdkDragDrop<string[]>){
    moveItemInArray(this.itemDetails.variantGroupRow, event.previousIndex, event.currentIndex);
  }

  saveVariantGroupSequence() {
    this.itemDetails.variantGroupRow.forEach((item, i) => {
      item.sequence = i + 1
    });
    const sequenceData = {
      sorted_ids: this.itemDetails.variantGroupRow.map((variantGroup) => (
        variantGroup.variantGroupId
      ))
    };
    this.outletsService.putVariantGroupSequence(this.itemDetails.itemId, sequenceData).subscribe(response => {
      this.toastMsgService.showSuccess('Variant groups sequence updated successfully');
      this.closeSequenceModal();
    })
  }

  openVariantSequenceModal(variantGroupId: number) {
    this.isVariantSequenceModalVisible = true;
    this.isVariantGroupSequenceModalVisible = false;
    this.variantGroupId = variantGroupId;
    this.itemDetails.variantGroupRow.forEach((variantGroup) => {
      if(variantGroup.variantGroupId === variantGroupId) {
        this.variantList = variantGroup.variantRow;
      }
    })
  }

  dropVariantSequence(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.variantList, event.previousIndex, event.currentIndex);
  }

  saveVariantSequence() {
    this.variantList.forEach((item, i) => {
      item.sequence = i + 1
    });
    const sequenceData = {
      sorted_ids: this.variantList.map((variant) => (
        variant.variantId
      ))
    };
    this.outletsService.putVariantSequence(this.variantGroupId, sequenceData).subscribe(resonse => {
      this.toastMsgService.showSuccess('Variants sequence updated successfully');
      this.closeSequenceModal();
    })
  } 

  closeSequenceModal() {
    this.isVariantGroupSequenceModalVisible = false;
    this.isVariantSequenceModalVisible = false;
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'overlay-enabled');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


}
