import * as moment from 'moment';
import { formatNum } from 'src/app/shared/functions/modular.functions';
import { Services } from 'src/app/shared/models';

//class for order details
export class Order {
  orderId: number;
  anySpecialRequest: string;
  cancellationReason: any;
  cancellationTime: string;
  cancelledBy: string;
  couponId: string;
  createdAt: Date;
  timerEndTime: Date;
  orderMarkedReadyTime: Date;
  timeLeft: string;
  acceptanceTimeInMilliSecs: number = 600000;
  progressbarWidth: number;
  isTimerDanger: boolean = false;
  customerDetails: CustomerDetails;
  deliveryCharges: number;
  deliveryStatus: string;
  deliveryTime: number;
  deliveryTip: number;
  offerDiscount: number;
  orderAcceptanceStatus: string;
  orderItems: OrderItem[] = [];
  orderRating: number;
  orderStatus: string;
  refundStatus: string;
  // orderItemTotalPrice: number = 0;
  packagingCharge: number;
  updatedAt: string;
  pickupETA: string;
  dropETA: string;
  riderName: string;
  riderContact: string;
  vendorAcceptedTime: Date;
  preparationTimerEndTime: Date;
  preparationTimeInMilliSecs: number;
  preparationTimeLeft: string;
  outletId: string;
  outletName: string;
  couponDetails: CouponDetails;
  orderReviewComments: string;
  orderReviewedTime: string;
  orderPickedupTime: Date;
  orderPlacedTime: Date;
  orderDeliveredTime: Date;
  refundDetails: RefundDetails;
  pickupDetails: PickupDetails = new PickupDetails();
  dropDetails: DropDetails = new DropDetails();
  invoiceDetails: Invoice;
  paymentDetails: PaymentDetails;
  riderId: string;
  preparationTime: string;
  payoutId: string;
  deliveryService: string;
  defaultPreparationTime: string;
  orderPlacedEtaEpoch: string;
  riderToVendorEta: string;
  riderFromVendorToCustomerEta: string;
  vendorPreparationTime: string;
  vendorEpoch: string;
  vendorAcceptedRiderToVendorEta: string;
  vendorAcceptedRiderFromVendorToCustomerEta: string;
  outletType: string;
  clientServiceType: string;
  cancelledByName: string;
  totalOrderDuration: number;
  riderOrderStatus: string;
  deliveryOrderStatusHistory: DeliveryOrderStatusHistory[] = [];
  deliveryPartnerAllocationHistory: DeliveryPartnerAllocationHistory;
  deliveryEtaMinsWhenOrderWasPlaced: string;
  deliveryEtaMinsWhenOrderWasAcceptedByVendor: string;
  categoryName: string;
  categoryId: string;
  isSponsoredRider: boolean;
  adminInvoice: AdminInvoice = new AdminInvoice();
  pndOrderItems: IOrderItemsDetails [] = [];
  pndOrderLocation: IOrderLocations [] = [];

