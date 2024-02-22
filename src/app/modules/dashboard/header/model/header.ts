import * as moment from "moment";

export class NotificationData {
    id: number;
    title: string;
    body: string;
    markAsRead: boolean;
    priority: string;
    createdAt: string;
    updatedAt: string;
    service: string;

    static fromJson(data: any): NotificationData {
        const n: NotificationData = new NotificationData();
        n['id'] = data['id'];
        n['title'] = data['content']['notification']['title'];
        n['body'] = data['content']['notification']['body'];
        n['markAsRead'] = data['mark_as_read'];
        n['priority'] = data['priority'];
        n['createdAt'] = moment(data['created_at']).fromNow();
        n['updatedAt'] = data['updated_at'];
        n['service'] = data['payload']['data']['service_name'].replace(/"/g, "");
        return n;
    }
}