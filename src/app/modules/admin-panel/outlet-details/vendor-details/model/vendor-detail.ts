export class VendorDetail {
    id: string;
    name: string;
    loginId: string;
    type: string;
    email: string;
    phone: string;
    outletId: string;
    role: string;
    active: boolean;

    static fromJson (data:any) : VendorDetail{
        const o : VendorDetail = new VendorDetail();
        o['id'] = data['id'];
        o['name'] = data['name'];
        o['loginId'] = data['login_id'];
        o['type'] = data['type'];
        o['email'] = data['email'];
        o['phone'] = data['phone'];
        o['outletId'] = data['outlet_id'];
        o['role'] = data['role'];
        o['active'] = data['active'];
        return o;
    }
}