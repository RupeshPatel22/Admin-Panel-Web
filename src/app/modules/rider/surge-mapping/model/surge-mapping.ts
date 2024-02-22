import * as moment from "moment";
import { MasterSurgeTypes } from "src/app/modules/data-dump/master-surge/model/master-surge";

export class SurgeMapping {
    surgeId: string;
    clientId: string;
    operationalZoneId: string;
    startAt: string;
    endAt: string;
    status: string;

    toJson(){
        const data = {};
        data['surge_id'] = this.surgeId;
        data['client_id'] = this.clientId;
        data['operational_zone_id'] = this.operationalZoneId;
        data['start_at'] = this.startAt;
        data['end_at'] = this.endAt;
        data['status'] = this.status;
        return data;
    }
}

export class FilterSurgeMapping {
    surgeIds: string;
    types: MasterSurgeTypes[] = [];
    operationalZoneIds: string;
    clientIds: string;
    pageSize: number;
    pageIndex: number;
    toJson() {
        const data = {};
            data['filter'] = {};
            if (this.surgeIds) data['filter']['surge_ids'] = this.surgeIds.split(',');
            if (this.types.length) data['filter']['types'] = this.types;
            if (this.operationalZoneIds) data['filter']['operational_zone_ids'] = this.operationalZoneIds.split(',');
            if (this.clientIds) data['filter']['client_ids'] = this.clientIds.split(',');
            data['pagination'] = {
                page_index: this.pageIndex,
                page_size: this.pageSize
            }      
        return data;
    }

}

export class SurgeMappingData {
    surgeMappingId: number;
    surgeId: number;
    surgeName: string;
    surgeMappingStartAt: string;
    surgeMappingEndAt: string;
    clientId: string;
    clientName: string;
    operationalZoneId: number;
    operationalZoneName: string;

    static fromJson(data: any): SurgeMappingData {
        const s: SurgeMappingData = new SurgeMappingData ();
        s['surgeMappingId'] = data['surge_mapping_id'];
        s['surgeId'] = data['surge_id'];
        s['surgeName'] = data['surge_name'];
        s['clientId'] = data['client_id'];
        s['clientName'] = data['cilent_name'];
        s['operationalZoneId'] = data['operational_zone_id'];
        s['operationalZoneName'] = data['operational_zone_name'];
        s['surgeMappingStartAt'] = convertDateAndTimeToEpoch(data['surge_mapping_start_at']);
        s['surgeMappingEndAt'] = convertDateAndTimeToEpoch(data['surge_mapping_end_at']);
        return s
    }
}

function convertDateAndTimeToEpoch(date: string) {
    return moment(date).format('DD-MM-y, h:mm a');
}