  static fromJson(data): Order {
    const o: Order = new Order();

    o['anySpecialRequest'] = data['any_special_request'];
    o['cancellationReason'] =
      data['cancellation_details']?.['cancellation_reason'];
    o['cancellationTime'] = data['cancellation_time'];
    o['cancelledBy'] = data['cancelled_by'];
    o['cancelledByName'] = data['cancelled_by_name'];
    o['couponId'] = data['coupon_id'];
    o['createdAt'] = new Date(data['created_at']);
    if (data['vendor_accepted_end_time']) {
      o['timerEndTime'] = new Date(data['vendor_accepted_end_time']);
    }
    if (data['vendor_ready_marked_time']) {
      o['orderMarkedReadyTime'] = new Date(data['vendor_ready_marked_time']);
    }
    o['preparationTimeInMilliSecs'] = data['preparation_time'] * 60000; //converting mins to milli secs
    if (data['vendor_accepted_time']) {
      o['vendorAcceptedTime'] = new Date(data['vendor_accepted_time']);
      o['preparationTimerEndTime'] = new Date(
        o['vendorAcceptedTime'].getTime() + o['preparationTimeInMilliSecs']
      );
    }
    if (data['order_placed_time']) {
      o['orderPlacedTime'] = new Date(data['order_placed_time']);
    }
    if (data['order_pickedup_time']) {
      o['orderPickedupTime'] = new Date(data['order_pickedup_time']);
    }
    if (data['order_delivered_at']) {
      o['orderDeliveredTime'] = new Date(data['order_delivered_at']);
    }


    // For Pickup & Drop Service
    if (data['customer_details']) {
      o['customerDetails'] = new CustomerDetails();
      o['customerDetails']['name'] = data['customer_details']['full_name'];
      o['customerDetails']['id'] = data['customer_details']['id'];
      o['customerDetails']['email'] = data['customer_details']['email'];
      o['customerDetails']['phone'] = data['customer_details']['phone'];
      o['customerDetails']['alternatePhone'] =
        data['customer_details']['alternate_phone'];
    }
    o['pickupDetails']['name'] = data['pickup_name'];
    o['pickupDetails']['contact'] = data['pickup_contact'];
    o['pickupDetails']['address'] = data['pickup_address'];
    o['pickupDetails']['city'] = data['pickup_city'];
    o['pickupDetails']['lat'] = data['pickup_lat'];
    o['pickupDetails']['long'] = data['pickup_long'];
    o['pickupDetails']['eta'] = data['pickup_eta'];

    o['dropDetails']['name'] = data['drop_name'];
    o['dropDetails']['contact'] = data['drop_contact'];
    o['dropDetails']['address'] = data['drop_address'];
    o['dropDetails']['city'] = data['drop_city'];
    o['dropDetails']['lat'] = data['drop_lat'];
    o['dropDetails']['long'] = data['drop_long'];
    o['dropDetails']['eta'] = data['drop_eta'];

    // End
    if (data['customer_address']) {
      o['customerDetails'] = CustomerDetails.fromJson(data['customer_address']);
    }
    o['deliveryCharges'] = data['delivery_charges'];
    o['deliveryStatus'] = deliveryStatusesList[data['delivery_status']];
    o['deliveryTime'] = data['order_delivered_at'];
    o['deliveryTip'] = data['delivery_tip'];
    o['offerDiscount'] = data['offer_discount'];
    o['orderAcceptanceStatus'] =
      orderAcceptanceStatusesList[data['order_acceptance_status']];
    o['orderId'] = data['order_id'];
    o['orderRating'] = data['order_rating'];
    o['orderStatus'] = orderStatusesList[data['order_status']];
    o['refundStatus'] = refundStatusesList[data['refund_status']];
    o['payoutId'] = data['payout_transaction_id'];
    o['packagingCharge'] = data['packing_charges'];
    o['updatedAt'] = data['updated_at'];
    o['pickupETA'] = `${data['pickup_eta']}${'mins'}`;
    o['dropETA'] = `${data['drop_eta']}${'mins'}`;
    o['riderName'] = data['delivery_details']?.['rider_name'];
    o['riderContact'] = data['delivery_details']?.['rider_contact'];
    o['outletId'] = data['restaurant_id'] || data['store_id'] || data['outlet_id'];
    o['outletName'] =
      data['restaurant_details']?.['restaurant_name'] ||
      data['store_details']?.['store_name'] ||
      data['outlet_details']?.['outlet_name'];
    o['outletType'] = outletTypeList[data['restaurant_details']?.['type']];
    o['orderReviewComments'] = data['comments'];
    o['orderReviewedTime'] = data['reviewed_at'];
    o['riderId'] = data['delivery_details']?.['rider_id'];
    o['preparationTime'] = data['preparation_time'];
    o['deliveryService'] = data['delivery_details']?.['delivery_service'];

    if (data['delivery_details']) {
      if (data['delivery_details']['eta_when_order_placed']) {
        o['defaultPreparationTime'] = `${data['delivery_details']['eta_when_order_placed']['default_preparation_time']} ${'mins'}`;
        o['orderPlacedEtaEpoch'] = moment.unix(data['delivery_details']['eta_when_order_placed']['epoch'] / 1000).format('DD/MM/YYYY hh:mm:ss A');
        o['riderToVendorEta'] = `${data['delivery_details']['eta_when_order_placed']['rider_to_vendor_eta']} ${'mins'}`;
        o['riderFromVendorToCustomerEta'] = `${data['delivery_details']['eta_when_order_placed']['rider_from_vendor_to_customer_eta']} ${'mins'}`;
      }
      if (data['delivery_details']['eta_when_vendor_accepted']) {
        o['vendorPreparationTime'] = `${data['delivery_details']['eta_when_vendor_accepted']['preparation_time']} ${'mins'}`;
        o['vendorEpoch'] = moment.unix(data['delivery_details']['eta_when_vendor_accepted']['epoch'] / 1000).format('DD/MM/YYYY hh:mm:ss A');
        o['vendorAcceptedRiderToVendorEta'] = `${data['delivery_details']['eta_when_vendor_accepted']['rider_to_vendor_eta']} ${'mins'}`;
        o['vendorAcceptedRiderFromVendorToCustomerEta'] = `${data['delivery_details']['eta_when_vendor_accepted']['rider_from_vendor_to_customer_eta']} ${'mins'}`;
      }
    }
    if (data['delivery_order_status_history']) {
      for (const i of data['delivery_order_status_history']) {
        o['deliveryOrderStatusHistory'].push(DeliveryOrderStatusHistory.fromJson(i));
      }
    }
    if (data['delivery_partner_allocation_history']) {
      o['deliveryPartnerAllocationHistory'] = DeliveryPartnerAllocationHistory.fromJson(data['delivery_partner_allocation_history']);
    }

    if (data['invoice_breakout']['coupon_details']) {
      o['couponDetails'] = CouponDetails.fromJson(
        data['invoice_breakout']['coupon_details']
      );
    }
    if (data['invoice_breakout']['refund_settlement_details']) {
      o['refundDetails'] = RefundDetails.fromJson(
        data['invoice_breakout']['refund_settlement_details']
      );
    }
    o['invoiceDetails'] = Invoice.fromJson(data['invoice_breakout']);
    if (data['payment_details'])
      o['paymentDetails'] = PaymentDetails.fromJson(data['payment_details'][0]);
    let service = sessionStorage.getItem("service");
    if ( service !== 'pnd') {
      data['order_items']?.forEach((oi, index) => {
        const orderItem: OrderItem = new OrderItem();
        orderItem['orderItemId'] = oi['order_item_id'];
        orderItem['orderItemName'] = oi['name'];
        orderItem['orderItemPackagingCharges'] = oi['packing_charges'];
        orderItem['orderItemPrice'] = oi['price'];
        orderItem['orderItemQuantity'] = oi['quantity'];
        orderItem['orderItemFoodType'] = oi['veg_egg_non'];
  
        // if sequence key exists in menuItems array then we'll get miIndex > 0 and will take item cost from menuItems of that index,
        // otherwise we'll use current order_items's 'index' as 'miIndex' to take item cost from menuItems array
        const menuItems: any[] = data['invoice_breakout']['menu_items'];
        let miIndex = menuItems.findIndex(mi => mi.sequence && mi.sequence === oi.sequence);
        if (miIndex < 0) {
          miIndex = index;
        }
        orderItem['orderItemFinalPrice'] = 'total_individual_food_item_cost' in menuItems[miIndex] ? formatNum(menuItems[miIndex]['total_individual_food_item_cost']) : formatNum(menuItems[miIndex]['total_individual_item_cost']);
  
        if (oi['variant_groups']) {
          oi['variant_groups'].forEach((vg) => {
            vg['variants'].forEach((variant) => {
              const orderVariant: OrderVariant = new OrderVariant();
              orderVariant['orderVariantGroupId'] = vg['variant_group_id'];
              orderVariant['orderVariantGroupName'] = vg['variant_group_name'];
              orderVariant['orderVariantId'] = variant['variant_id'];
              orderVariant['orderVariantName'] = variant['variant_name'];
              orderVariant['orderVariantPrice'] = variant['price'];
              orderVariant['orderVariantFoodType'] = variant['veg_egg_non'];
              // orderItem['orderItemFinalPrice'] = orderItem['orderItemFinalPrice'] + orderVariant['orderVariantPrice'];
              orderItem['orderVariants'].push(orderVariant);
            });
          });
        }
        if (oi['addon_groups']) {
          oi['addon_groups'].forEach((ag) => {
            ag['addons'].forEach((addon) => {
              const orderAddon: OrderAddOn = new OrderAddOn();
              orderAddon['orderAddonGroupId'] = ag['addon_group_id'];
              orderAddon['orderAddonGroupName'] = ag['addon_group_name'];
              orderAddon['orderAddonId'] = addon['addon_id'];
              orderAddon['orderAddonName'] = addon['addon_name'];
              orderAddon['orderAddonPrice'] = addon['price'];
              orderAddon['orderAddonFoodType'] = addon['veg_egg_non'];
              // orderItem['orderItemFinalPrice'] = orderItem['orderItemFinalPrice'] + orderAddon['orderAddonPrice'];
              orderItem['orderAddons'].push(orderAddon);
            });
          });
        }
        // o['orderItemTotalPrice'] = o['orderItemTotalPrice'] + orderItem['orderItemFinalPrice'];
        o['orderItems'].push(orderItem);
      });
    }
    o['clientServiceType'] = clientServiceTypeList[data['client_service_type']];
    if (data['order_status'] as OrderStatus === 'completed') {
      o['totalOrderDuration'] = Math.floor(
        (new Date(data['order_delivered_at']).getTime() - new Date(data['order_placed_time']).getTime()) / 60000);
    }
    else if (data['order_status'] as OrderStatus === 'cancelled') {
      o['totalOrderDuration'] = Math.floor(
        (new Date(data['cancellation_time']).getTime() - new Date(data['order_placed_time']).getTime()) / 60000);
    }
    else if (data['order_status'] as OrderStatus === 'placed') {
      o['totalOrderDuration'] = Math.floor(
        (new Date().getTime() - new Date(data['order_placed_time']).getTime()) / 60000); // 1 minute = 60000 milliseconds
    }
    o['deliveryEtaMinsWhenOrderWasPlaced'] = `${data['delivery_eta_mins_when_order_was_placed']} ${'mins'}`;
    o['deliveryEtaMinsWhenOrderWasAcceptedByVendor'] = `${data['delivery_eta_mins_when_order_was_accepted_by_vendor']} ${'mins'}`;
    o['categoryName'] = data['category_name'];
    o['categoryId'] = data['category_id'];
    o['isSponsoredRider'] = data['is_sponsored_rider'];

    //Invoice Breakout
    const adminInv = data['display_invoice_breakout']['admin_invoice']
    if(adminInv){
      if(adminInv['payable_amount_line_items']) {
        for(const i of adminInv['payable_amount_line_items']) {
          o['adminInvoice']['payableAmountLineItem'].push(DisplayInvoiceBreakout.fromJson(i));
        }
      }
      if(adminInv['total_payable_amount']) {
        o['adminInvoice']['totalPayableAmount'] = DisplayInvoiceBreakout.fromJson(adminInv['total_payable_amount']);
      }
      if(adminInv['customer_section']) {
        if(adminInv['customer_section']['payable_amount_line_items']) {
          for(const i of adminInv['customer_section']['payable_amount_line_items']){
            o['adminInvoice']['customerInvoiceSection']['payableAmountLineItem'].push(DisplayInvoiceBreakout.fromJson(i));
          }
        }
        if(adminInv['customer_section']['total_payable_amount']) {
          o['adminInvoice']['customerInvoiceSection']['totalPayableAmount'] = DisplayInvoiceBreakout.fromJson(adminInv['customer_section']['total_payable_amount']);
        }
      }
      if(adminInv['vendor_section']) {
        if(adminInv['vendor_section']['payout_amount_line_items']) {
          for(const i of adminInv['vendor_section']['payout_amount_line_items']) {
            o['adminInvoice']['vendorInvoiceSection']['payoutAmoutLineItem'].push(DisplayInvoiceBreakout.fromJson(i));
          }
        }
        if(adminInv['vendor_section']['total_payout_amount']) {
          o['adminInvoice']['vendorInvoiceSection']['totalPayoutAmount'] = DisplayInvoiceBreakout.fromJson(adminInv['vendor_section']['total_payout_amount']);
        }
      }
    }
    o['isSponsoredRider'] = data['is_sponsored_rider'];

    if ( service === 'pnd') {
      for ( const i of data['order_items']) {
        const items: IOrderItemsDetails = {}as IOrderItemsDetails;
      items['id'] = i['id'];
      items['externalId'] = i['external_id'];
      items['name'] = i['name'];
      items['pickupLocationId'] = i['pickup_location_id'];
      items['dropLocationId'] = i['drop_location_id'];
      items['price'] = i['price'];
      items['quantity'] = i['quantity'];
      items['categoryId'] = i['category_id'];
      items['customCategoryName'] = i['custom_category_name'];
      o['pndOrderItems'].push(items);
      }

      for (const i of data['order_locations']) {
        const location: IOrderLocations = {} as IOrderLocations;

        location['id'] = i['id'];
        location['contactName'] = i['contact_name'];
        location['contactNumber'] = i['contact_phone'];
        location['address'] = i['address'];
        location['arrivalEta'] = i['arrival_eta'];
        location['merchantPodAmount'] = formatNum(i['merchant_pod_amount']);
        location['visitSequence'] = i['visit_sequence'];
        location['type'] = i['type'];
        location['deliveryStatus'] = i['delivery_status'];
        location['cancellationReason'] = i['cancellation_reason'];
        location['podStatus'] = i['pod_status'];
        location['lat'] = i['coordinates']['latitude'];
        location['long'] = i['coordinates']['longitude'];
        if (['delivery_completed_at']) {
          location['orderDeliveryCompletedAt'] = i['delivery_completed_at'];
        }
        o['pndOrderLocation'].push(location);
      }
    }
    return o;
  }
}

