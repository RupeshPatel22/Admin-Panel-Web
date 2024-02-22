import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { emailValidator } from 'src/app/shared/functions/common-validation.functions';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FilterSubscriptionPlan, PlanAction, PlanCategory, PlanIntervalType, PlanType, SubscriptionPlan } from './model/subscription-plans';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {

  subscriptionPlansList: MatTableDataSource<SubscriptionPlan> = new MatTableDataSource();
  displayedColumns: string[] = ['sr no', 'name', 'type', 'category', 'intervalType', 'ordersCount', 'gracePeriodOrdersCount', 'amount', 'status', 'action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalSubscriptionPlans: number;
  showFilterFields: boolean;
  showFormFields: boolean = true;
  filterSubscriptionPlanFields: FilterSubscriptionPlan = new FilterSubscriptionPlan();
  showPlanModal: boolean;
  showSubscriptionModal: boolean;
  action: PlanAction;
  subscriptionAuthorizationLink: string;

  readonly planType = PlanType;
  readonly planCategory = PlanCategory;
  readonly planIntervalType = PlanIntervalType;

  readonly originalOrder = originalOrder;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  planForm = new FormGroup({
    id: new FormControl({ disabled: true, value: '' }, []),
    name: new FormControl('', [Validators.required]),
    type: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    maxCycles: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    intervalType: new FormControl(null, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    ordersCount: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    gracePeriodOrdersCount: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    tnc: new FormControl('', [Validators.required]),
  });

  subscriptionForm = new FormGroup({
    planId: new FormControl('', [Validators.required]),
    outletId: new FormControl('', [Validators.required]),
    customerName: new FormControl('', [Validators.required, Validators.pattern("[A-Za-z ]*")]),
    customerEmail: new FormControl('', [Validators.required, emailValidator()]),
    customerPhone: new FormControl('', [Validators.required, Validators.pattern("[6-9][0-9]{9}")]),
  })

  constructor(private subscriptionsService: SubscriptionsService, private toastMsgService: ToastService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSubscriptionPlans();
  }

  /**
   * Method that gets all subscription plans details
   * @param filterFlag 
   */
  getSubscriptionPlans(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterSubscriptionPlanFields.pageIndex = this.pageIndex;
    this.filterSubscriptionPlanFields.pageSize = this.pageSize;
    const data = this.filterSubscriptionPlanFields.toJson();
    this.subscriptionsService.filterSubscriptionPlans(data).subscribe(res => {
      this.subscriptionPlansList.data = [];
      this.totalSubscriptionPlans = res['result']['total_records'];
      for (const i of res['result']['records']) {
        this.subscriptionPlansList.data.push(SubscriptionPlan.fromJson(i));
      }
      this.subscriptionPlansList.sort = this.sort;

    })
  }

  /**
   * Method that adds or edits plan
   * @returns 
   */
  submitPlan() {
    if (this.planForm.status === 'INVALID') return this.planForm.markAllAsTouched();
    const formValues = this.planForm.getRawValue();
    const data: SubscriptionPlan = new SubscriptionPlan();
    Object.assign(data, formValues);

    if (this.action === 'Add') {
      this.subscriptionsService.createSubscriptionPlan(data.toJson(this.action)).subscribe(res => {
        this.getSubscriptionPlans();
        this.toastMsgService.showSuccess('New Plan is created successfully');
        this.closePlanModal();
      })
    }
    if (this.action === 'Edit') {
      this.subscriptionsService.updateSubscriptionPlan(data.id, data.toJson(this.action)).subscribe(res => {
        this.getSubscriptionPlans();
        this.toastMsgService.showSuccess(`Plan ID: ${data.id} is updated successfully`);
        this.closePlanModal();
      })
    }
  }

  /**
   * Method that active/disable the plan
   */
  changePlanStatus(plan: SubscriptionPlan) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to change the status of the ${plan.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const data = {
          active: !plan.isActive
        }
        this.subscriptionsService.updateSubscriptionPlan(plan.id, data).subscribe(res => {
          plan.isActive = !plan.isActive;
          this.toastMsgService.showSuccess('Status is updated successfully');
        })
      }
    })
  }

  /**
   * Method that creates new subscription on plan
   * @returns 
   */
  submitSubscription() {
    if (this.subscriptionForm.status === 'INVALID') return this.subscriptionForm.markAllAsTouched();
    const formValues = this.subscriptionForm.getRawValue();
    const data = {
      plan_id: formValues.planId,
      restaurant_id: formValues.outletId,
      customer_name: formValues.customerName,
      customer_email: formValues.customerEmail,
      customer_phone: `+91${formValues.customerPhone}`,
    }
    this.subscriptionsService.createSubscription(data).subscribe(res => {
      if (res['result']['subscription']['authorization_details']) {
        this.subscriptionAuthorizationLink = res['result']['subscription']['authorization_details']['authorization_link'];
      } else {
        this.closeSubscriptionModal();
      }
      this.toastMsgService.showSuccess('subscription is created successfully');
    })
  }

  /**
     * Method that invokes on page change
     * @param event 
     */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getSubscriptionPlans();
  }

  /**
 * Method that reset filter params
 * @param fieldName 
 */
  clearFilter(fieldName: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterSubscriptionPlanFields = new FilterSubscriptionPlan();
    }
    this.getSubscriptionPlans();
  }

  /**
   * Method that opens plan modal after performing action based on actionType
   * @param actionType 
   * @param plan 
   */
  openPlanModal(actionType: PlanAction, plan?: SubscriptionPlan) {
    if (actionType === 'Edit') {
      this.planForm.patchValue({ ...plan });
      this.onPlanTypeChange();
      this.planForm['controls']['amount'].disable();
      this.planForm['controls']['type'].disable();
      this.planForm['controls']['maxCycles'].disable();
      this.planForm['controls']['intervalType'].disable();
    }
    else if (actionType === 'View') {
      this.planForm.patchValue({ ...plan });
      this.planForm.disable();
    }
    this.action = actionType;
    this.showPlanModal = true;
  }

  /**
   * Method that closes the plan modal
   */
  closePlanModal() {
    this.planForm.reset();
    this.planForm.enable();
    this.showPlanModal = false;
  }

  /**
   * Method that opens subscription modal
   * @param planId 
   */
  openSubscriptionModal(planId: string) {
    this.subscriptionForm.patchValue({ planId });
    this.subscriptionForm['controls']['planId'].disable();
    this.showSubscriptionModal = true;
  }

  /**
   * Method that closes subscription modal
   */
  closeSubscriptionModal() {
    this.subscriptionForm.reset();
    this.showSubscriptionModal = false;
    this.subscriptionAuthorizationLink = null;
  }

  /**
   * Method that invokes on change in plan type and
   * enable/disable some formControls based on its value
   * @returns 
   */
  onPlanTypeChange() {
    if (this.planForm['controls']['type']['value'] === 'free') {
      this.planForm['controls']['amount'].disable();
      this.planForm['controls']['maxCycles'].disable();
      this.showFormFields = false;
      return;
    }
    this.planForm['controls']['amount'].enable();
    this.planForm['controls']['maxCycles'].enable();
    this.showFormFields = true;
  }
}
