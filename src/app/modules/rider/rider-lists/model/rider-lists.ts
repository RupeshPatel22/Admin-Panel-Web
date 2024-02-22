import * as moment from "moment";

export class Rider {
    id: string;
    name: string;
    phone: string;
    dob: string;
    status: string;
    accountNumber: string;
    ifscCode: string;
    blockedBy: string;
    blockedReason: string;
    isBlocked: boolean;
    isDeleted: boolean;
    orderId: number;
    rejectedOrderCount: number;
    rejectReason: string;
    riderPhotoDoc: string;
    riderPhotoUrl: string;
    panDoc: string;
    panDocUrl: string;
    aadharFrontDoc: string;
    aadharFrontUrl: string;
    aadharBackDoc: string;
    aadharBackUrl: string;
    drivingLicenseDoc: string;
    drivingLicenseUrl: string;
    cancelledChequeDoc: string;
    cancelledChequeUrl: string;
    type: RiderTypes;
    approvedAdminId: string;
    approvedAdminName: string;
    approvalStatus: string;
    riderImageName: string;
    riderImageUrl: string;
    createdAt: string;
    updatedAt: string;
    maxPodInHand: number;
    pingStatus: string;
    offlineReason: string;
    lastOfflineAt: string;
    pingStatusUpdatedAt: string;
    latitude: number;
    longitude: number;
    outOfOperationalZoneSince: string;
    currentOperationalZoneId: number;
    currentOperationalZoneName: string;
    sponsoredById: string;


    static fromJson(data: any): Rider {
        const r: Rider = new Rider();
        r['id'] = data['id'];
        r['name'] = data['name'];
        r['phone'] = data['phone'];
        r['dob'] = data['date_of_birth'];
        r['status'] = RiderStatusList[data['active_status']];
        r['accountNumber'] = data['bank_account_number'];
        r['ifscCode'] = data['bank_ifsc'];
        r['blockedBy'] = data['blocked_by'];
        r['blockedReason'] = data['blocked_reason'];
        r['isBlocked'] = data['is_blocked'];
        r['isDeleted'] = data['is_deleted'];
        r['orderId'] = data['order_id'];
        r['rejectedOrderCount'] = data['rejected_order_count'];
        r['rejectReason'] = data['reject_reason'];
        r['riderPhotoDoc'] = data['image']?.['name'];
        r['riderPhotoUrl'] = data['image']?.['url'];
        r['panDoc'] = data['pan_card']?.['name'];
        r['panDocUrl'] = data['pan_card']?.['url'];
        r['aadharFrontDoc'] = data['adhar_card_front']?.['name'];
        r['aadharFrontUrl'] = data['adhar_card_front']?.['url'];
        r['aadharBackDoc'] = data['adhar_card_back']?.['name'];
        r['aadharBackUrl'] = data['adhar_card_back']?.['url'];
        r['drivingLicenseDoc'] = data['driver_license']?.['name'];
        r['drivingLicenseUrl'] = data['driver_license']?.['url'];
        r['cancelledChequeDoc'] = data['cancelled_cheque']?.['name'];
        r['cancelledChequeUrl'] = data['cancelled_cheque']?.['url'];
        r['type'] = data['type'];
        r['approvedAdminId'] = data['approved_admin_id'];
        r['approvedAdminName'] = data['approved_admin_name'];
        r['approvalStatus'] = data['approval_status'];
        r['riderImageName']= data['image']?.['name'];
        r['riderImageUrl'] = data['image']?.['url'];
        r['createdAt'] = convertDateAndTimeToEpoch(data['created_at']);
        r['updatedAt'] = convertDateAndTimeToEpoch(data ['updated_at']);
        r['pingStatus'] = RiderPingStatusList[data['ping_status']];
        r['offlineReason'] = data['offline_reason'];
        r['maxPodInHand'] = data['max_pod_in_hand'];
        r['pingStatus'] = RiderPingStatusList[data['ping_status']];
        r['offlineReason'] = data['offline_reason'];
        r['lastOfflineAt'] = data['last_offline_at'] ? convertDateAndTimeToEpoch(data['last_offline_at']): data['last_offline_at'];
        r['pingStatusUpdatedAt'] = data['ping_status_updated_at'] ? convertDateAndTimeToEpoch(data['ping_status_updated_at']): data['ping_status_updated_at'];
        r['latitude'] = data['latitude'];
        r['longitude'] = data['longitude'];
        r['outOfOperationalZoneSince'] = data['out_of_operational_zone_since'] ? convertDateAndTimeToEpoch(data['out_of_operational_zone_since']): data['out_of_operational_zone_since'];
        r['currentOperationalZoneId'] = data['current_operational_zone_id'];
        r['currentOperationalZoneName'] = data['current_operational_zone_name'];
        r['sponsoredById'] = data['sponsored_by_id'];
        return r;
    }
}

