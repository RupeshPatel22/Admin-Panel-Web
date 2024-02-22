import * as moment from "moment";
import { formatNum } from "src/app/shared/functions/modular.functions";

export class RiderPodDeposit {
    id: number;
    riderId: string;
    riderName:string;
    riderShiftId?: number;
    amount: string;
    remarks: string;
    cancellationReason: string;
    cancelledAt: string;
    cancelledBy: string;
    depositMethod: string;
    collectedBy: string;
    collectedByAdminId: string;
    createdAt: string;
    shiftDepositDetails?: RiderShiftDeposit[];

    static fromJson(data: any): RiderPodDeposit {
        const r: RiderPodDeposit = new RiderPodDeposit();

        r['id'] = data['id'];
        r['riderId'] = data['rider_id'];
        r['riderName'] = data['name'];
        r['riderShiftId'] = data['rider_shift_id'];
        r['amount'] = formatNum(data['amount']);
        r['remarks'] = data['note'];
        r['cancellationReason'] = data['cancellation_reason'];
        r['cancelledAt'] = data['cancelled_at'];
        r['cancelledBy'] = data['cancelled_by_admin_name'];
        r['depositMethod'] = DepositMethodList[data['deposit_method']];
        r['collectedBy'] = data['collected_by_admin_name'];
        r['collectedByAdminId'] = data['collected_by_admin_id'];
        r['createdAt'] = data['created_at'];
        if (data['rider_shifts_deposits']) {
            r['shiftDepositDetails'] = [];
            for (const i of data['rider_shifts_deposits']) {
                r['shiftDepositDetails'].push(RiderShiftDeposit.fromJson(i));
            }
        }
        return r;
    }

}

export class RiderShiftDeposit {
    riderShiftId: number;
    riderShiftDepositId: number;
    riderId: string;
    amount: string;
    totalPodCollection: string;
    totalPodDeposit: string;

    static fromJson(data: any): RiderShiftDeposit {
        const r: RiderShiftDeposit = new RiderShiftDeposit();
        r['riderShiftId'] = data['rider_shift_id'];
        r['riderShiftDepositId'] = data['rider_shift_deposit_id'];
        r['riderId'] = data['rider_id'];
        r['amount'] = formatNum(data['amount']);
        r['totalPodCollection'] = formatNum(data['pod_collection']);
        r['totalPodDeposit'] = formatNum(data['total_deposit']);
        return r;
    }
}

export class FilterRiderPodDeposit {
    riderId: string;
    riderDepositId: string;
    collectedByAdminId: string;
    minAmount: string;
    maxAmount: string;
    depositMethod: string[] = [];
    startDate: Date;
    endDate: Date;
    pageIndex: number
    pageSize: number;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {};
        if (this.riderId) data['filter']['rider_ids'] = this.riderId.split(',').map(val => val.trim());
        if (this.riderDepositId) data['filter']['rider_deposit_ids'] = this.riderDepositId.split(',').map(val => val.trim());
        if (this.collectedByAdminId) data['filter']['collected_by_admin_id'] = this.collectedByAdminId.split(',').map(val => val.trim());
        if (this.minAmount) data['filter']['amount_gt'] = this.minAmount;
        if (this.maxAmount) data['filter']['amount_lt'] = this.maxAmount;
        if (this.depositMethod.length) data['filter']['deposit_method'] = this.depositMethod;
        if (this.startDate) data['filter']['start_date'] = moment(this.startDate).format('YYYY-MM-DD');
        if (this.endDate) data['filter']['end_date'] = `${moment(this.endDate).format('YYYY-MM-DD')} 23:59:59`;

        return data;
    }
}

export enum DepositMethodList {
    cash = 'Cash',
    net_banking = 'Net Banking',
    upi = 'UPI'
}