import * as moment from "moment";

export class Notification {
    pushNotificationId: string;
    userId: string;
    userType: string;
    templateId: string;
    deliveryStatus: string;


    static fromJson(data): Notification {
        const n: Notification = new Notification();
        n['pushNotificationId'] = data['id'];
        n['userId'] = data['user_id'];
        n['userType'] = data['user_type'];
        n['templateId'] = data['template_id'];
        if(data['delivery_details']) {
            if(data['delivery_details']['successCount'] >= 1) {
                n['deliveryStatus'] = 'Success';
            }
            else if(data['delivery_details']['successCount'] < 1){
                n['deliveryStatus'] = 'Failed';
            } else {
                n['deliveryStatus'] = 'N/A';
            }
        }
        return n;
    }
}

export class FilterNotifications {
    searchText: string;
    pushNotificationId: string;
    userType: string[] = [];
    userId: string;
    templateId: string;
    markAsRead: string;
    priority: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    deliveryStatus: string;
    pageIndex: number;
    pageSize: number;

    toJason() {
        const data = {};
        
        data['filter'] = {};
        if(this.searchText) data['search_text'] = this.searchText;
        if(this.pushNotificationId) data['filter']['push_notification_id'] = this.pushNotificationId.split(',');
        if(this.userType.length) data['filter']['user_type'] = this.userType;
        if(this.userId) data['filter']['user_id'] = this.userId.split(',');
        if(this.templateId) data['filter']['template_id'] = this.templateId.split(',');
        if(this.markAsRead) data['filter']['mark_as_read'] = this.markAsRead;
        if(this.priority) data['filter']['priority'] = this.priority;
        if(this.startDate && this.endDate) {
            data['filter']['duration'] = {
                start_date: this.startTime? moment(new Date(moment(this.startDate).format('YYYY-MM-DD') + ' ' +  moment(this.startTime,'h:mm A').format('HH:mm:ss'))).unix() : moment(this.startDate).unix(),
                end_date: this.endTime? moment(new Date(moment(this.endDate).format('YYYY-MM-DD') + ' ' + moment(this.endTime,'h:mm A').format('HH:mm:ss'))).unix(): moment(this.endDate.setHours(23, 59, 59)).unix(),
              };
        }
        if(this.deliveryStatus) data['filter']['delivery_status'] = this.deliveryStatus;
        data['pagination'] = {
            page_index : this.pageIndex,
            page_size: this.pageSize
        }
        return data;
    }
}