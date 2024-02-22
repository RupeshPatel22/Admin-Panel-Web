import { Roles } from "src/app/shared/models";

export class AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    loginId: string;
    password: string;
    isDeleted: boolean;
    roles: string[] = [];
    isBlock: boolean;
    blockedByAdminId: string;
    blockedByAdminName: string;
    blockedReason: string;
    unBlockedByAdminId: string;
    unBlockedByAdminName: string;
    unBlockedReason: string;

    static fromJson(data: any): AdminUser {
        const a: AdminUser = new AdminUser();

        a['id'] = data['id'];
        a['name'] = data['full_name'];
        a['email'] = data['email'];
        a['phone'] = data['phone']?.split('+91')[1];
        a['loginId'] = data['user_name'];
        a['password'] = data['password'];
        a['isDeleted'] = data['is_deleted'];
        a['roles'] = data['role'];
        a['isBlock'] = data['is_blocked'];
        a['blockedByAdminId'] = data['blocked_by_admin_id'];
        a['blockedByAdminName'] = data['blocked_by_admin_name'];
        a['blockedReason'] = data['blocked_reason'];
        a['unBlockedByAdminId'] = data['unblocked_by_admin_id'];
        a['unBlockedByAdminName'] = data['unblocked_by_admin_name'];
        a['unBlockedReason'] = data['unblocked_reason'];
        return a;
    }

    toJson(actionType: AdminUserAction) {
        const data = {};
        data['full_name'] = this.name;
        data['email'] = this.email;
        data['phone'] = `+91${this.phone}`;
        data['user_name'] = this.loginId;
        if (actionType === 'Add') data['password'] = this.password;
        data['role'] = this.roles;
        return data;
    }
}

export class FilterAdminUser {
    id: string;
    name: string;
    phone: string;
    email: string;
    loginId: string;
    isBlock: string;
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        if (this.name) data['search_text'] = this.name;
        data['filter'] = {};
        if (this.id) data['filter']['id'] = [this.id];
        if (this.phone) data['filter']['phone'] = `+91${this.phone}`;
        if (this.email) data['filter']['email'] = this.email;
        if (this.loginId) data['filter']['user_name'] = this.loginId;
        if (this.isBlock) data['filter']['is_blocked'] = this.isBlock;
        return data;
    }
}

export type AdminUserAction = 'Add' | 'Edit';