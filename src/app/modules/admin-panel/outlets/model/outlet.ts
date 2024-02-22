import { Services } from "src/app/shared/models";
import { DeliverySplitting } from "../../outlet-details/catalogue/model/catalogue";

export class Outlet {
    id: string;
    name: string;
    totalReviews: number;
    longDistanceAllowed: boolean;
    approvedBy: string;
    approvedByName: string;
    areaId: string;
    areaName: string;
    isOpen: boolean;
    cityId: string;
    cityName: string;
    cuisines: string[];
    primaryCuisines: string[];
    invoiceEmail: string;
    isPureVeg: boolean;
    latitude: number;
    longitude: number;
    address: string;
    searchLocation: string;
    managerContactNumber: string;
    managerEmailId: string;
    ownerContactNumber: string;
    ownerEmailId: string;
    postalCode: string;
    // avgRating: string;
    likeCount: number;
    dislikeCount: number;
    genuinePrice: boolean;

    costOfTwo: number;
    defaultPrepTime: number;
    outletPrimaryImage: IOutletImage = <IOutletImage>{};
    outletImages: IOutletImage[] = [];

    beneficiaryName: string;
    bankAccountNumber: string;
    bankDocName: string;
    bankDocUrl: string;
    kycDocName: string;
    kycDocUrl: string;
    ifscCode: string;
    gstCategory: string;
    hasGST: boolean;
    gstNumber: string;
    gstDocName: string;
    gstDocUrl: string;
    pan: string;
    panDocName: string;
    panOwnerName: string;
    panDocUrl: string;
    isSpeedyyChargesApplied: boolean;
    speedyyChargesType: string;
    speedyyChargesRate: number;
    registrationNumber: string;
    registrationDocName: string;
    registrationDocUrl: string;
    hasRegistration:boolean;

    hasFssaiCertificate: boolean;
    fssaiCertNumber: string;
    fssaiCertDocName: string;
    fssaiCertDocUrl: string;
    fssaiExpirationDate: string;
    fssaiAckNumber: string;
    fssaiAckDocName: string;
    fssaiAckDocUrl: string;
    fssaiApplicationDate: string;
    fssaiFirmName: string;
    fssaiFirmAddress: string;
    state: string;

    status: string;
    businessName: string;
    businessAddress: string;
    packagingChargesType: PackagingChargesTypes;
    orderLevelPackagingCharges: number;
    customItemLevalPackagingCharges: boolean = false;
    itemRows: IPackingChargesItemLevel[];
    menuRows: IMenuDocument[];
    posId: string;
    deliveryChargesPaidBy: DeliveryChargesPaidBy;
    isDeliveryChargesPaidByOutlet: boolean;
    minOrderValForFreeDeliveryByOutlet: number;
    branchName: string;
    posName: string;
    pocList: IPocList[] = [];
    speedyyAccountManagerId: string;
    speedyyAccountManagerName: string;

    parentId: string;
    parentOrChild: string;
    discountRate: number;
    outletType: string;
    primaryManagerId: string;
    primaryManagerName: string;
    deliverySplitting: DeliverySplitting;
    nextOpensAt: string;
    hasSponsoredRider: boolean;

