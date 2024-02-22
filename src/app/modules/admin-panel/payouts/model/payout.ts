import * as moment from "moment";
import { formatNum } from "src/app/shared/functions/modular.functions";
import { Services } from "src/app/shared/models";
import { Order } from "../../orders/model/order";
export class PayoutAccount {
    payoutAccountId: string;
    beneficiaryName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    isIfscVerified: boolean;
    isDeleted: boolean;
    isPrimary: boolean;
    status: string;
    static fromJson(data: any): PayoutAccount {
        const p: PayoutAccount = new PayoutAccount();
        p['payoutAccountId'] = data['id'];
        p['beneficiaryName'] = data['name'];
        p['accountNumber'] = data['bank_account_number'];
        p['ifscCode'] = data['ifsc_code'];
        p['bankName'] = data['bank_name'];
        p['isIfscVerified'] = data['ifsc_verified'];
        p['isDeleted'] = data['is_deleted'];
        p['isPrimary'] = data['is_primary'];
        p['status'] = data['status'];
        return p;
    }
}
export class Payout {
    payoutId: string;
    startDate: string;
    endDate: string;
    totalOrderAmount: string;
    txnCharges: string;
    amountPaidToVendor: string;
    txnId: string;
    payoutCompletedTime: string;
    payoutStatus: PayoutStatusList;
    canRetry: boolean;
    markedCompletedByAdminId: string;
    payoutGateway: string;
    isDeleted: boolean;
    accountDetails: PayoutAccount;
    restaurantId: string;
    restaurantName: string;
    reason: string;
    payoutOrders: Order[] = [];
    transferReason: string;
    static fromJson(data: any): Payout {
        const p: Payout = new Payout();
        p['payoutId'] = data['id'];
        p['startDate'] = data['start_time'];
        p['endDate'] = data['end_time'];
        p['totalOrderAmount'] = formatNum(data['total_order_amount']);
        p['txnCharges'] = formatNum(data['transaction_charges']);
        p['amountPaidToVendor'] = formatNum(data['amount_paid_to_vendor']);
        p['txnId'] = data['transaction_id'];
        p['payoutCompletedTime'] = data['payout_completed_time'];
        p['payoutStatus'] = PayoutStatusList[data['status']];
        p['canRetry'] = data['retry'];
        p['markedCompletedByAdminId'] = data['completed_marked_admin_id'];
        p['payoutGateway'] = data['payout_gateway'];
        p['isDeleted'] = data['is_deleted'];
        p['accountDetails'] = PayoutAccount.fromJson(data['payout_details']['account']);
        p['restaurantId'] = data['payout_details']['restaurant']?.['id'] || data['payout_details']['store']?.['id'] || data['payout_details']['outlet']?.['id'];
        p['restaurantName'] = data['payout_details']['restaurant']?.['name'] || data['payout_details']['store']?.['name'] || data['payout_details']['outlet']?.['name'];
        if (data['transaction_details']?.['status'] === 'ERROR') {
            p['reason'] = data['transaction_details']['message'];
        }
        if(data['transaction_details']?.['data']?.['transfer']?.['reason'])
        p['transferReason'] = data['transaction_details']['data']['transfer']['reason'];
        return p;
    }
}

export class FilterPayout {
    payoutId: string;
    outletIds: string;
    startDate: string;
    endDate: string;
    processedOnStartDate: string;
    processedOnEndDate: string;
    status: string[] = [];
    pageIndex: number;
    pageSize: number;

    toJson(service: string) {
        const data = {};

        if (this.payoutId) data['search_text'] = this.payoutId;
        if (this.outletIds) {
            if (service === Services.Food) {
                data['restaurant_ids'] = this.outletIds.split(',');
            } else if (service === Services.Grocery) {
                data['store_ids'] = this.outletIds.split(',');
            }else if (service === Services.Paan || service === Services.Flower || service === Services.Pharmacy || service === Services.Pet) {
                data['outlet_ids'] = this.outletIds.split(',');
            }
        }
        data['filter'] = {}
        if (this.status.length) data['filter']['status'] = this.status;
        if (this.startDate && this.endDate) {
            data['filter']['duration'] = {
                start_date: moment(this.startDate).unix(),
                end_date: moment(this.endDate).unix(),
            };
        }
        if (this.processedOnStartDate && this.processedOnEndDate) {
            data['filter']['payout_completed_duration'] = {
                start_date: moment(this.processedOnStartDate).unix(),
                end_date: moment(this.processedOnEndDate).unix(),
            };
        }
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['sort_by'] = {
            column: "created_at",
            direction: "desc"
        }
        return data;
    }
}
export enum PayoutAction {
    Retry = 'Retry Now',
    StopRetry = 'Stop Retrying',
    MarkComplete = 'Mark Complete',
    ExportPDF = 'Export in PDF'
}
export enum PayoutStatusList {
    INIT = 'Initiated',
    FAILED = 'Failed',
    COMPLETE = 'Complete',
    PENDING = 'Pending',
    REJECTED = 'Rejected',
    REVERSED = 'Reversed'
}

export class PayoutReport {
    outletIds: string;
    startDate: string;
    endDate: string;
    receiverEmailId: string;
    
    toJson(){

        const data = {}

        if (this.outletIds) data['restaurant_ids'] = this.outletIds.split(',');
        if (this.receiverEmailId) data['reciever_emails'] = this.receiverEmailId.split(',');
        if (this.startDate) data['start_date'] = this.startDate;
        if (this.endDate) data['end_date'] = this.endDate;
        return data;
    }
}