//class for customer details
export class CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  addressId: string;
  directions: string;
  lat: string;
  long: string;

  static fromJson(data: any): CustomerDetails {
    const c: CustomerDetails = new CustomerDetails();
    c['id'] = data['customer_id'];
    c['name'] = data['customer_name'];
    c['phone'] = data['phone'];
    c['alternatePhone'] = data['alternate_phone'];
    c['addressLine1'] = data['house_flat_block_no'];
    c['addressLine2'] = data['apartment_road_area'];
    c['city'] = data['city'];
    c['state'] = data['state'];
    c['country'] = data['country'];
    c['pinCode'] = data['pincode'];
    c['addressId'] = data['id'];
    c['directions'] = data['directions'];
    c['lat'] = data['latitude'];
    c['long'] = data['longitude'];
    return c;
  }
}

export class DeliveryOrderStatusHistory {
  deliveryOrderId: string;
  status: string;
  time: string;
  deliveryRiderId: string;

  static fromJson(data: any): DeliveryOrderStatusHistory {
    const d: DeliveryOrderStatusHistory = new DeliveryOrderStatusHistory();
    d['deliveryOrderId'] = data['order_id']
    d['status'] = DeliveryStatusList[data['status']];
    d['time'] = data['created_at'];
    d['deliveryRiderId'] = data['rider_id'];
    return d;
  }

}