    drugLicenseNumber: string;
    drugRetailDoc: string;
    drugRetailDocUrl: string;
    drugWholeSaleDoc: string;
    drugWholeSaleDocUrl: string;
    turnDebugModeOn: string;    
    agreedSpeedyyChargePercentage: number;
    packgingChargeSlabApplied: boolean;
    static fromJson(data: any, service: string): Outlet {
        const o: Outlet = new Outlet();

        o['id'] = data['id'];
        o['name'] = data['name'];
        o['totalReviews'] = data['all_time_rating_order_count'];
        o['longDistanceAllowed'] = data['allow_long_distance'];
        o['approvedBy'] = data['approved_by'];
        o['approvedByName'] = data['approved_by_name'];
        o['areaId'] = data['area_id'];
        o['areaName'] = data['area_name'];
        o['isOpen'] = data['availability']?.['is_open'];
        o['nextOpensAt'] = data['availability']?.['next_opens_at']
        o['cityId'] = data['city_id'];
        o['cityName'] = data['city_name'];
        o['cuisines'] = data['cuisine_ids'];
        o['primaryCuisines'] = data['primary_cuisine_ids'];
        o['invoiceEmail'] = data['invoice_email'];
        o['isPureVeg'] = data['is_pure_veg'];
        o['latitude'] = data['lat'];
        o['longitude'] = data['long'];
        o['address'] = data['location'];
        o['searchLocation'] = data['location'];
        o['managerContactNumber'] = data['manager_contact_number'];
        o['managerEmailId'] = data['manager_email'];
        o['ownerContactNumber'] = data['owner_contact_number'];
        o['ownerEmailId'] = data['owner_email'];
        o['postalCode'] = data['postal_code'];
        // o['avgRating'] = data['rating'];
        o['costOfTwo'] = data['cost_of_two'];
        o['defaultPrepTime'] = data['default_preparation_time'];
        o['outletPrimaryImage']['name'] = data['image']?.['name'];
        o['outletPrimaryImage']['url'] = data['image']?.['url'];
        if (data['images'])
            for (const i of data['images']) {
                const image = <IOutletImage>{};
                image['name'] = i['name'];
                image['url'] = i['url'];
                o['outletImages'].push(image);
            }
        o['beneficiaryName'] = data['beneficiary_name'];
        o['bankAccountNumber'] = data['bank_account_number'];
        o['bankDocName'] = data['bank_document']?.['name'];
        o['bankDocUrl'] = data['bank_document']?.['url'];
        o['kycDocName'] = data['kyc_document']?.['name'];
        o['kycDocUrl'] = data['kyc_document']?.['url'];
        o['ifscCode'] = data['ifsc_code'];
        o['gstCategory'] = data['gst_category'];
        o['hasGST'] = data['has_gstin'];
        o['gstNumber'] = data['gstin_number']
        o['gstDocName'] = data['gstin_document']?.['name'];
        o['gstDocUrl'] = data['gstin_document']?.['url'];
        o['pan'] = data['pan_number'];
        o['panOwnerName'] = data['pan_owner_name'];
        o['panDocName'] = data['pan_document']?.['name'];
        o['panDocUrl'] = data['pan_document']?.['url'];
        o['isSpeedyyChargesApplied'] = data['speedyy_charge_applied'];
        o['speedyyChargesType'] = data['speedyy_charge_type'];
        o['speedyyChargesRate'] = data['speedyy_charge_rate'];
        o['registrationNumber'] = data['registration_number'];
        o['registrationDocName'] = data['registration_document']?.['name'];
        o['registrationDocUrl'] = data['registration_document']?.['url'];
        o['hasRegistration'] = data['has_registration'];
        o['hasFssaiCertificate'] = data['fssai_has_certificate'];
        o['fssaiCertNumber'] = data['fssai_cert_number'];
        o['fssaiCertDocName'] = data['fssai_cert_document']?.['name'];
        o['fssaiCertDocUrl'] = data['fssai_cert_document']?.['url'];
        o['fssaiExpirationDate'] = data['fssai_expiry_date'];
        o['fssaiAckNumber'] = data['fssai_ack_number'];
        o['fssaiAckDocName'] = data['fssai_ack_document']?.['name'];
        o['fssaiAckDocUrl'] = data['fssai_ack_document']?.['url'];
        o['fssaiApplicationDate'] = data['fssai_application_date'];
        o['fssaiFirmName'] = data['fssai_firm_name'];
        o['fssaiFirmAddress'] = data['fssai_firm_address'];
        o['state'] = data['state'];
        o['status'] = data['status'];
        o['businessName'] = data['business_name'];
        o['businessAddress'] = data['business_address'];
        o['packagingChargesType'] = data['packing_charge_type'];
        o['customItemLevalPackagingCharges'] = data['custom_packing_charge_item'];
        if (o['packagingChargesType'] === 'item' && o['customItemLevalPackagingCharges']) {
            o['itemRows'] = [];
            for (const i of data['packing_charge_item']) {
                const item = <IPackingChargesItemLevel>{};
                item['itemName'] = i['item_name'];
                item['itemPrice'] = i['item_price'];
                item['itemPackagingCharges'] = i['packing_charge'];
                item['itemDoc'] = i['packing_image']['name'];
                item['itemDocUrl'] = i['packing_image']['url'];
                o['itemRows'].push(item);
            }
        }
        if (o['packagingChargesType'] === 'order') {
            o['orderLevelPackagingCharges'] = data['packing_charge_order']['packing_charge'];
        }
        if (data['menu_documents']) {
            o['menuRows'] = [];
            for (const i of data['menu_documents']) {
                const menu = <IMenuDocument>{};
                menu['menuDoc'] = i['name'];
                menu['menuDocUrl'] = i['url'];
                o['menuRows'].push(menu);
            }
        }
        o['likeCount'] = data['like_count'];
        o['dislikeCount'] = data['dislike_count'];
        o['posId'] = data['pos_id'];
        o['deliveryChargesPaidBy'] = data['delivery_charge_paid_by'];
        o['isDeliveryChargesPaidByOutlet'] = data['delivery_charge_paid_by_restaurant'] ?? data['delivery_charge_paid_by_store'] ?? data['delivery_charge_paid_by_outlet'];
        o['minOrderValForFreeDeliveryByOutlet'] = data['min_order_value_for_restaurant_free_delivery'] || data['min_order_value_for_store_free_delivery'] || data['min_order_value_for_outlet_free_delivery'];
        o['branchName'] = data['branch_name'];
        o['posName'] = data['pos_name'];
        o['discountRate'] = data['discount_rate'];

        if (data['poc_list']) {
            for (const i of data['poc_list']) {
                const poc = <IPocList>{};
                poc['name'] = i['name'];
                poc['pocNumber'] = i['number']?.includes('+91') ? i['number']?.split('+91')[1] : i['number'];
                poc['isPrimary'] = i['is_primary'];
                poc['designation'] = i['designation'];
                o['pocList'].push(poc);
            }
        }
        o['speedyyAccountManagerId'] = data['speedyy_account_manager_id'];
        o['speedyyAccountManagerName'] = data['speedyy_account_manager_name'];
        if (data['parent_id']) o['parentId'] = data['parent_id'];
        o['parentOrChild'] = data['parent_or_child'];
        o['genuinePrice'] = data['genuine_price'];
        o['outletType'] = data['type'];
        o['primaryManagerId'] = data['primary_manager_id'];
        o['primaryManagerName'] = data['primary_manager_name'];
        o['hasSponsoredRider'] = data['has_sponsored_rider'];
        if(data['delivery_splitting']) o['deliverySplitting'] = DeliverySplitting.fromJson(data['delivery_splitting']);
        o['drugLicenseNumber'] = data['drug_license_number'];
        o['drugRetailDoc'] = data['drug_retail_document']?.['name'];
        o['drugRetailDocUrl'] = data['drug_retail_document']?.['url'];
        o['drugWholeSaleDoc'] = data['drug_wholesale_document']?.['name'];
        o['drugWholeSaleDocUrl'] = data['drug_wholesale_document']?.['url'];
        if(service === Services.Food)
        o['turnDebugModeOn'] = data['turn_debug_mode_on'];    
        o['packgingChargeSlabApplied'] = data['packging_charge_slab_applied'];
        if(service === Services.Grocery)
        o['agreedSpeedyyChargePercentage'] = data['agreed_speedyy_charge_percentage'];        
        return o;
    }

}

