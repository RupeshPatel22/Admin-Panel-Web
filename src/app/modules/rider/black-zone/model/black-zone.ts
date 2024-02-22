export class BlackZone {
    id: number;
    name: string;
    status: string;
    opCityId: number;
    opCityName: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    durationType: string;
    description: string;
    polygon: {lat: number, lng: number}[];

    static fromJson(data: any): BlackZone {
        const b: BlackZone = new BlackZone();
        b['id'] = data['id'];
        b['name'] = data['name'];
        b['status'] = data['status'];
        b['opCityId'] = data['operational_city_id'];
        b['opCityName'] = data['operational_city_name'];
        b['createdAt'] = data['created_at'];
        b['updatedAt'] = data['updated_at'];
        b['isDeleted'] = data['is_deleted'];
        b['durationType'] = data['duration_type'];
        b['description'] = data['description'];
        b['polygon'] = data['polygon'].map(pair => ({ lat: pair.latitude, lng: pair.longitude }));
        return b;
    }
}

export class FilterBlackZone {
    id: string;
    name: string;
    opCityId: string;
    status: string[] = [];
    isDeleted: boolean = false;
    durationType: string;
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};
        if(this.name) data['search_text'] = this.name;
        data['filter'] = {};
        if (this.id) data['filter']['id'] = this.id.split(',').map(val => val.trim());
        if (this.opCityId) data['filter']['operational_city_id'] = this.opCityId.split(',').map(val => val.trim());
        if (this.status.length) data['filter']['status'] = this.status;
        if (this.isDeleted !== null) data['filter']['is_deleted'] = this.isDeleted;
        if (this.durationType) data['filter']['duration_type'] = this.durationType;
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        return data;
    }
}

export enum BlackZoneStatus {
    enable = 'Enable',
    disable = 'Disabled'
}

export enum BlackZoneDurationType {
    temporary = 'Temporary',
    permanent = 'Permanent'
}

export type BlackZoneAction = 'Create' | 'View' | 'Edit' | 'View All';

export interface IBlackZoneEventEmitter {
    action: BlackZoneAction,
    zoneDetails?: BlackZone;
}