export enum DeliveryStatusList {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  ALLOTTED = 'Allotted',
  ARRIVED = 'Arrived',
  DISPATCHED = 'Dispatched',
  ARRIVED_CUSTOMER_DOORSTEP = 'Arrived at customer doorstep',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export class DeliveryPartnerAllocationHistory {
  orderId: number;
  attempt: number;
  riderId: string;
  riderName: string;
  riderContact: string;
  status: string;
  assignedAt: string;
  actionAt: string;
  pickupLat: number;
  pickupLong: number;
  manualAssignedAdminId: string;
  manualAssignedAdminName: string;
  riderSearchResult: RiderSearchResult[] = [];

  static fromJson(data): DeliveryPartnerAllocationHistory {
    const a: DeliveryPartnerAllocationHistory = new DeliveryPartnerAllocationHistory();
    a['orderId'] = data['order_id'];
    a['attempt'] = data['attempt'];
    a['riderId'] = data['rider_id'];
    a['riderName'] = data['name'];
    a['riderContact'] = data['phone'];
    a['status'] = data['status'];
    a['assignedAt'] = data['assigned_at'];
    a['actionAt'] = data['action_at'];
    a['pickupLat'] = data['pickup_latitude'];
    a['pickupLong'] = data['pickup_longitude'];
    a['manualAssignedAdminId'] = data['manual_assigned_admin_id'];
    data['manual_assigned_admin_name'] ? a['manualAssignedAdminName'] = data['manual_assigned_admin_name'] : a['manualAssignedAdminName'] = 'N/A';

    if (data['rider_search_result']) {
      for (const i of data['rider_search_result']['riders_status']) {
        a['riderSearchResult'].push(RiderSearchResult.fromJson(i));
      }
    }
    return a;
  }
}

export class RiderSearchResult {
  riderId: string;
  riderName: string;
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

export class CouponDetails {
  couponId: number;
  couponCode: string;
  discountAmount: string;
  discountPercentage: number;
  speedyyDiscountShareAmount: string;
  speedyyDiscountSharePercentage: number;
  vendorDiscountShareAmount: string;
  vendorDiscountSharePercentage: number;
  discountLevel: string;
  discountType: string;
  maxDiscountAmount: string;
  minOrderValue: number;

