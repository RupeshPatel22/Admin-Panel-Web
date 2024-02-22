import * as moment from "moment";

export class AllOrders {
    orderId: String;
    customerName: string;
    customerId: string;
    orderPlacedAt: Date;
    clientServiceType: ClientServiceType;
    orderStatus: string;
    deliveryStatus: string;
    orderAcceptanceStatus: string;
    paymentStatus: string;
    outletName: string;
    outletId: string;
    refundStatus: string;
    customerPhone: string;

    static fromJson(data): AllOrders{
        const o: AllOrders = new AllOrders();

        o['orderId'] = data['order_id'];
        if(data['customer_details']) {
            o['customerName'] = data['customer_details']?.['full_name']; 
            o['customerPhone'] = data['customer_details']?.['phone'];
        }
        if(data['customer_address']){
            o['customerName'] = data['customer_address']?.['customer_name'];
            o['customerPhone'] = data['customer_address']?.['phone'];
        } 
        o['customerId'] = data['customer_id'];
        if(data['order_placed_time']) o['orderPlacedAt'] = new Date(data['order_placed_time']);
        o['clientServiceType'] = ClientServiceType[data['client_service_type']];
        o['orderStatus'] = orderStatusesList[data['order_status']];
        o['deliveryStatus'] = data['delivery_status'];
        o['orderAcceptanceStatus'] = data['order_acceptance_status'];
        o['paymentStatus'] = data['payment_details'][0]['payment_status'];
        if(data['outlet_details']) {
            o['outletName'] = data['outlet_details']?.['outlet_name'];
            o['outletId'] = data['outlet_id'];
        }
        if(data['restaurant_details']) {
            o['outletName'] = data['restaurant_details']?.['restaurant_name'];
            o['outletId'] = data['restaurant_id'];
        }
        if(data['store_details']) {
            o['outletName'] = data['store_details']?.['store_name'];
            o['outletId'] = data['store_id'];
        }
        o['refundStatus'] = data['refund_status'];
        return o;
    }
}

export class FilterAllOrders {
 pageIndex: string;
 pageSize: string; 
 serviceType: ServiceType[] = ['food','grocery','paan','flower','pnd','pet','pharmacy'];
 customerId: string;
 startDate: Date;
 endDate: Date;
 startTime: string;
 endTime: string;
 
 toJson(service: string) {
    const data = {};

    data['filter'] = {};
    if(this.serviceType) data['filter']['service_type'] = this.serviceType;
    if(this.customerId) data['filter']['customer_id'] = this.customerId.split(',');
    if (this.startDate && this.endDate) {
        data['filter']['duration'] = {
          start_date: this.startTime? moment(new Date(moment(this.startDate).format('YYYY-MM-DD') + ' ' +  moment(this.startTime,'h:mm A').format('HH:mm:ss'))).unix() : moment(this.startDate).unix(),
          end_date: this.endTime? moment(new Date(moment(this.endDate).format('YYYY-MM-DD') + ' ' + moment(this.endTime,'h:mm A').format('HH:mm:ss'))).unix(): moment(this.endDate.setHours(23, 59, 59)).unix(),
        };
      }
    data['pagination'] = {
        page_index : 0,
        page_size: 500
    }
    return data;
 }
}

export type ServiceType =  'food' | 'grocery' | 'paan' | 'flower' | 'pnd' | 'pet' | 'pharmacy';
export const serviceTypeList: { [key in ServiceType]: string } = {
    food: 'Food',
    grocery: 'Grocery',
    paan: 'Paan',
    flower: 'Flower',
    pnd: 'PND',
    pet: 'Pet',
    pharmacy: 'Pharmacy'
}

export enum ClientServiceType {
    food = 'Food',
    grocery = 'Grocery',
    paan = 'Paan',
    flower = 'Flower',
    pnd = 'PND',
    tea_and_coffee = 'Tea and Coffee',
    bakery = 'Bakery',
    pet = 'Pet',
    pharmacy = 'Pharmacy'
}

export type OrderStatus = 'pending' | 'placed' | 'completed' | 'cancelled';

export const orderStatusesList: { [key in OrderStatus]: string } = {
    pending: 'Pending',
    placed: 'Placed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
