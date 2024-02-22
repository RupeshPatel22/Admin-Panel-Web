import * as moment from "moment";
import { formatNum } from "src/app/shared/functions/modular.functions";

export class InquiryOrder {
    id: number;
    customerId: string;
    customerName: string;
    status: string;
    orderId: string;
    action: string;
    storeId: string;
    storeName: string;
    
    static fromJson(data): InquiryOrder {
      const o: InquiryOrder = new InquiryOrder();

      o['id'] = data['id'];
      o['orderId'] = data['order_id'];
      o['storeId'] = data['store_id'];
      o['storeName'] = data['store_name'];
      o['vendorId'] = data['vendor_id'];
      o['customerId'] = data['customer_id'];
      o['customerName'] = data['customer_name'];
      o['status'] = inquiryOrderStatusList[data['status']];
      o['createdAt'] = new Date(data['created_at']);
      
      return o;
    }
  }


  export class InquiryOrderDetails {
    id: number;
    customerId: string;
    customerName: string;
    status: string;
    vendorId: string;
    vendorResponseEndTime: Date;
    vendorRespondedAt: Date;
    customerResponseEndTime: Date;
    orderId: string;
    customerAddress: CustomerAddress;
    clientServiceType: string;
    anySpecialRequest: string;
    orderStatusLabel: string;
    invoiceDetails: Invoice;
    menuItems: IMenuItems[] = [];
    
    static fromJson(data): InquiryOrderDetails {
      const o: InquiryOrderDetails = new InquiryOrderDetails();

      o['id'] = data['id'];
      o['orderId'] = data['order_id'];
      o['storeId'] = data['store_id'];
      o['storeName'] = data['store_name'];
      o['vendorId'] = data['vendor_id'];
      o['customerId'] = data['customer_id'];
      o['customerName'] = data['customer_name'];
      o['vendorRespondedAt'] = data['vendor_responsed_at'];
      o['vendorResponseEndTime'] = data['vendor_response_end_time'];
      o['customerResponseEndTime'] = data['customer_response_end_time'];
      o['expireAt'] = data['expire_at'];
      o['status'] = inquiryOrderStatusList[data['status']];
      o['createdAt'] = new Date(data['created_at']);
      o['clientServiceType'] = data['client_service_type'];
      o['orderStatusLabel'] = data['order_status_label'];

      if (data['cart_details'] && data['cart_details']['customer_address']) {
        o['customerAddress'] = new CustomerAddress();
        const customerAddressData = data['cart_details']['customer_address'];
        o['customerAddress']['id'] = customerAddressData['id'];
        o['customerAddress']['name'] = customerAddressData['name'];
        o['customerAddress']['city'] = customerAddressData['city'];
        o['customerAddress']['state'] = customerAddressData['state'];
        o['customerAddress']['country'] = customerAddressData['country'];
        o['customerAddress']['pinCode'] = customerAddressData['pincode'];
        o['customerAddress']['houseFlatBlockNo'] = customerAddressData['house_flat_block_no'];
        o['customerAddress']['apartmentRoadArea'] = customerAddressData['apartment_road_area'];
      }
      o['invoiceDetails'] = Invoice.fromJson(data['cart_details']['invoice_breakout']);

      for (const m of data['menu_items']) {
        const menu: IMenuItems = {} as IMenuItems;
        menu['vendorStatus'] = vendorStatusList[m['vendor_status']];
        menu['customerStatus'] = m['customer_status'];
        menu['replacement'] = m['replacement'];
        menu['qty'] = m['quantity'];
        menu['menuItemName'] = m['menu_item_name'];
        menu['price'] = m['price'];
        o['menuItems'].push(menu);
      }
      
      
      return o;
    }
  }
  
  export class CustomerAddress {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    apartmentRoadArea: string;
    houseFlatBlockNo: string;
  }
  
  export class Invoice {
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
    platformCharges: string;
   
    static fromJson(data: any): Invoice {
      const i: Invoice = new Invoice();
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
      i['platformCharges'] = formatNum(data['speedyy_charge_for_customer']);
      return i;
    }
  }

export class FilterInquiryOrder {
    outletId: string;
    inquiryOrderIds: string;
    status: InquiryOrderStatus [] = []
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    pageIndex: number;
    pageSize: number;

    toJson() {
        const data = {};

        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize,
        };
        data['filter'] ={};
        if (this.outletId) data['filter']['store_id'] = this.outletId;

        if (this.inquiryOrderIds) data['filter']['inquiry_order_ids'] = this.inquiryOrderIds.split(',').map((id) => id.trim());

        if (this.status.length) {
            data['filter']['status'] = this.status;
        }
       
        if (this.startDate && this.endDate) {
            data['filter']['duration'] = {
              start_date: this.startTime ? moment(new Date(moment(this.startDate).format('YYYY-MM-DD') + ' ' + moment(this.startTime, 'h:mm A').format('HH:mm:ss'))).unix() : moment(this.startDate).unix(),
              end_date: this.endTime ? moment(new Date(moment(this.endDate).format('YYYY-MM-DD') + ' ' + moment(this.endTime, 'h:mm A').format('HH:mm:ss'))).unix() : moment(this.endDate.setHours(23, 59, 59)).unix(),
            };
          }

          return data;
    }
}
export type InquiryOrderStatus =
 | 'customer_created'
 | 'vendor_accepted'
 | 'vendor_rejected'
 | 'vendor_modified'
 | 'customer_confirmed'
 | 'placed';
export const inquiryOrderStatusList: { [key in InquiryOrderStatus]: string } = {
    customer_created: 'Customer Created',
    vendor_accepted: 'Vendor Accepted',
    vendor_rejected: 'Vendor Rejected',
    vendor_modified: 'Vendor Modified',
    customer_confirmed: 'Customer Confirmed',
    placed: 'Placed',

}

export interface IMenuItems {
  vendorStatus: string;
  customerStatus: string;
  replacement: [];
  qty: number;
  menuItemName: string;
  price: number;
}

export type IVendorStatus =
 | 'not_available'
 | 'available'
 | 'pending'
 | 'vendor_added'
export const vendorStatusList: { [key in IVendorStatus]: string } = {
    not_available: 'Not Available',
    available: 'Available',
    pending: 'Pending',
    vendor_added: 'Vendor Added',
}