  static fromJson(data: any): CouponDetails {
    const c: CouponDetails = new CouponDetails();
    c['couponId'] = data['coupon_id'];
    c['couponCode'] = data['code'];
    c['discountAmount'] = formatNum(data['discount_amount_applied']);
    c['discountPercentage'] = data['discount_percentage'];
    c['speedyyDiscountShareAmount'] = formatNum(
      data['discount_share_amount_speedyy']
    );
    c['speedyyDiscountSharePercentage'] =
      data['discount_share_percentage_speedyy'];
    c['vendorDiscountShareAmount'] = formatNum(
      data['discount_share_amount_vendor']
    );
    c['vendorDiscountSharePercentage'] =
      data['discount_share_percentage_vendor'];
    c['discountLevel'] = data['level'];
    c['discountType'] = data['type'];
    c['maxDiscountAmount'] = formatNum(data['max_discount_rupees']);
    c['minOrderValue'] = data['min_order_value_rupees'];
    return c;
  }
}

export class RefundDetails {
  vendorPayoutAmount: string;
  deliveryPartnerAmount: string;
  customerRefundableAmount: string;
  remarksForVendor: string;
  remarksForDeliveryPartner: string;
  remarksForCustomer: string;
  refundSettledBy: string;
  refundSettledByName: string

