import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { dateShortTimeFormat } from 'src/app/shared/models';
import { PlanType } from '../../subscription-plans/model/subscription-plans';
import { ISubscriptionActionData, Subscription, SubscriptionAction, SubscriptionStatus } from '../model/subscriptions';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit {

  @Input() subscriptionDetails: Subscription;
  @Output() takeAction: EventEmitter<ISubscriptionActionData> = new EventEmitter();

  currentDate = new Date();
  readonly planType = PlanType;
  readonly subscriptionStatus = SubscriptionStatus;
  readonly subscriptionAction = SubscriptionAction;
  readonly dateShortTimeFormat = dateShortTimeFormat;
  actionsToShowInDropdown = {};
  subsAction: SubscriptionAction;
  showSubscriptionActionFields: boolean;

  cancellationReason = new FormControl('', [Validators.required]);
  nextPaymentDate = new FormControl();
  nextPaymentTime = new FormControl();

  constructor() { }

  ngOnInit(): void {
    this.identifyActionToShowInDropdown();
  }

  /**
   * Method that emits data based on action
   * @param action 
   * @returns 
   */
  onConfirm() {
    if (this.subsAction === SubscriptionAction.Cancel) {
      if (this.cancellationReason.status === 'INVALID') return this.cancellationReason.markAsTouched();
      this.takeAction.emit({ action: this.subsAction, sendData: this.cancellationReason.value })
    }
    else {
      const date = moment(this.nextPaymentDate.value).format('YYYY-MM-DD');
      const time = moment(this.nextPaymentTime.value, 'h:mm A').format('HH:mm:ss');
      const sendData = moment(new Date(`${date} ${time}`)).unix();
      this.takeAction.emit({ action: this.subsAction, sendData });
    }
  }

  /**
   * Method that clears the formControl based on action
   * @param action 
   */
  onClear() {
    if (this.subsAction === SubscriptionAction.Cancel) {
      this.cancellationReason.reset();
    }
    else {
      this.nextPaymentDate.reset();
      this.nextPaymentTime.reset();
    }
  }

  /**
   * Method that identifies which action to show in dropdown based on subscription status
   */
  identifyActionToShowInDropdown() {
    if(![SubscriptionStatus.cancelled, SubscriptionStatus.completed].includes(this.subscriptionDetails.status)) {
      this.actionsToShowInDropdown[SubscriptionAction.Cancel] = !this.actionsToShowInDropdown[SubscriptionAction.Cancel];
    };
    if (this.subscriptionDetails.status === SubscriptionStatus.on_hold) {
      this.actionsToShowInDropdown[SubscriptionAction.RetryPayment] = !this.actionsToShowInDropdown[SubscriptionAction.RetryPayment];
      this.actionsToShowInDropdown[SubscriptionAction.Activate] = !this.actionsToShowInDropdown[SubscriptionAction.Activate];
    }
  }

}
