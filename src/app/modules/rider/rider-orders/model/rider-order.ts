import * as moment from "moment";
import { formatNum } from "src/app/shared/functions/modular.functions";


export class RiderOrder {
    orderId: number;
    clientId: string;
    clientOrderId: string;
    orderItems: IOrderItems[] = [];
    totalAmount: string;
    pickupLat: number;
    pickupLng: number;
    pickupContact: string;
    pickupAddress: string;
    pickupETA: number;
    dropLat: number;
    dropLng: number;
    dropContact: string;
    dropAddress: string;
    dropETA: number;
    deliveryCharges: string;
    deliveryStatus: string;
    allocationAttempts: number;
    riderId: string;
    riderShiftId: number;
    riderName: string;
    riderRating: number;
    riderReview: string;
    riderPayoutAmt: string;
    riderPayoutSettlementAmt: string;
    settledBy: string;
    settlementStatus: string;
    cancelledBy: string;
    cancellationReason: string;
    deliveryInstruction: string;
    takeDropOffPhoto: boolean;
    deliveryDistance: string;
    createdAt: string;
    takeDropOffPicture: boolean;
    dropName: string;
    pickupName: string;
    noFreeRiderAttempt: number;
    lastAssignedRiderId: string;
    pickupOperationalZoneId: number;
    pickupOperationalZoneName: string;
    orderItemDetails: IOrderItemDetails [] = [];
    orderLocation: IOrderLocations [] = [];

    static fromJson(data): RiderOrder {
        const r: RiderOrder = new RiderOrder();

        r['orderId'] = data['id'];
        r['clientId'] = data['client_id'];
        r['clientOrderId'] = data['client_order_id'];
        for (const i of data['details']['items']) {
            const item: IOrderItems = {} as IOrderItems;
            item['id'] = i['id'];
            item['name'] = i['name'];
            item['price'] = formatNum(i['price']);
            item['quantity'] = i['quantity'];
            r['orderItems'].push(item);
        }
        r['totalAmount'] = formatNum(data['details']['amount']);
        r['pickupLat'] = data['pickup_latitude'];
        r['pickupLng'] = data['pickup_longitude'];
        r['pickupContact'] = data['pickup_contact'];
        r['pickupAddress'] = data['pickup_address'];
        r['pickupETA'] = data['pickup_eta'];
        r['dropLat'] = data['pickup_eta'];
        r['dropLng'] = data['pickup_eta'];
        r['dropContact'] = data['drop_contact'];
        r['dropAddress'] = data['drop_address'];
        r['dropETA'] = data['drop_eta'];
        r['deliveryCharges'] = formatNum(data['delivery_charges']);
        r['allocationAttempts'] = data['allocation_attempt'];
        r['deliveryStatus'] = DeliveryStatusList[data['delivery_status']];
        r['riderId'] = data['rider_id'];
        r['riderName'] = data['rider_name'];
        r['riderShiftId'] = data['rider_shift_id'];
        r['riderRating'] = data['rating'];
        r['riderReview'] = data['review'];
        r['riderPayoutAmt'] = formatNum(data['rider_payout_amount']);
        r['riderPayoutSettlementAmt'] = formatNum(data['rider_payout_settlement_amount']);
        r['settledBy'] = data['settled_by'];
        r['settlementStatus'] = SettlementStatusList[data['settlement_status']];
        r['cancelledBy'] = data['cancelled_by'];
        r['cancellationReason'] = data['cancellation_reason'];
        r['deliveryInstruction'] = data['delivery_instruction'];
        r['takeDropOffPhoto'] = data['take_drop_off_picture'];
        r['deliveryDistance'] = data['distance_km'];
        r['createdAt'] = data['created_at'];
        r['takeDropOffPicture'] = data['take_drop_off_picture'];
        r['dropName'] = data['drop_name'];
        r['pickupName'] = data['pickup_name'];
        r['noFreeRiderAttempt'] = data['no_free_rider_attempt'];
        r['lastAssignedRiderId'] = data['last_assigned_rider_id'];
        r['pickupOperationalZoneId'] = data['pickup_operational_zone_id'];
        r['pickupOperationalZoneName'] = data['pickup_operational_zone_name'];
        for ( const i of data['order_items']) {
            const items: IOrderItemDetails = {} as IOrderItemDetails;
            items['id'] = i['id'];
            items['name'] = i['name'];
            items['pickupLocationId'] = i['pickup_location_id'];
            items['dropLocationId'] = i['drop_location_id'];
            items['externalId'] = i['external_id'];
            items['price'] = formatNum(i['price']);
            items['quantity'] = i['quantity'];
            items['isCreatedAt'] = i['is_created_at'];
            items['updatedAt'] = i['updated_at'];
            r['orderItemDetails'].push(items)
        }

        for ( const i of data['order_locations']) {
            const location: IOrderLocations = {} as IOrderLocations;

            location['id'] = i['id'];
            location['type'] = i['type'];
            location['contactName'] = i['contact_name'];
            location['contactNumber'] = i['contact_phone'];
            location['address'] = i['address'];
            location['lat'] = i['coordinates']['latitude'];
            location['long'] = i['coordinates']['longitude'];
            location['clientPodAmount'] = formatNum(i['client_pod_amount']);
            location['arrivalEta'] = i['arrival_eta'];            
            location['visitSequence'] = i['visit_sequence'];            
            location['deliveryCompletedAt'] = i['delivery_completed_at'];
            location['deliveryStatus'] = DeliveryStatusList[i['delivery_status']];
            location['podStatus'] = i['pod_status'];
            location['cancellationReason'] = i['cancellation_reason'];            
            r['orderLocation'].push(location);

        }
        return r;
    }
}