export class FilterRider {
    riderId: string;
    riderName: string;
    riderStatus: string[] = [];
    riderPingStatus: string[] = [];
    blockedRider: boolean;
    approvalStatus: string[] = [];
    type: string;
    holdPayout: boolean;
    phone: string;
    isDeleted: boolean;
    orderId: string;
    approvedAdminId: string;
    blockedBy: string;
    pageIndex: number;
    pageSize: number;
    offlineReason: string[] = [];
    currentOperationalZoneId: string;

    toJson() {
        const data = {};

        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        if (this.riderName) data['search_text'] = this.riderName;
        data['filter'] = {};
        data['filter']['approval_status'] = ['approved'];
        if(this.riderId) data['filter']['rider_id'] = this.riderId;
        if (this.riderStatus.length) data['filter']['active_status'] = this.riderStatus;
        if (this.blockedRider !==null) data['filter']['is_blocked'] = this.blockedRider;
        // if(this.approvalStatus.length) data['filter']['approval_status'] = this.approvalStatus;
        if(this.type) data['filter']['type'] = this.type;
        if(this.holdPayout !== null) data['filter']['hold_payout'] = this.holdPayout;
        if(this.phone) data['filter']['phone'] = `+91${this.phone}`;
        if(this.isDeleted !== null) data['filter']['is_deleted'] = this.isDeleted;
        if(this.orderId) data['filter']['order_id'] = this.orderId;
        if(this.approvedAdminId) data['filter']['approved_admin_id'] = this.approvedAdminId.split(',');
        if(this.blockedBy) data['filter']['blocked_by'] = this.blockedBy.split(',');
        if(this.riderPingStatus.length) data['filter']['ping_status'] = this.riderPingStatus;
        if(this.offlineReason.length) data['filter']['offline_reason'] = this.offlineReason;
        if(this.currentOperationalZoneId) data['filter']['current_operational_zone_id'] = this.currentOperationalZoneId.split(',');
        return data;
    }
}

export enum RiderStatusList {
    idle = 'Idle',
    allocating = 'Allocating',
    busy = 'Busy',
    offline = 'Offline'
}

export type RiderTypes = 'independent' | 'partner' | 'sponsored';

export const RiderTypeList: { [key in RiderTypes]: string } = {
    independent: 'Independent',
    partner: 'Partner',
    sponsored: 'Sponsored'
}
export enum ApprovalStatusList {
    draft = 'Draft',
    pending = 'Pending',
    rejected = 'Rejected',
    approved = 'Approved'
}

export enum RiderPingStatusList {
    live = 'Live',
    warning = 'Warning',
    offline = 'Offline'
}
export enum RiderOfflineReasonsList {
    out_of_operational_zone = 'Out of operational Zone',
    no_active_shifts = 'No active Shifts',
    out_of_business_hours = 'Out of business hours',
    ping_not_received = 'Ping not received',
    rider_set_offline = 'Rider set offline'
}

function convertDateAndTimeToEpoch(date: string) {
    return moment(date).format('DD-MM-y, h:mm a');

}