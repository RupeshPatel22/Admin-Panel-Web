import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Addon, AddonGroup, foodTypeList } from '../model/menu';

@Component({
  selector: 'app-add-new-add-on',
  templateUrl: './add-new-add-on.component.html',
  styleUrls: ['./add-new-add-on.component.scss']
})
export class AddNewAddOnComponent implements OnInit {

  isAddAddon: boolean;
  addonGroupList: AddonGroup[] = [];
  addonActionForm = new FormGroup({
    addonGroupId: new FormControl('', [Validators.required]),
    addonId: new FormControl({ disabled: true, value: '' }),
    addonName: new FormControl('', [Validators.required]),
    foodType: new FormControl(null, [Validators.required]),
    addonPrice: new FormControl('', [Validators.required]),
    isGstInclusive: new FormControl(null, [Validators.required]),
    gst: new FormControl('', [Validators.required]),
  });

  foodTypeList = foodTypeList;
  flags = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' },
  ];

  subscriptions: Subscription[] = [];
  @Input() modalData: any;
  @Output() closeModal = new EventEmitter<any>();

  constructor(private dialog: MatDialog, private outletsService: OutletsService, private renderer: Renderer2, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.outletsService.addonGroupList$.subscribe(data => this.addonGroupList = data));
    if (this.modalData.actionType === 'ADD') {
      this.isAddAddon = true;
      this.addonActionForm.patchValue({
        addonGroupId: this.modalData.addonGroupId,
      });
    } else if (this.modalData.actionType === 'EDIT' || this.modalData.actionType === 'VIEW') {
      this.isAddAddon = false;
      this.addonActionForm.patchValue({
        addonGroupId: this.modalData.addonGroupId,
        addonId: this.modalData.addon.addonId,
        addonName: this.modalData.addon.addonName,
        foodType: this.modalData.addon.foodType,
        addonPrice: this.modalData.addon.addonPrice,
        isGstInclusive: this.modalData.addon.isGstInclusive,
        gst: this.modalData.addon.gst,
      })
      if (this.modalData.disableAll) {
        this.addonActionForm.disable();
      }
      if (this.outletsService.service === 'food') {
        this.addonActionForm['controls']['isGstInclusive'].disable();
      this.addonActionForm['controls']['gst'].disable();
      if ( this.outletsService.outletDetails.gstCategory === 'hybrid') {
        this.addonActionForm['controls']['gst'].enable();
      } 
      }

    }
    this.renderer.addClass(document.body, 'overlay-enabled');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'overlay-enabled');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Method that warns user in case of unsaved data and then emits event to toggle modal
   * @returns 
   */
  close() {
    if (this.addonActionForm.dirty) {
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
   * Method that submits addon
   * @returns 
   */
  submitAddon() {
    if (this.addonActionForm.status === 'INVALID') {
      this.addonActionForm.markAllAsTouched();
      return;
    }
    const data: Addon = new Addon();
    const formValues = this.addonActionForm.getRawValue();
    Object.assign(data, formValues);

    if (this.isAddAddon) {
      this.subscriptions.push(this.outletsService.addAddon(data.toJson()).subscribe(res => {
        this.closeModal.emit('close');
        this.toastMsgService.showSuccess(`Addon: ${res['result']['name']} added successfully`);
      }));
    } else {
      this.subscriptions.push(this.outletsService.editAddon(data['addonId'], data.toJson()).subscribe(res => {
        this.closeModal.emit('close');
        this.toastMsgService.showSuccess(`Addon: ${res['result']['name']} updated successfully`);
      }));
    }
  }

  /**
   * Method that shows confirmation dialog on refresh page or on closing of tab 
   * @param event 
   */
  @HostListener("window:beforeunload")
  reloadHandler(event: Event) {
    if (this.addonActionForm.dirty)
      event.stopPropagation();
  }

  getSelectionChange(){
    if(this.addonActionForm.get('isGstInclusive').value){
      this.addonActionForm.get('gst').setValue(0);
      this.addonActionForm.get('gst').disable();
    } else {
      this.addonActionForm.get('gst').setValue('');
      this.addonActionForm.get('gst').enable();
    }
  }
}