export class AllocationHistory {
    orderId: number;
    attempt: number;
    riderId: string;
    riderName: string;
    riderImage: string;
    riderImageUrl: string;
    riderContact: string;
    status: string;
    assignedAt: string;
    actionAt: string;
    riderSearchResult : RiderSearchResult[] = [];
    initialRiderToVendorEta: string;
    initialRiderFromVendorToCustomerEta: string;

    static fromJson(data): AllocationHistory {
        const a: AllocationHistory = new AllocationHistory();
        a['orderId'] = data['order_id'];
        a['attempt'] = data['attempt'];
        a['riderId'] = data['rider_id'];
        a['riderName'] = data['name'];
        a['riderContact'] = data['phone'];
        a['status'] = data['status'];
        a['assignedAt'] = data['assigned_at'];
        a['actionAt'] = data['action_at'];
        if (data['image']) {
            a['riderImage'] = data['image']['name'];
            a['riderImageUrl'] = data['image']['url'];
        }
        if(data['rider_search_result']){
            for(const i of data['rider_search_result']['riders_status']){
            a['riderSearchResult'].push(RiderSearchResult.fromJson(i));
            }
    }
    a['initialRiderToVendorEta'] = data['initial_rider_to_vendor_eta'];
    a['initialRiderFromVendorToCustomerEta'] = data['initial_rider_from_vendor_to_customer_eta'];
        return a;
    }
}

export class StatusHistory {
    orderId: number;
    orderDeliveryStatus: string;
    time: string;
    orderLocationDeliveryStatus: string;
    orderLocationId: string;

    static fromJson(data): StatusHistory {
        const s: StatusHistory = new StatusHistory();
        s['orderId'] = data['order_id'];
        s['orderDeliveryStatus'] = DeliveryStatusList[data['order_delivery_status']];
        s['time'] = data['created_at'];
        s['orderLocationDeliveryStatus'] = data['order_location_delivery_status'];
        s['orderLocationId'] = data['order_location_id'];
        return s;
    }
}

export class RiderManualAllocation {
    riderId: string;
    riderName: string;
    riderImage: string;
    riderImageUrl: string;
    riderPhone: string;
    riderType: string;
    riderDistance: string;
    long: string;
    lat: string;
    allocationHistory: AllocationHistory[] = [];

    static fromJson(data): RiderManualAllocation {
        const r: RiderManualAllocation = new RiderManualAllocation();

        r['riderId'] = data['id'];
        r['riderName'] = data['name'];
        r['riderPhone'] = data['phone'];
        r['riderType'] = data['type'];
        r['riderDistance'] = data['distance'];
        r['long'] = data['longitude'];
        r['lat'] = data['latitude'];
        if (data['image']) {
            r['riderImage'] = data['image']['name'];
            r['riderImageUrl'] = data['image']['url'];
        }
        for (const i of data['attempts']) {
            r['allocationHistory'].push(AllocationHistory.fromJson(i));
        }
        return r;
    }
}
export class FilterRiderOrder {
    orderId: string;
    clientId: string;
    riderId: string;
    payoutId: string;
    allocationAttempts: string;
    riderShiftId: string;
    deliveryStatus: string[] = [];
    cancelledBy: string[] = [];
    settlementStatus: string[] = [];
    startDate: Date;
    endDate: Date;
    pageIndex: number;
    pageSize: number;
    clientOrderId: string;
    manualAssignment: boolean;
    pickupOperationalZoneId: string;
    isSponsoredRider: boolean = false;

