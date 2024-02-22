import * as moment from "moment";
import { RiderStatusList } from "../../rider-lists/model/rider-lists";
import { RiderOrder } from "../../rider-orders/model/rider-order";

export class AllRiderShifts {
    id: number;
    riderId: string;
    shiftId:string;
    firstPingEpoch: Date;
    lastPingEpoch: Date;
    uptimeSeconds:string;
    downtimeSeconds:string;
    rejectedOrderCount: number;
    payoutTransactionId: string;
    payoutApprovedByUserId: string;
    payoutAmount: number;
    stopPayout: boolean;
    stopPayoutReason: string;
    settlementAmount: number;
    settlementMsg: string;
    settledBy: string;
    podCollection: number;
    createdAt: string;
    updatedAt: string;
    shiftName: string;
    type: string;
    startTime:string;
    endTime:string;
    minGuaranteeInRupees: number;
    riderName:string;
    isBlocked: boolean;
    blockedBy:string;
    blockedReason: string;
    phone:string;
    holdPayout:boolean;
    riderOrders: RiderOrder[] = [];
    riderStatus: string;

    static fromJson(data): AllRiderShifts {
        const a: AllRiderShifts = new AllRiderShifts();

        a['id'] = data['id'];
        a['riderId'] = data['rider_id']
        a['shiftId'] = data['shift_id'];
        a['firstPingEpoch'] = new Date(data['first_ping_epoch'] * 1000);
        a['lastPingEpoch'] = new Date(data['last_ping_epoch'] * 1000);
        a['uptimeSeconds'] = convertSecondsToHumanTime(data['uptime_seconds']);
        a['downtimeSeconds'] = convertSecondsToHumanTime(data['downtime_seconds']);
        a['rejectedOrderCount'] = data['rejected_order_count'];
        a['payoutTransactionId'] = data['payout_transaction_id'];
        a['payoutApprovedByUserId'] = data['payout_approved_by_user_id'];
        a['payoutAmount'] = data['payout_amount'];
        a['stopPayout'] = data['stop_payout'];
        a['stopPayoutReason'] = data['stop_payout_reason'];
        a['settlementAmount'] = data['settlement_amount'];
        a['settlementMsg'] = data['settlement_message'];
        a['settledBy'] = data['settled_by'];
        a['podCollection'] = data['pod_collection'];
        a['createdAt'] = data['created_at'];
        a['updatedAt'] = data['updated_at'];
        a['shiftName'] = data['shift_name'];
        a['type'] = data['type'];
        a['startTime'] = data['start_time'];
        a['endTime'] = data['end_time'];
        a['minGuaranteeInRupees'] = data['min_guarantee_in_rupees'];
        a['riderName'] = data['rider_name'];
        a['isBlocked'] = data['is_blocked'];
        a['blockedBy'] = data['blocked_by'];
        a['blockedReason'] = data['blocked_reason'];
        a['phone'] = data['phone'];
        a['holdPayout']= data['hold_payout'];
        if (data['orders']) {
            for (const i of data['orders']) {
                a['riderOrders'].push(RiderOrder.fromJson(i));
            }
        }
        a['riderStatus'] = RiderStatusList[data['rider_active_status']];
        return a;
    }
}
export class FilterAllRidersShift {
    riderId: string;
    payoutTransactionId: string;
    stopPayout: boolean;
    riderActiveStatus: string[] = [];
    startDate: Date;
    endDate: Date;
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};

        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {};
        if (this.riderId) data['filter']['rider_id'] = this.riderId;
        if (this.stopPayout !== null) data['filter']['stop_payout'] = this.stopPayout;
        if (this.riderActiveStatus.length) data['filter']['rider_active_status'] = this.riderActiveStatus;
        if (this.payoutTransactionId) data['filter']['payout_transaction_id'] = this.payoutTransactionId;
        if (this.startDate) data['filter']['start_date'] = moment(this.startDate).format('YYYY-MM-DD');
        if (this.endDate) data['filter']['end_date'] = `${moment(this.endDate).format('YYYY-MM-DD')} 23:59:59`;
        return data;
    }
}


export interface ISettleShift {
    riderShiftId: number;
    payoutAmt: number;
    settlementMsg: string;
}

export function convertSecondsToHumanTime(secs: number) {
    return moment.utc(secs * 1000).format('HH:mm');
}
export function convertEpochToDate(epoch: number) {
    return moment.unix(epoch).format('DD/MM/YYYY hh:mm:ss a');
}