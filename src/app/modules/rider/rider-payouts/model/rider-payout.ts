import * as moment from "moment";
import { formatNum } from "src/app/shared/functions/modular.functions";
import { RiderOrder } from "../../rider-orders/model/rider-order";

export class RiderPayoutAccount {
    payoutAccountId: string;
    beneficiaryName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    isIfscVerified: boolean;
    isDeleted: boolean;
    isPrimary: boolean;
    status: string;

    static fromJson(data: any): RiderPayoutAccount {
        const p: RiderPayoutAccount = new RiderPayoutAccount();
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

export class RiderPayout {
    payoutId: string;
    startDate: string;
    endDate: string;
    totalOrderAmount: string;
    txnCharges: string;
    amountPaidToRider: string;
    txnId: string;
    payoutCompletedTime: string;
    payoutStatus: RiderPayoutStatusList;
    canRetry: boolean;
    markedCompletedByAdminId: string;
    payoutGateway: string;
    isDeleted: boolean;
    accountDetails: RiderPayoutAccount;
    riderId: string;
    riderName: string;
    reason: string;
    shiftPayouts: RiderShiftPayout[] = [];

    static fromJson(data: any): RiderPayout {
        const p: RiderPayout = new RiderPayout();
        p['payoutId'] = data['id'];
        p['startDate'] = data['start_time'];
        p['endDate'] = data['end_time'];
        p['totalOrderAmount'] = formatNum(data['total_order_amount']);
        p['txnCharges'] = formatNum(data['transaction_charges']);
        p['amountPaidToRider'] = formatNum(data['amount_paid_to_rider']);
        p['txnId'] = data['transaction_id'];
        p['payoutCompletedTime'] = data['payout_completed_time'];
        p['payoutStatus'] = RiderPayoutStatusList[data['status']];
        p['canRetry'] = data['retry'];
        p['markedCompletedByAdminId'] = data['completed_marked_admin_id'];
        p['payoutGateway'] = data['payout_gateway'];
        p['isDeleted'] = data['is_deleted'];
        // p['accountDetails'] = RiderPayoutAccount.fromJson(data['payout_details']['account']);
        p['riderId'] = data['rider_id'];
        p['riderName'] = data['rider_name'];
        // if (data['transaction_details']?.['status'] === 'ERROR') {
        //     p['reason'] = data['transaction_details']['message'];
        // }
        for (const i of data['payout_shifts']) {
            p['shiftPayouts'].push(RiderShiftPayout.fromJson(i));
        }
        return p;
    }

}

export class FilterRiderPayout {
    payoutId: string;
    riderIds: string;
    startDate: string;
    endDate: string;
    processedOnStartDate: string;
    processedOnEndDate: string
    status: string[] = [];
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};

        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['sort_by'] = {
            column: "created_at",
            direction: "desc"
        }
        if (this.payoutId) data['search_text'] = this.payoutId;
        if (this.riderIds) data['rider_ids'] = this.riderIds.split(',');
        data['filter'] = {}
        if (this.status.length) data['filter']['status'] = this.status;
        if (this.startDate && this.endDate) {
            data['filter']['duration'] = {
                start_time: moment(this.startDate).unix(),
                end_time: moment(this.endDate).unix(),
            };
        }
        if (this.processedOnStartDate && this.processedOnEndDate) {
            data['filter']['payout_completed_duration'] = {
                start_time: moment(this.processedOnStartDate).unix(),
                end_time: moment(this.processedOnEndDate).unix(),
            };
        }
        return data;
    }
}


export class RiderShiftPayout {
    riderShiftId: number;
    totalUpTime: string;
    totalDownTime: string;
    firstPingAt: string;
    lastPingAt: string;
    payoutAmount: number;
    payoutApprovedByUserId: string;
    rejectedOrdersCount: number;
    shiftId: string;
    shiftName: string;
    stopPayout: boolean;
    stopPayoutReason: string;
    payoutOrders: RiderOrder[] = [];
    
    static fromJson(data: any): RiderShiftPayout{
        const r: RiderShiftPayout = new RiderShiftPayout();

        r['riderShiftId'] = data['id'];
        r['totalUpTime'] = convertSecondsToHumanTime(data['uptime_seconds']);
        r['totalDownTime'] = convertSecondsToHumanTime(data['downtime_seconds']);
        r['firstPingAt'] = convertEpochToDate(data['first_ping_epoch']);
        r['lastPingAt'] = convertEpochToDate(data['last_ping_epoch']);
        r['payoutAmount'] = data['payout_amount'];
        r['payoutApprovedByUserId'] = data['payout_approved_by_user_id'];
        r['rejectedOrdersCount'] = data['rejected_order_count'];
        r['shiftId'] = data['shift_id'];
        r['shiftName'] = data['shift_name'];
        r['stopPayout'] = data['stop_payout'];
        r['stopPayoutReason'] = data['stop_payout_reason'];
        if (data['payout_orders']) {
            for (const i of data['payout_orders']) {
                r['payoutOrders'].push(RiderOrder.fromJson(i));
            }
        }
        return r;
    }
}

export enum RiderPayoutStatusList {
    INIT = 'Initiated',
    FAILED = 'Failed',
    COMPLETE = 'Complete',
    PENDING = 'Pending',
    REJECTED = 'Rejected',
    REVERSED = 'Reversed',
    BLOCKED = 'Blocked'

}

export enum RiderPayoutAction {
    Retry = 'Retry Now',
    StopRetry = 'Stop Retrying',
    MarkComplete = 'Mark Complete',
    ExportPDF = 'Export in PDF'
}

export function convertSecondsToHumanTime(secs: number) {
    return moment.utc(secs * 1000).format('HH:mm');
}
export function convertEpochToDate(epoch: number) {
    return moment.unix(epoch).format('DD/MM/YYYY hh:mm:ss a');
}