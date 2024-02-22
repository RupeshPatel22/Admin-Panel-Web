import * as moment from "moment";

export class Sales {
    displayDate: string;
    totalPayoutBarHeight: number = 1;
    totalCompletedOrdersPayoutBarHeight: number = 1;
    totalCancelledOrdersPayoutBarHeight: number = 1;
    totalCustomerPayoutBarHeight: number = 1;
    totalDeliveryPartnerBarHeight: number = 1;
    ordersCount: number;
    totalVendorSalesAmount: number;
    avgOrdersRating: number;
    customerCancelledOrdersCount: number;
    vendorCancelledOrdersCount: number;
    deliveryPartnerCancelledOrdersCount: number;

    static fromJson(durationType: Duration, data: any): Sales {
        const s: Sales = new Sales();
        
        s['displayDate'] = this.convertDate(durationType, data['start_time'], data['end_time']);
        if (data) {
            s['ordersCount'] = data['total_orders_count'];
            s['totalVendorSalesAmount'] = data['vendor_sales_amount'];
            s['customerCancelledOrdersCount'] = data['orders_cancelled_by_customer_count'];
            s['vendorCancelledOrdersCount'] = data['orders_cancelled_by_vendor_count'];
            s['deliveryPartnerCancelledOrdersCount'] = data['orders_cancelled_by_delivery_partner_count'];
            s['avgOrdersRating'] = data['average_orders_rating'];
        }
        return s;
    }

    static convertDate(durationType: Duration, startTime: number, endTime: number) {
        if (durationType === 'this_month') {
            const startDate = moment.unix(startTime).format('D MMM');
            const endDate = moment.unix(endTime).format('D MMM');
            return `${startDate}-${endDate}`;
        }
        if (durationType === 'custom_range') {
            const startDate = moment.unix(startTime).format('D MMM YYYY');
            const endDate = moment.unix(endTime).format('D MMM YYYY');
            return `${startDate} - ${endDate}`;
        }
        return moment.unix(startTime).format('D MMM');
    }
}

export type Duration = 'today' | 'this_week' | 'this_month' | 'custom_range';