    toJson() {
        const data = {};
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['filter'] = {};
        if (this.orderId) data['filter']['order_ids'] = this.orderId.split(',');
        if (this.clientId) data['filter']['client_ids'] = this.clientId.split(',');
        if (this.riderId) data['filter']['rider_ids'] = this.riderId.split(',');
        if (this.riderShiftId) data['filter']['rider_shift_ids'] = this.riderShiftId.split(',');
        if (this.payoutId) data['filter']['payout_ids'] = [this.payoutId];
        if (this.allocationAttempts) data['filter']['allocation_attempt'] = this.allocationAttempts;
        if (this.deliveryStatus.length) data['filter']['delivery_status'] = this.deliveryStatus;
        if (this.settlementStatus.length) data['filter']['settlement_status'] = this.settlementStatus;
        if (this.cancelledBy.length) data['filter']['cancelled_by'] = this.cancelledBy;
        if (this.startDate) data['filter']['start_date'] = moment(this.startDate).format('YYYY-MM-DD');
        if (this.endDate) data['filter']['end_date'] = `${moment(this.endDate).format('YYYY-MM-DD')} 23:59:59`;
        if (this.clientOrderId) data['filter']['client_order_ids'] = this.clientOrderId.split(',');
        if (this.manualAssignment) data['filter']['manual_assignment'] = this.manualAssignment;
        if (this.pickupOperationalZoneId) data['filter']['pickup_operational_zone_id'] = this.pickupOperationalZoneId.split(',');
        if (this.isSponsoredRider !== null) data['filter']['is_sponsored'] = this.isSponsoredRider;
        return data;
    }
}

export class RiderSearchResult {
    riderId: string;
    riderName:string;
    status: string;
    distance: number;
    latitude: number;
    longitude: number;
    podAllowed: boolean;
    podCollection: number;

    static fromJson(data): RiderSearchResult {
        const r: RiderSearchResult = new RiderSearchResult();
        r['riderId'] = data['rider_id'];
        r['riderName'] = data['rider_name'];
        r['status'] = data['status'];
        r['distance'] = data['distance'];
        r['latitude'] = data['latitude'];
        r['longitude'] = data['longitude'];
        r['podAllowed'] = data['pod_allowed'];
        r['podCollection'] = data['pod_collection']
        return r;
    }
}

export interface IOrderItems {
    id: string;
    name: string;
    price: string;
    quantity: number;
}

export interface ISettleOrder {
    orderId: number;
    settlementAmt: number;
}

export interface IManualAllocationOrders {
    orderId: number;
    riderId: string;
}

export interface IRemoveRider {
    orderId: number;
    reason: string;
}

export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'ALLOTTED' | 'ARRIVED' | 'DISPATCHED' | 'ARRIVED_CUSTOMER_DOORSTEP' | 'DELIVERED' | 'CANCELLED';

export enum DeliveryStatusList {
    PENDING = 'Pending',
    ASSIGNED  = 'Assigned',
    ALLOTTED = 'Allotted',
    ARRIVED = 'Arrived',
    DISPATCHED = 'Dispatched',
    ARRIVED_CUSTOMER_DOORSTEP = 'Arrived at customer doorstep',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled',
}

export enum SettlementStatusList {
    pending = 'Pending',
    settled = 'Settled'
}

export enum CancelledByList {
    rider = 'Rider',
    client = 'Client',
    system = 'System'
}

export enum RiderOrderAction {
    Settle = 'Settle Order',
    ManualAssignment = 'Manual Allocation',
    RemoveRider = 'Remove Rider'
}

export interface IOrderItemDetails {
    id: number;
    name: string;
    isCreatedAt: string;
    pickupLocationId: number;
    dropLocationId: number;
    externalId: string;   
    price: string;
    quantity: number;
    updatedAt: string;
}

export interface IOrderLocations {
    id: number;
    type: string;
    contactName: string;
    contactNumber: string;
    address: string;
    lat: number;
    long: number;
    clientPodAmount: string;
    arrivalEta: number;
    visitSequence: number;
    deliveryStatus: string;
    deliveryCompletedAt: string;
    podStatus: string;
    cancellationReason: string;    
  }