  static fromJson(data: any): RefundDetails {
    const r: RefundDetails = new RefundDetails();
    r['vendorPayoutAmount'] = formatNum(
      data['refund_settled_vendor_payout_amount']
    );
    r['deliveryPartnerAmount'] = formatNum(
      data['refund_settled_delivery_charges']
    );
    r['customerRefundableAmount'] = formatNum(
      data['refund_settled_customer_amount']
    );
    r['remarksForVendor'] = data['refund_settlement_note_to_vendor'];
    r['remarksForDeliveryPartner'] =
      data['refund_settlement_note_to_delivery_partner'];
    r['remarksForCustomer'] = data['refund_settlement_note_to_customer'];
    r['refundSettledBy'] = data['refund_settled_by'];
    r['refundSettledByName'] = data['refund_settled_by_name'];
    return r;
  }
}

export class Invoice {
  version: string;
  totalCustomerPayable: string;
  totalItemCost: string;
  totalPackingCharges: string;
  totalTax: string;
  txnCharges: string;
  txnChargesRate: number;
  deliveryCharges: string;
  deliveryChargesPaidBy: string;
  vendorPayoutAmount: string;
  speedyyCharges: string;
  transactionChargesPaidBy: string;

  // for food service
  isSpeedyyChargesApplied: boolean;
  totalSpeedyyCharges: string; //amount + taxes
  speedyyChargesForCustomer: string; // Currently only for PAAN

  static fromJson(data: any): Invoice {
    const i: Invoice = new Invoice();
    i['version'] = data['description']['version'];
    i['totalCustomerPayable'] = formatNum(data['total_customer_payable']);
    i['totalItemCost'] = 'total_food_cost' in data ? formatNum(data['total_food_cost']) : formatNum(data['total_cost']);
    i['totalPackingCharges'] = formatNum(data['total_packing_charges']);
    i['totalTax'] = formatNum(data['total_tax']);
    i['txnCharges'] = formatNum(data['transaction_charges']);
    i['txnChargesRate'] = data['transaction_charges_rate'];
    i['deliveryCharges'] = formatNum(data['delivery_charges']);
    i['deliveryChargesPaidBy'] = data['delivery_charge_paid_by'];
    i['vendorPayoutAmount'] = formatNum(data['vendor_payout_amount']);
    i['transactionChargesPaidBy'] = data['transaction_charges_paid_by'];
    // for pickup & drop service
    i['speedyyCharges'] = formatNum(data['speedyy_charges']);
    i['isSpeedyyChargesApplied'] = data['speedyy_charge_applied'];
    if (data['speedyy_charge_applied']) i['totalSpeedyyCharges'] = formatNum(data['speedyy_charge_amount_with_tax']);
    i['speedyyChargesForCustomer'] = formatNum(data['speedyy_charge_for_customer']);
    return i;
  }
}

export class DisplayInvoiceBreakout {
  amount: string;
  amountColor: string;
  breakoutDetails: [];
  breakoutLabel: string;
  displayLabel: string;
  displayLabelColor: string;
  isStrikethrough: boolean;

