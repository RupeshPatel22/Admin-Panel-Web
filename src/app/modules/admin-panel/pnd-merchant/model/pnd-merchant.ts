export class Merchant {
    merchantId: string;
    businessName: string;
    customerId: string;
    email: string;
    kycStatus: string;
    phone: string;
    phoneVerified: string;
    status: string;
    expectedDeliveryInDay: string;
    categoryIds: string[] = [];
    bankName: string;
    bankAccountNumber: string;
    bankIfsc: string;
    upiId: string;
    maxOrderDropLocation: number;
    maxOrderPodCollectionAmount: number;
    additionalPerDropCharges: number;

    static fromJson(data: any) : Merchant{
        const m: Merchant = new Merchant();
        m['merchantId'] = data['id'];
        m['businessName'] = data['business_name'];
        m['customerId'] = data['customer_id'];
        m['email'] = data['email'];
        m['kycStatus'] = KycStatusList[data['kyc_status']];
        m['phone'] = data['phone'];
        m['phoneVerified'] = data['phone_verified'];
        m['status'] = StatusList[data['status']];
        m['expectedDeliveryInDay'] = data['expected_deliveries_in_day'];
        if(data['categories']?.length) {
            for(let c of data['categories']) {
                m['categoryIds'].push(c['id']);
            }
        }
        m['bankName'] = data['bank_name']?data['bank_name']: 'N/A';
        m['bankAccountNumber'] = data['bank_account_number']?data['bank_account_number']: 'N/A';
        m['bankIfsc'] = data['bank_ifsc']?data['bank_ifsc']:'N/A';
        m['upiId'] = data['upi_id']?data['upi_id']: 'N/A';
        m['maxOrderDropLocation'] = data['max_order_drop_locations'];
        m['maxOrderPodCollectionAmount'] = data['max_order_pod_collection_amount'];
        m['additionalPerDropCharges'] = data['additional_per_drop_charges'];
        return m;
    }
}

export class FilterMerchant {
    merchantId: string;
    status: Status[] = [];
    kycStatus: KycStatus[] = [];
    isDeleted: boolean;
    phone: string;
    email: string;
    customerId: string;
    kycApprovedAdminId: string;
    pageSize: number;
    pageIndex: number;
    maxOrderDropLocation: number;
    maxOrderPodCollectionAmount: number;
    additionalPerDropCharges: number;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {}
        if(this.merchantId) data['filter']['merchant_id'] = this.merchantId;
        if(this.status.length) data['filter']['status'] = this.status;
        if(this.kycStatus.length) data['filter']['kyc_status'] = this.kycStatus;
        data['filter']['is_deleted'] = this.isDeleted;
        if(this.phone) data['filter']['phone'] = `+91${this.phone}`;
        if(this.email) data['filter']['email'] = this.email;
        if(this.customerId) data['filter']['customer_id'] = this.customerId;
        if(this.kycApprovedAdminId) data['filter']['kyc_approved_admin_id'] = this.kycApprovedAdminId.split(',');
        if(this.maxOrderDropLocation) data['filter']['max_order_drop_locations'] = this.maxOrderDropLocation;
        if(this.maxOrderPodCollectionAmount) data['filter']['max_order_pod_collection_amount'] = this.maxOrderPodCollectionAmount;
        if(this.additionalPerDropCharges) data['filter']['additional_per_drop_charges'] = this.additionalPerDropCharges;
        return data;
    } 

}
export type Status = 'draft' | 'approved';
export const StatusList: { [key in Status]: string } = {
    draft: 'Draft',
    approved: 'Approved'
} 

export type KycStatus = 'draft' | 'approval_pending' | 'approved';
export const KycStatusList: { [key in KycStatus]: string } = {
    draft: 'Draft',
    approved: 'Approved',
    approval_pending: 'Approval Pending'
}
