import * as moment from "moment";
import { formatNum } from "src/app/shared/functions/modular.functions";
import { RiderOrder } from "../../rider-orders/model/rider-order";
import { RiderPodDeposit } from "../../rider-pod-deposit/model/rider-pod-deposit";

export class FilterRiderPodCollection {
    riderShiftIds: string;
    riderTypes: string;
    clientOrderIds: string;
    clientIds: string;
    riderIds: string;
    startDate: Date = new Date(new Date().setDate(new Date().getDate() - 30));
    endDate: Date = new Date();
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {};
        if (this.riderIds) data['filter']['rider_ids'] = this.riderIds.split(',');
        return data;
    }

    /**
     * Converts the FilterRiderPodCollection instance into a JSON object
     * suitable for exporting as CSV data, with specific filtering options.
     * @returns {object} - The JSON object representing the filter criteria.
     */
    toJsonCSV() {
        const data = {};
        data['filter'] = {};
        if (this.riderShiftIds) data['filter']['rider_shift_ids'] = this.riderShiftIds.split(',');
        if (this.riderTypes) data['filter']['rider_types'] = this.riderTypes.split(',');
        if (this.clientOrderIds) data['filter']['client_order_ids'] = this.clientOrderIds.split(',');
        if (this.clientIds) data['filter']['client_ids'] = this.clientIds.split(',');
        if (this.riderIds) data['filter']['rider_ids'] = this.riderIds.split(',');
        if (this.startDate) data['filter']['start_date'] = moment(this.startDate).format('YYYY-MM-DD');
        if (this.endDate) data['filter']['end_date'] = `${moment(this.endDate).format('YYYY-MM-DD')} 23:59:59`;
        return data;
    }
}

export class RiderPodCollections {
    riderId: string;
    riderName: string;
    riderPhone: string;
    // riderActiveStatus:string;
    type: string;
    podCollection: number;
    totalPodDeposit: number;
    cashInHand: number;

    static fromJson(data): RiderPodCollections {
        const r: RiderPodCollections = new RiderPodCollections();

        r['riderId'] = data['id'];
        r['riderName'] = data['name'];
        r['riderPhone'] = data['phone'];
        r['riderActiveStatus'] = data['active_status'];
        r['type'] = data['type'];
        r['podCollection'] = data['pod_collection'];
        r['totalPodDeposit'] = data['pod_deposit'];
        r['cashInHand'] = data['pod_collection'] - data['pod_deposit'];
        return r;
    }
}

// TODO copied from rider-payout.ts and have added podDeposits, totalPodCollection, totalPodDeposit prop
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
    podDeposits: RiderPodDeposit[] = [];
    totalPodCollection: string;
    totalPodDeposit: string;

    static fromJson(data: any): RiderShiftPayout {
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
        if (data['deposits']) {
            for (const i of data['deposits']) {
                r['podDeposits'].push(RiderPodDeposit.fromJson(i));
            }
        }
        r['totalPodCollection'] = formatNum(data['pod_collection']);
        r['totalPodDeposit'] = formatNum(data['pod_deposit']);
        return r;
    }
}

export function convertSecondsToHumanTime(secs: number) {
    return moment.utc(secs * 1000).format('HH:mm');
}
export function convertEpochToDate(epoch: number) {
    return moment.unix(epoch).format('DD/MM/YYYY hh:mm:ss a');
}