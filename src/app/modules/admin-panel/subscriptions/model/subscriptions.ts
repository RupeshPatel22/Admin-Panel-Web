import * as moment from "moment";
import { PlanType } from "../../subscription-plans/model/subscription-plans";

export class Subscription {
    id: string;
    externalSubscriptionId: string;
    authAmount: number;
    authLink: string;
    authFailureReason: string;
    authDate: string;
    authStatus: SubscriptionAuthStatus;
    cancellationReason: string;
    cancellationUserId: string;
    cancelledBy: SubscriptionCancelledBy;
    currentCycle: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    startDate: string;
    endDate: string;
    nextPaymentDate: string;
    planId: string;
    planName: string;
    outletId: string;
    outletName: string;
    planType: PlanType;
    status: SubscriptionStatus;
    remainingOrders: number;
    remainingGracePeriodOrders: number;
    ordersBought: number;
    allottedGracePeriodOrders: number;
    ordersConsumed: number;
    onGracePeriod: boolean;


    static fromJson(data: any): Subscription {
        const s: Subscription = new Subscription();

        s['id'] = data['id'];
        s['externalSubscriptionId'] = data['external_subscription_id'];
        s['authAmount'] = data['authorization_amount'];
        s['authLink'] = data['authorization_details']?.['authorization_link'];
        s['authFailureReason'] = data['authorization_details']?.['authorization_failure_reason'];
        s['authDate'] = data['authorization_details']?.['checkout_initiated_time'];
        s['authStatus'] = SubscriptionAuthStatus[data['authorization_status']] || 'N/A';
        s['cancellationReason'] = data['cancellation_details']?.['cancellation_reason'];
        s['cancellationUserId'] = data['cancellation_user_id'];
        s['cancelledBy'] = SubscriptionCancelledBy[data['cancelled_by']];
        s['currentCycle'] = data['current_cycle'];
        s['customerName'] = data['customer_name'];
        s['customerPhone'] = data['customer_phone'];
        s['customerEmail'] = data['customer_email'];
        s['startDate'] = data['start_time'];
        s['endDate'] = data['end_time'];
        s['nextPaymentDate'] = data['next_payment_on'];
        s['planId'] = data['plan_id'];
        s['planName'] = data['plan_name'];
        s['outletId'] = data['restaurant_id'] || data['store_id'] || data['outlet_id'];
        s['outletName'] = data['restaurant_name'] || data['store_name'] || data['outlet_name'];
        s['planType'] = PlanType[data['plan_type']];
        s['status'] = SubscriptionStatus[data['status']];
        s['remainingOrders'] = data['subscription_remaining_orders'];
        s['remainingGracePeriodOrders'] = data['subscription_grace_period_remaining_orders'];
        s['ordersBought'] = data['no_of_orders_bought'];
        s['allottedGracePeriodOrders'] = data['no_of_grace_period_orders_allotted'];
        s['ordersConsumed'] = data['no_of_orders_consumed'];
        s['onGracePeriod'] = data['grace_period'];
        return s;
    }
}

export class FilterSubscription {
    planOrOutletName: string;
    subscriptionId: string;
    planId: string;
    outletId: string;
    status: SubscriptionStatus[] = [];
    authStatus: SubscriptionAuthStatus[] = [];
    cancelledBy: SubscriptionCancelledBy[] = [];
    startDate: Date;
    endDate: Date;
    nextPaymentDate: Date;
    pageIndex: number;
    pageSize: number;
    startTime: string;
    endTime: string;

    toJson() {
        const data = {};

        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        if (this.planOrOutletName) data['search_text'] = this.planOrOutletName;
        data['filter'] = {};
        if (this.subscriptionId) data['filter']['subscription_id'] = this.subscriptionId;
        if (this.planId) data['filter']['plan_id'] = this.planId;
        if (this.outletId) data['filter']['restaurant_id'] = this.outletId;
        if (this.status.length) data['filter']['status'] = this.status;
        if (this.authStatus.length) data['filter']['authorization_status'] = this.authStatus;
        if (this.cancelledBy.length) data['filter']['cancelled_by'] = this.cancelledBy;
        if (this.startDate && this.endDate) {
            data['filter']['duration'] = {
              start_date: this.startTime? moment(new Date(moment(this.startDate).format('YYYY-MM-DD') + ' ' +  moment(this.startTime,'h:mm A').format('HH:mm:ss'))).unix() : moment(this.startDate).unix(),
              end_date: this.endTime? moment(new Date(moment(this.endDate).format('YYYY-MM-DD') + ' ' + moment(this.endTime,'h:mm A').format('HH:mm:ss'))).unix(): moment(this.endDate.setHours(23, 59, 59)).unix(),
            };
          }
        if (this.nextPaymentDate) data['filter']['next_payment_on'] = moment(this.nextPaymentDate).unix();
        return data;
    }
}

export enum SubscriptionAuthStatus {
    authorized = 'Authorized',
    pending = 'Pending',
    failed = 'Failed',
}

export enum SubscriptionStatus {
    pending = 'Pending',
    initialized = 'Initialized',
    bank_approval_pending = 'Bank Approval Pending',
    active = 'Active',
    on_hold = 'On Hold',
    cancelled = 'Cancelled',
    failed_to_cancel = 'Failed To Cancel',
    completed = 'Completed',
}

export enum SubscriptionCancelledBy {
    admin = 'Admin',
    vendor = 'Vendor',
    partner = 'Partner',
    system = 'System',
}

export enum SubscriptionAction {
    Cancel = 'Cancel Subscription',
    RetryPayment = 'Retry Payment',
    Activate = 'Activate Subscription'
}

export interface ISubscriptionActionData {
    action: SubscriptionAction,
    sendData: string | number,
}