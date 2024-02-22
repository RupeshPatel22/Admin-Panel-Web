import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Merchant } from '../model/pnd-merchant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';

@Component({
  selector: 'app-pnd-merchant-details',
  templateUrl: './pnd-merchant-details.component.html',
  styleUrls: ['./pnd-merchant-details.component.scss']
})
export class PndMerchantDetailsComponent implements OnInit {

  @Input() merchantDetails: Merchant;
  @Output() takeAction: EventEmitter<any> = new EventEmitter();
  categoryList: [] = [];

  merchantDetailsForm = new FormGroup({
    businessName: new FormControl('',[Validators.required]),
    phone: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    expectedDeliveryInDay: new FormControl('',[Validators.required]),
    categoryIds: new FormControl(null,[Validators.required]),
    bankName: new FormControl({disabled: true, value: ''},[Validators.required]),
    bankAccountNumber: new FormControl({disabled: true, value: ''},[Validators.required]),
    bankIfsc: new FormControl({disabled: true, value: ''},[Validators.required]),
    upiId: new FormControl({disabled: true, value: ''},[Validators.required]),
    maxOrderDropLocation: new FormControl(null),
    maxOrderPodCollectionAmount: new FormControl(null),
    additionalPerDropCharges: new FormControl(null),
  });

  constructor(private outletsService: OutletsService, private activeRoute: ActivatedRoute, private toastMsgService: ToastService, private dataDumpService: DataDumpService ) { }

  ngOnInit(): void {
    this.merchantDetailsForm.patchValue({...this.merchantDetails});
    if(this.merchantDetails.kycStatus === 'draft'){
      this.merchantDetailsForm.disable();
    }
    this.setCategoriesList();
    // this.merchantDetailsForm.disable();
  }

  /**
 * Method that Handles the action for a given merchant identified by the provided merchantId.
 * Extracts relevant data from the merchantDetailsForm and emits an event with the merchantId and data.
 */
  onAction(merchantId: string, ) {
    const data = {
          business_name: this.merchantDetailsForm.get('businessName').value,
          phone: this.merchantDetailsForm.get('phone').value,
          email: this.merchantDetailsForm.get('email').value,
          expected_deliveries_in_day: this.merchantDetailsForm.get('expectedDeliveryInDay').value,
          category_id: this.merchantDetailsForm.get('categoryIds').value,
          max_order_drop_locations: this.merchantDetailsForm.get('maxOrderDropLocation').value || null,
          max_order_pod_collection_amount: this.merchantDetailsForm.get('maxOrderPodCollectionAmount').value || null,
          additional_per_drop_charges: this.merchantDetailsForm.get('additionalPerDropCharges').value || null,
        }
        this.takeAction.emit({merchantId, data})
  }

   /**
   * Method that cancel updation of Merchant details
   */
  onCancel() {
    this.merchantDetailsForm.patchValue( {...this.merchantDetails} );
    this.merchantDetailsForm.markAsPristine();
  }

   /**
   * Method that sets category list by making api call
   */
   setCategoriesList() {
    this.dataDumpService.getPndCategoriesList().subscribe(res => {
      this.categoryList = res['result'];
    });
  }
}
