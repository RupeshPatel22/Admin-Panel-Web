export class OperationalCity {
    id: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    polygon: {lat: number, lng: number}[];

    static fromJson(data: any): OperationalCity {
        const c: OperationalCity = new OperationalCity();
        c['id'] = data['id'];
        c['name'] = data['name'];
        c['status'] = data['status'];
        c['createdAt'] = data['created_at'];
        c['updatedAt'] = data['updated_at'];
        c['isDeleted'] = data['is_deleted'];
        c['polygon'] = data['polygon'].map(pair => ({ lat: pair.latitude, lng: pair.longitude }));
        return c;
    }
}

export class FilterOperationalCity {
    id: string;
    name: string;
    status: string[] = [];
    isDeleted: boolean = false;
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};
        if(this.name) data['search_text'] = this.name;
        data['filter'] = {};
        if (this.id) data['filter']['id'] = this.id.split(',').map(val => val.trim());
        if (this.status.length) data['filter']['status'] = this.status;
        if (this.isDeleted !== null) data['filter']['is_deleted'] = this.isDeleted;
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        return data;
    }
}

export enum OpCityStatus {
    enable = 'Enable',
    disable = 'Disabled'
}

export type OpCityAction = 'Create' | 'View' | 'Edit' | 'View All';

export interface IOpCityEventEmitter {
    action: OpCityAction,
    cityDetails?: OperationalCity
}