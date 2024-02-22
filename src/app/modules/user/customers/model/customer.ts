export class Customer {
    id: string;
    name: string;
    phone: string;
    alternatePhone: string;
    email: string;
    status: string;
    role: string[];
    isDeleted: boolean;
    isBlocked: boolean;
    blockedReason: string;
    unblockedReason: string;
    blockedByAdminId: string;
    blockedByAdminName: string;
    unblockedByAdminId: string;
    unblockedByAdminName: string;

    static fromJson(data: any): Customer {
        const c: Customer = new Customer();

        c['id'] = data['id'];
        c['name'] = data['full_name'];
        c['phone'] = data['phone'];
        c['alternatePhone'] = data['alternate_phone'];
        c['email'] = data['email'];
        c['status'] = data['status'];
        c['role'] = data['role'];
        c['isDeleted'] = data['is_deleted'];
        c['isBlocked'] = data['is_blocked'];
        c['blockedReason'] = data['blocked_reason'];
        c['unblockedReason'] = data['unblocked_reason'];
        c['blockedByAdminId'] = data['blocked_by_admin_id'];
        c['blockedByAdminName'] = data['blocked_by_admin_name'];
        c['unblockedByAdminId'] = data['unblocked_by_admin_id'];
        c['unblockedByAdminName'] = data['unblocked_by_admin_name'];
        return c;
    }
}

export class FilterCustomer {
    id: string;
    phone: string;
    email: string;
    isBlocked: boolean;
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {};
        if (this.id) data['filter']['id'] = this.id.split(',').map(val => val.trim());
        if (this.phone) data['filter']['phone'] = this.phone.split(',').map(val => `+91${val.trim()}`);
        if (this.email) data['filter']['email'] = this.email.split(',').map(val => val.trim());
        if (this.isBlocked !== null) data['filter']['is_blocked'] = this.isBlocked;

        return data;
    }
}