  static fromJson(data: any) : DisplayInvoiceBreakout {
    const i: DisplayInvoiceBreakout = new DisplayInvoiceBreakout();
    i['amount'] = data['amount'];
    i['amountColor'] = data['amount_color'];
    i['displayLabel'] = data['display_label'];
    i['displayLabelColor'] = data['display_label_color'];
    i['isStrikethrough'] = data['is_strikethrough'];
    return i;
  }
}

export class AdminInvoice {
  payableAmountLineItem: DisplayInvoiceBreakout[] = [];
  totalPayableAmount: DisplayInvoiceBreakout = new DisplayInvoiceBreakout();
  customerInvoiceSection: CustomerInvoiceSection = new CustomerInvoiceSection();
  vendorInvoiceSection: VendorInvoiceSection = new VendorInvoiceSection();
}

export class CustomerInvoiceSection {
  payableAmountLineItem: DisplayInvoiceBreakout[] = [];
  totalPayableAmount: DisplayInvoiceBreakout = new DisplayInvoiceBreakout();
}

export class VendorInvoiceSection {
  payoutAmoutLineItem: DisplayInvoiceBreakout[] = [];
  totalPayoutAmount: DisplayInvoiceBreakout = new DisplayInvoiceBreakout();
}

export class PaymentDetails {
  paymentId: string;
  paymentGateway: string;
  paymentMethod: string;
  paymentStatus: string;
  isPod: boolean;
  txnId: string;
  txnTime: string;
  txnAmount: string;

