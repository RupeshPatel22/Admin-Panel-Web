import * as moment from "moment";
import { formatNum } from "src/app/shared/functions/modular.functions";
export class SubscriptionPayment {
    id: number;
    subscriptionId: string;
    externalPaymentId: string;
    amount: string;
    currentCycle: number;
    failureReason: string;
    outletId: string;
    outletName: string;
    status: SubscriptionPaymentStatus;
    scheduledDate: string;
    txnDate: string;
    updatedAt: string;
    noOfGracePeriodOrdersAlloted: string;
    noOfOrdersBought: string;
    retryAttempts: string;
    scheduledOn: string;
    planName: string;
    static fromJson(data: any): SubscriptionPayment {
        const s: SubscriptionPayment = new SubscriptionPayment();
        s['id'] = data['id'];
        s['subscriptionId'] = data['subscription_id'];
        s['externalPaymentId'] = data['external_payment_id'];
        s['amount'] = formatNum(data['amount']);
        s['currentCycle'] = data['cycle'];
        s['failureReason'] = data['failure_reason'];
        s['outletId'] = data['restaurant_id'];
        s['outletName'] = data['restaurant_name'];
        s['status'] = SubscriptionPaymentStatus[data['status']];
        s['scheduledDate'] = data['scheduled_on'];
        s['txnDate'] = data['transaction_time'];
        s['updatedAt'] = data['updated_at'];
        s['noOfGracePeriodOrdersAlloted'] = data['no_of_grace_period_orders_allotted'];
        s['noOfOrdersBought'] = data['no_of_orders_bought'];
        s['noOfOrdersConsumed'] = data['no_of_orders_consumed'];
        s['retryAttempts'] = data['retry_attempts'];
        s['scheduledOn'] = data['scheduled_on']
        s['planName'] = data['plan_name'];
        return s;
    }
}

export class FilterSubscriptionPayment {
    planOrOutletName: string;
    paymentId: string;
    outletId: string;
    subscriptionId: string;
    status: SubscriptionPaymentStatus[] = [];
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        if (this.planOrOutletName) data['search_text'] = this.planOrOutletName;
        data['filter'] = {};
        if (this.paymentId) data['filter']['subscription_payment_id'] = this.paymentId;
        if (this.outletId) data['filter']['restaurant_id'] = this.outletId;
        if (this.subscriptionId) data['filter']['subscription_id'] = this.subscriptionId;
        if (this.status.length) data['filter']['status'] = this.status;
        return data;
    }
}
export enum SubscriptionPaymentStatus {
    success = 'Success',
    pending = 'Pending',
    failed = 'Failed',
}