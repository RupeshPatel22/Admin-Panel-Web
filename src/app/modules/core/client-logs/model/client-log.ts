import * as moment from "moment";

export class ClientLog {
    id: number;
    level: string;
    ipAddr: string;
    userId: string;
    userType: UserType;
    clientOs: string;
    clientBrowser: string;
    clientApp: ClientAppType;
    clientAppVersion: string;
    clientDeviceId: string;
    code: number;
    message: string;
    data: string;
    createdAt: string;

    static fromJson(data: any): ClientLog {
        const c: ClientLog = new ClientLog();
        c['id'] = data['id'];
        c['level'] = ClientLogLevel[data['level']];
        c['ipAddr'] = data['ip_address'];
        c['userId'] = data['user_id'];
        c['userType'] = UserType[data['user_type']];
        c['clientOs'] = `${data['user_agent']['os']['name'] || ''} ${data['user_agent']['os']['version'] || ''}`;
        c['clientBrowser'] = `${data['user_agent']['browser']['name'] || ''} ${data['user_agent']['browser']['version'] || ''}`;
        c['clientApp'] = ClientAppType[data['client_app']];
        c['clientAppVersion'] = data['client_app_version'];
        c['clientDeviceId'] = data['client_device_id'];
        c['code'] = data['code'];
        c['message'] = data['message'];
        c['data'] = data['data'];
        c['createdAt'] = data['created_at'];
        return c;
    }
}

export class FilterClientLog {
    userId: string;
    ipAddr: string;
    level: string[] = [];
    userType: string[] = [];
    clientApp: string[] = [];
    clientAppVersion: string;
    code: string;
    clientDeviceId: string;
    startDate: Date;
    endDate: Date;
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {};
        if (this.userId) data['filter']['user_id'] = this.userId;
        if (this.ipAddr) data['filter']['ip_address'] = this.ipAddr;
        if (this.clientAppVersion) data['filter']['client_app_version'] = this.clientAppVersion;
        if (this.code) data['filter']['code'] = this.code;
        if (this.clientDeviceId) data['filter']['client_device_id'] = this.clientDeviceId;
        if (this.userType.length) data['filter']['user_type'] = this.userType;
        if (this.clientApp.length) data['filter']['client_app'] = this.clientApp;
        if (this.level.length) data['filter']['level'] = this.level;
        if (this.startDate && this.endDate) {
            data['filter']['duration'] = {
                start_time: moment(this.startDate).unix(),
                end_time: moment(this.endDate.setHours(23, 59, 59)).unix(),
            }
        }
        return data;
    }
}

export enum UserType {
    admin = 'Admin',
    vendor = 'Vendor',
    customer = 'Customer',
    rider = 'Rider',
    partner = 'Partner'
}

export enum ClientAppType {
    admin_dashboard = 'Admin Dashboard',
    vendor_dashboard = 'Vendor Dashboard',
    order_details_dashboard = 'Order Details Dashboard',
    coupon_dashboard = 'Coupon Dashbaord',
    partner_dashboard = 'Partner Dashboard',
    customer_app = 'Customer App',
    vendor_app = 'Vendor App',
    rider_app = 'Rider App'
}

export enum ClientLogLevel {
    error = 'Error',
    warn = 'Warn',
    info = 'Info',
    debug = 'Debug',
    silly = 'Silly',
}