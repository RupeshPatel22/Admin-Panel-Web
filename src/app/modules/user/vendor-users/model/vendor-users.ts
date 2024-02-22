export class VendorUsers {
    id: string;
    name: string;
    email: string;
    phone: string;
    isDeleted: boolean;
    active: boolean
    type: string;
    outletId: string;
    role: string;

    static fromJson(data: any) : VendorUsers{
        const v: VendorUsers = new VendorUsers();
        v['id'] = data['id'];
        v['name'] = data['name'];
        v['email'] = data['email'];
        v['phone'] = data['phone'];
        v['isDeleted'] = data['is_deleted'];
        v['active'] = data['active'];
        v['type'] = data['type'];
        v['outletId'] = data['outlet_id'];
        v['role'] = data['role'];
        return v;
    }

}

export class FilterVendorUsers {
    id: string;
    email: string;
    phone: string;
    isDeleted: boolean;
    active: boolean;
    type: Type[] = ['restaurant','flower','store','paan','pharmacy','pet'];
    outletId: string;
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {};
        if (this.id) data['filter']['id'] = this.id.split(',');
        if (this.email) data['filter']['email'] = this.email.split(',');
        if (this.phone) data['filter']['phone'] = `+91${this.phone}`.split(',');
        if (this.isDeleted) data['filter']['is_deleted'] = this.isDeleted;
        data['filter']['active'] = this.active;
        if (this.type.length) data['filter']['type'] = this.type;
        if (this.outletId) data['filter']['outlet_id'] = this.outletId.split(',');
        return data;
    }
}
export type Type =  'restaurant' | 'store' | 'paan' | 'flower' | 'pharmacy' | 'pet';
export const typeList: { [key in Type]: string } = {
    restaurant: 'Restaurant',
    store: 'Grocery',
    paan: 'Paan',
    flower: 'Flower',
    pharmacy: 'Pharmacy',
    pet: 'Pet'
}