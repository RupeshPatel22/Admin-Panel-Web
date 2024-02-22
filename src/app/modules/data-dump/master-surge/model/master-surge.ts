import * as moment from "moment";

export class MasterSurge {
    id: number;
    name: string;
    type: string;
    frequency: string;
    startTime: string;
    endTime: string;
    rateType: string;
    rate: number;
    message: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;

    static fromJson(data: any): MasterSurge {
        const m: MasterSurge = new MasterSurge ();
        m['id'] = data['id'];
        m['name'] = data['name'];
        m['type'] = data['type'];
        m['frequency'] = data['frequency'];
        m['startTime'] = convertDate(data['start_time']);
        m['endTime'] = convertDate(data['end_time']);
        m['rateType'] = data['rate_type'];
        m['rate'] = data['rate'];
        m['message'] = data['message'];
        m['status'] = masterSurgeStatusList[data['status']];
        m['isDeleted'] = data['is_deleted'];
        m['createdAt'] = convertDateAndTimeToEpoch(data['created_at']);
        m['updatedAt'] = convertDateAndTimeToEpoch(data['updated_at']);
        return m
    }
}


export class FilterMasterSurge {
    name: string;
    surgeIds: string;
    type: string;
    frequency: string;
    startTime: string;
    endTime: string;
    rateType: string;
    rate: string;
    message: string;
    types: MasterSurgeTypes[] = [];
    pageSize: number;
    pageIndex: number;
    toJson(action?: MasterSurgeAction) {
        const data = {};
        if (action !== 'Add' && action !== 'Edit'){
            data['filter'] = {};
            if (this.surgeIds) data['filter']['surge_ids'] = this.surgeIds.split(',');
            if (this.types.length) data['filter']['types'] = this.types;
            data['pagination'] = {
                page_index: this.pageIndex,
                page_size: this.pageSize
            }
        }

        if (action === 'Add') {
            data['name'] = this.name;
            data['type'] = this.type;
            data['frequency'] = this.frequency;
            data['start_time'] = this.startTime;
            data['end_time'] = this.endTime;
            data['rate_type'] = this.rateType;
            data['rate'] = this.rate;
            data['message'] = this.message;
        }

        if (action === 'Edit') {
            data['name'] = this.name;
            data['type'] = this.type;
            data['rate_type'] = this.rateType;
            data['rate'] = this.rate;
            data['message'] = this.message;
        }
        
        return data;
    }

}

export type MasterSurgeAction = 'Add' | 'Edit';

export type MasterSurgeTypes = 'banner_factor' | 'festival' | 'late_night' | 'rain';

export const masterSurgeTypeList: { [key in MasterSurgeTypes]: string} = {
    banner_factor: 'Banner Factor',
    festival: 'Festival',
    late_night: 'Late Night',
    rain: 'Rain'
}

export type MasterSurgeFrequency = 'daily' | 'once';

export const masterSurgeFrequencyList: { [key in MasterSurgeFrequency]: string} = {
    daily: 'Daily',
    once: 'Once'
}

export type MasterSurgeRateType = 'fixed' | 'per_km';

export const masterSurgeRateTypeList: {[key in MasterSurgeRateType]: string} = {
    fixed: 'Fixed',
    per_km: 'Per KM'
}

export type MasterSurgeStatus = 'active' | 'inactive';

export const masterSurgeStatusList: {[key in MasterSurgeStatus]: string} = {
    active: 'Active',
    inactive: 'Disable'
}

function convertDateAndTimeToEpoch(date: string) {
    return moment(date).format('DD-MM-y, h:mm a');
}

function convertDate(date: string) {
    return moment(date, 'hhmm').format('HH:mm');
}