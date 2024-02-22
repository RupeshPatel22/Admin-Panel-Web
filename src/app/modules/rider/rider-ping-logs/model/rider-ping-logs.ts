import * as moment from "moment";


export class RiderLogs {
    riderId: string;
    riderShiftId: string;
    riderActiveStatus: string;
    latitude: number;
    longitude: number;
    createdAt: string;

    static fromJson(data: any): RiderLogs {
        const r: RiderLogs = new RiderLogs();
        r['riderId'] = data['rider_id'];
        r['riderShiftId'] = data['rider_shift_id'];
        r['riderActiveStatus'] = data['active_status'];
        r['latitude'] = data['coordinates']['y'];
        r['longitude'] = data['coordinates']['x'];
        r['createdAt'] = convertDateAndTimeToEpoch(data['created_at']);
        return r;
    }
}

export class RiderShift {
    riderShiftId: string;
    riderId: string;
    riderName: string;
    shiftId: string;
    shiftName: string;
    firstPingEpoch: Date;
    lastPingEpoch: Date;
    rejectedOrderCount: number;

    static fromJson(data: any): RiderShift {
        const r: RiderShift = new RiderShift();
        r['riderShiftId'] = data['id'];
        r['riderId'] = data['rider_id'];
        r['riderName'] = data['rider_name'];
        r['shiftId'] = data['shift_id'];
        r['shiftName'] = data['shift_name'];
        r['firstPingEpoch'] = new Date(data['first_ping_epoch'] * 1000);
        r['lastPingEpoch'] = new Date(data['last_ping_epoch'] * 1000);
        r['rejectedOrderCount'] = data['rejected_order_count'];
        return r;
    }
}

export class RiderLogsFilter {
    riderId: string;
    riderShiftId: string;
    riderActiveStatus: string[] = [];
    startTime: number;
    endTime: number;
    
    constructor() {
        this.endTime = Math.floor(Date.now() / 1000);
        // Set default start time as one hour ago from the end time in epoch format
        const oneHourAgo = new Date(this.endTime * 1000 - 60 * 60 * 1000);
        this.startTime = Math.floor(oneHourAgo.getTime() / 1000);
    }
    toJson() {
        const data = {};

        data['filter'] = {};
        if(this.riderId) data['filter']['rider_id'] = this.riderId;
        if(this.riderShiftId) data['filter']['rider_shift_id'] = this.riderShiftId;
        if(this.riderActiveStatus.length) data['filter']['active_status'] = this.riderActiveStatus;
        if(this.startTime && this.endTime) {
            data['filter']['duration'] = {
                start_time : this.startTime,
                end_time: this.endTime
            }
        }
        return data;
    }
}

export enum RiderActiveStatusList {
    idle = 'Idle',
    allocating = 'Allocating',
    busy = 'Busy',
    offline = 'Offline'
}

function convertDateAndTimeToEpoch(date: string) {
    return moment(date).format('DD-MM-y, h:mm a');

}