import * as moment from "moment";

export class Pos {
    id: string;
    posRestaurantId: string;
    posId: string;
    posStatus: PosOnboardingStatus;
    details: string;
    initiatedAt: string;
    onboardedAt: string;
    menuLastUpdatedAt: string;
    createdAt: string;
    updatedAt: string;
 
    static fromJson (data: any): Pos{
        const p: Pos = new Pos();
    
        p['id'] = data['id'];
        p['posRestaurantId'] = data['pos_restaurant_id'];
        p['posId'] = data['pos_id'];
        p['posStatus'] = data['pos_status'];
        p['details'] = data['details'];
        if(data['initiated_at']) p['initiatedAt'] = convertDateAndTimeToEpoch(data['initiated_at']);
        if(data['onboarded_at']) p['onboardedAt'] = convertDateAndTimeToEpoch(data['onboarded_at']);
        if(data['menu_last_updated_at']) p['menuLastUpdatedAt'] = convertDateAndTimeToEpoch(data['menu_last_updated_at']);
        if(data['created_at']) p['createdAt'] = convertDateAndTimeToEpoch(data['created_at']);
        if(data['updated_at']) p['updatedAt'] = convertDateAndTimeToEpoch(data['updated_at']);
        return p;
    } 
}
    function convertDateAndTimeToEpoch(date: string) {
        return moment(date).format('DD-MM-y, h:mm a');

}
export type PosOnboardingStatus = 'init' | 'got_order_id' | 'ready' | 'onboarded';