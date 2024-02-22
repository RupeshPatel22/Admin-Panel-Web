export class OperationalZone {
    id: number;
    name: string;
    status: string;
    opCityId: number;
    opCityName: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    bannerFactorUpperLimit: number;
    bannerFactorLowerLimit: number;
    polygon: {lat: number, lng: number}[];

    static fromJson(data: any): OperationalZone {
        const c: OperationalZone = new OperationalZone();
        c['id'] = data['id'];
        c['name'] = data['name'];
        c['status'] = data['status'];
        c['opCityId'] = data['operational_city_id'];
        c['opCityName'] = data['operational_city_name'];
        c['createdAt'] = data['created_at'];
        c['updatedAt'] = data['updated_at'];
        c['isDeleted'] = data['is_deleted'];
        c['bannerFactorUpperLimit'] = data['banner_factor_upper_limit'];
        c['bannerFactorLowerLimit'] = data['banner_factor_lower_limit'];
        c['polygon'] = data['polygon'].map(pair => ({ lat: pair.latitude, lng: pair.longitude }));
        return c;
    }
}

export class FilterOperationalZone {
    id: string;
    name: string;
    opCityId: string;
    status: string[] = [];
    isDeleted: boolean = false;
    pageIndex: number;
    pageSize: number;
    maxAllowedBannerFactor: number;

    toJson() {
        const data = {};
        if(this.name) data['search_text'] = this.name;
        data['filter'] = {};
        if (this.id) data['filter']['id'] = this.id.split(',').map(val => val.trim());
        if (this.opCityId) data['filter']['operational_city_id'] = this.opCityId.split(',').map(val => val.trim());
        if (this.status.length) data['filter']['status'] = this.status;
        if (this.isDeleted !== null) data['filter']['is_deleted'] = this.isDeleted;
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        if (this.maxAllowedBannerFactor) data['filter']['max_allowed_banner_factor'] = this.maxAllowedBannerFactor;
        return data;
    }

}

export enum OpZoneStatus {
    enable = 'Enable',
    disable = 'Disabled'
}

export type OpZoneAction = 'Create' | 'View' | 'Edit' | 'View All';

export interface IOpZoneEventEmitter {
    action: OpZoneAction,
    zoneDetails?: OperationalZone;
}