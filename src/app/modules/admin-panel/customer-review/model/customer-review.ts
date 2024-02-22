import * as moment from "moment";
import { Services } from "src/app/shared/models";

export class CustomerReview {
    id: string;
    customerId: string;
    customerName: string;
    comments: string;
    reviewedAt: string;
    orderPlacedTime: string;
    voteType: string;
    orderRating: string;
    outletId: string;
    outletName: string;

    static fromJson (data: any) : CustomerReview {
        const c: CustomerReview = new CustomerReview();
        c['id'] = data['id'];
        c['customerId'] = data['customer_id'];
        c['customerName'] = data['customer_name'];
        c['comments'] = data['comments'];
        c['reviewedAt'] = convertDateAndTime(data['reviewed_at']);
        c['orderPlacedTime'] = convertDateAndTime(data['order_placed_time']);
        c['voteType'] = data['vote_type'];
        c['orderRating'] = data['order_rating'];
        c['outletId'] = data['restaurant_id'] || data['store_id'] || data['outlet_id'];
        c['outletName'] = data['restaurant_name'] || data['store_name'] || data['outlet_name'];
        return c;
    }
}

export class FilterCustomerReview {
    voteType: string;
    rating: number;
    ratingGt: string;
    ratingLt: string;
    pageIndex: number;
    pageSize: number;
    outletIds: string[];

    toJson(services) {
        const data = {};
        if(services === Services.Food) data['restaurant_ids'] = this.outletIds;
        if (services === Services.Grocery) data['store_ids'] = this.outletIds;
        if (services === Services.Paan || services === Services.Flower || services === Services.Pharmacy || services === Services.Pet) data['outlet_ids'] = this.outletIds;
        data['filter'] = {}
        if(this.voteType) data['filter']['vote_type'] = this.voteType;
        if(this.rating) data['filter']['rating'] = this.rating;
        if(this.ratingGt) data['filter']['rating_gt'] = this.ratingGt;
        if(this.ratingLt) data['filter']['rating_lt'] = this.ratingLt;
        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        data['sort'] = [{
            column: "created_at",
            order: "desc"
        }]
        return data;
    }
}

function convertDateAndTime(date: string) {
    return moment(date).format('DD-MM-YYYY, h:mm A');
}