export class SubscriptionPlan {
    id: string;
    name: string;
    amount: number;
    type: string;
    category: string;
    description: string;
    intervalType: string;
    intervalCount: number;
    maxCycles: number;
    ordersCount: number;
    gracePeriodOrdersCount: number;
    tnc: string;
    isActive: boolean;
    static fromJson(data: any): SubscriptionPlan {
        const s: SubscriptionPlan = new SubscriptionPlan();
        s['id'] = data['id'];
        s['name'] = data['name'];
        s['amount'] = data['amount'];
        s['type'] = data['type'];
        s['category'] = data['category'];
        s['description'] = data['description'];
        s['intervalType'] = data['interval_type'];
        s['intervalCount'] = data['intervals'];
        s['maxCycles'] = data['max_cycles'];
        s['ordersCount'] = data['no_of_orders'];
        s['gracePeriodOrdersCount'] = data['no_of_grace_period_orders'];
        s['tnc'] = data['terms_and_conditions'];
        s['isActive'] = data['active'];
        return s;
    }
    toJson(action: PlanAction) {
        const data = {};
        data['name'] = this.name;
        data['category'] = this.category;
        if (action === 'Add') {
            if (this.type === 'periodic') {
                data['amount'] = this.amount;
                data['max_cycles'] = this.maxCycles;
            }
            data['type'] = this.type;
            data['interval_type'] = this.intervalType;
        }
        data['description'] = this.description;
        data['no_of_orders'] = this.ordersCount;
        data['no_of_grace_period_orders'] = this.gracePeriodOrdersCount;
        data['terms_and_conditions'] = this.tnc;
        return data;
    }
}

export class FilterSubscriptionPlan {
    planName: string;
    planType: PlanType;
    planCategory: PlanCategory[] = [];
    planIntervalType: PlanIntervalType[] = [];
    pageIndex: number;
    pageSize: number;
    
    toJson() {
        const data = {};


        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        if (this.planName) data['search_text'] = this.planName;
        data['filter'] = {};
        if (this.planType) data['filter']['type'] = [this.planType];
        if (this.planCategory.length) data['filter']['category'] = this.planCategory;
        if (this.planIntervalType.length) data['filter']['interval_type'] = this.planIntervalType;
        return data;
    }
}

export enum PlanType {
    periodic = 'Periodic',
    free = 'Free',
}
export enum PlanCategory {
    basic = 'Basic',
    premium = 'Premium',
    advance = 'Advance',
}
export enum PlanIntervalType {
    day = 'Day',
    week = 'Week',
    month = 'Month',
    year = 'Year',
}
export type PlanAction = 'Add' | 'Edit' | 'View';