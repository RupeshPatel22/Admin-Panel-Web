export class ParentChild {
    id: string;
    partnerId: string;
    outletName: string;
    status: string;

    static fromJson (data: any) : ParentChild{
        const p : ParentChild = new ParentChild();
        p['id'] = data['id'];
        p['partnerId'] = data['partner_id'];
        p['outletName'] = data['name'];
        p['status'] = data['status'];
        return p;
    }

}