export class FilterOutlet {
    outletIdOrName: string;
    cityId: string;
    areaIds: string[] = [];
    status: string;
    pageIndex: number;
    pageSize: number;
    speedyyAccountManagerId: string;
    outletType: string;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {
            status: this.status ? [this.status] : ['active', 'disable']
        };
        if (this.outletIdOrName) data['search_text'] = this.outletIdOrName;
        if (this.cityId) data['filter']['city_id'] = [this.cityId];
        if (this.areaIds.length) data['filter']['area_id'] = this.areaIds;
        if (this.speedyyAccountManagerId)
            data['filter']['speedyy_account_manager_id'] = this.speedyyAccountManagerId;
        if (this.outletType !== null)
            data['filter']['type'] = this.outletType;
        return data;
    }
}

export interface IOutletImage {
    name: string;
    url?: string;
}

export interface IPackingChargesItemLevel {
    itemName: string;
    itemPrice: number;
    itemPackagingCharges: number;
    itemDoc: string;
    itemDocUrl?: string;
}

export type PackagingChargesTypes = 'item' | 'order' | 'none';

export const packagingChargesTypesList: { [key in PackagingChargesTypes]: string } = {
    item: 'Item Level',
    order: 'Cart/Order Level',
    none: 'None'
}

export type DeliveryChargesPaidBy = 'customer' | 'speedyy';

export interface IMenuDocument {
    menuDoc: string;
    menuDocUrl?: string;
}

export interface IPocList {
    name: string;
    pocNumber: number;
    isPrimary: string;
    designation: RestaurantPocDesignationTypes;
}
export type RestaurantPocDesignationTypes = 'owner' | 'customer_care' | 'manager';

export const RestaurantPocDesignation: { [key in RestaurantPocDesignationTypes]: string } = {
    owner: 'Owner',
    customer_care: 'Customer Care',
    manager: 'Manager'
}

export type OutletImageAction = 'EditPrimary' | 'AddAdditional' | 'EditAdditional' | 'DeleteAdditional';