  static fromJson(data: any): PaymentDetails {
    const p: PaymentDetails = new PaymentDetails();

    p['paymentId'] = data['payment_id'];
    p['paymentGateway'] = data['payment_gateway'];
    p['paymentMethod'] = data['payment_method'];
    p['paymentStatus'] = data['payment_status'];
    p['isPod'] = data['is_pod'];
    p['txnId'] = data['transaction_id'];
    p['txnTime'] = data['transaction_time'];
    p['txnAmount'] = formatNum(data['amount_paid_by_customer']);
    return p;
  }
}

//class for order item details
export class OrderItem {
  orderItemId: number;
  orderItemName: string;
  orderItemPackagingCharges: number;
  orderItemPrice: number;
  orderItemFinalPrice: string;
  orderItemQuantity: number;
  orderItemFoodType: string;
  orderVariants: OrderVariant[] = [];
  orderAddons: OrderAddOn[] = [];
}

//class for order variant details
export class OrderVariant {
  orderVariantGroupId: number;
  orderVariantGroupName: string;
  orderVariantId: number;
  orderVariantName: string;
  orderVariantPrice: number;
  orderVariantFoodType: string;
}

//class for order add on details
export class OrderAddOn {
  orderAddonGroupId: number;
  orderAddonGroupName: string;
  orderAddonId: number;
  orderAddonName: string;
  orderAddonPrice: number;
  orderAddonFoodType: string;
}

export class PickupDetails {
  name: string;
  contact: string;
  address: string;
  city: string;
  lat: number;
  long: number;
  eta: number;
}

export class DropDetails {
  name: string;
  contact: string;
  address: string;
  city: string;
  lat: number;
  long: number;
  eta: number;
}

export class FilterOrder {
  orderId: string;
  outletId: string;
  orderAcceptanceStatus: OrderAcceptanceStatus[] = [];
  deliveryStatus: DeliveryStatus[] = [];
  orderStatus: OrderStatus[] = ['placed', 'cancelled', 'completed'];
  refundStatus: RefundStatus[] = [];
  payoutId: string;
  paymentId: string;
  customerEmail: string;
  customerPhone: string;
  startDate: Date;
  endDate: Date;
  pageIndex: number;
  pageSize: number;
  startTime: string;
  endTime: string;
  outletType: string;
  clientServiceType: ClientServiceType[] = [];
  toJson(service: string) {
    const data = {};

    data['pagination'] = {
      page_index: this.pageIndex,
      page_size: this.pageSize,
    };
    if (this.orderId) data['search_text'] = this.orderId;
    data['filter'] = {};
    if (this.outletId) {
      if (service === Services.Food) {
        data['filter']['restaurant_id'] = this.outletId;
      } else if (service === Services.Grocery) {
        data['filter']['store_id'] = this.outletId;
      }else if (service === Services.Paan || service === Services.Flower || service === Services.Pharmacy || service === Services.Pet) {
        data['filter']['outlet_id'] = this.outletId;
      }
    }
    if (this.orderStatus.length)
      data['filter']['order_status'] = this.orderStatus;
    if (this.refundStatus.length)
      data['filter']['refund_status'] = this.refundStatus;
    if (this.orderAcceptanceStatus.length)
      data['filter']['order_acceptance_status'] = this.orderAcceptanceStatus;
    if (this.deliveryStatus.length)
      data['filter']['delivery_status'] = this.deliveryStatus;
    if (this.payoutId)
      data['filter']['payout_transaction_id'] = [this.payoutId];
    if (this.paymentId) data['filter']['payment_id'] = [this.paymentId];
    if (this.customerEmail)
      data['filter']['customer_email'] = [this.customerEmail];
    if (this.customerPhone)
      data['filter']['customer_phone'] = [`+91${this.customerPhone}`];

    if (this.startDate && this.endDate) {
      data['filter']['duration'] = {
        start_date: this.startTime ? moment(new Date(moment(this.startDate).format('YYYY-MM-DD') + ' ' + moment(this.startTime, 'h:mm A').format('HH:mm:ss'))).unix() : moment(this.startDate).unix(),
        end_date: this.endTime ? moment(new Date(moment(this.endDate).format('YYYY-MM-DD') + ' ' + moment(this.endTime, 'h:mm A').format('HH:mm:ss'))).unix() : moment(this.endDate.setHours(23, 59, 59)).unix(),
      };
    }
    if (this.outletType !== null)
      data['filter']['restaurant_type'] = this.outletType;
    if (this.clientServiceType.length) {
      data['filter']['client_service_type'] = this.clientServiceType;
    }

    return data;
  }
}

export enum OrderAction {
  CancelOrder = 'Cancel Order',
  SettleRefund = 'Settle Refund',
  MarkForRefund = 'Mark For Refund',
}

export type OrderAcceptanceStatus = 'pending' | 'accepted' | 'rejected';
export type DeliveryStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'allocated'
  | 'arrived'
  | 'dispatched'
  | 'arrived_customer_doorstep'
  | 'delivered'
  | 'cancelled'
  | 'cancelled_by_customer'
  | 'returned_to_seller'
  | 'failed_to_cancel';
export type OrderStatus = 'pending' | 'placed' | 'completed' | 'cancelled';
export type RefundStatus =
  | 'approval_pending'
  | 'cancelled'
  | 'onhold'
  | 'pending'
  | 'success';

export const orderAcceptanceStatusesList: {
  [key in OrderAcceptanceStatus]: string;
} = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const deliveryStatusesList: { [key in DeliveryStatus]: string } = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  allocated: 'Allocated',
  arrived: 'Arrived',
  dispatched: 'Dispatched',
  arrived_customer_doorstep: 'Arrived at customer doorstep',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  cancelled_by_customer: 'Cancelled by customer',
  returned_to_seller: 'Returned to Seller',
  failed_to_cancel: 'Failed to cancel',
};

export const orderStatusesList: { [key in OrderStatus]: string } = {
  pending: 'Pending',
  placed: 'Placed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const refundStatusesList: { [key in RefundStatus]: string } = {
  approval_pending: 'Approval Pending',
  pending: 'Pending',
  success: 'Success',
  onhold: 'On Hold',
  cancelled: 'Cancelled',
};
export type ClientServiceType = 'food' | 'tea_and_coffee' | 'bakery';
export const clientServiceTypeList: { [key in ClientServiceType]: string } = {
  food: 'Food',
  tea_and_coffee: 'Tea & Coffee',
  bakery: 'Bakery',
};
export type OutletType = 'restaurant' | 'tea_and_coffee' | 'bakery';
export const outletTypeList: { [key in OutletType]: string } = {
  restaurant: 'Restaurant',
  tea_and_coffee: 'Tea & Coffee',
  bakery: 'Bakery',
};

export interface IOrderItemsDetails {
  id: number;
  externalId: string;
  name: string;
  pickupLocationId: number;
  dropLocationId: number;
  price: number;
  quantity: number;
  categoryId: string;
  customCategoryName: string;
}

export interface IOrderLocations {
  id: number;
  merchantPodAmount: string;
  contactName: string;
  contactNumber: string;
  address: string;
  arrivalEta: number;
  visitSequence: number;
  type: string;
  deliveryStatus: string;
  cancellationReason: string;
  podStatus: string;
  orderDeliveryCompletedAt: Date;
  lat: number;
  long: number;
}