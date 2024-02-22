import * as moment from "moment";

export class ChangeLog{
    id: number;
    url: string;
    ipAddr: string;
    httpMethods: HttpMethodsList;
    responseCode: number;
    userType: UserTypesList;
    userId: string;
    entityType: string;
    entityId: string;
    requestBody: any;
    responseBody: any;
    actionDetails: any;
    createdAt: string;
    userName: string;
    static fromJson(data: any): ChangeLog {
        const l: ChangeLog = new ChangeLog();
        l['id'] = data['id'];
        l['url'] = data["url"];
        l['ipAddr'] = data["ip_address"];
        l['httpMethods'] = HttpMethodsList[data['http_method']];
        l['responseCode'] = data['response_code'];
        l['userType'] = UserTypesList[data['user_type']];
        l['userId'] = data['user_id'];
        l['entityType'] = data['entity_type'];
        l['entityId'] = data['entity_id'];
        l['requestBody'] = JSON.stringify(data['request_body']);
        l['responseBody'] = JSON.stringify(data['response_body']);
        l['actionDetails'] = JSON.stringify(data['action_details']);
        l['createdAt'] = convertDateAndTimeToEpoch(data['created_at']);
        l['userName'] = data['user_name'];
        return l;
    }
}

export class FilterChangeLog {
    searchText: string;
    urls: string;
    ipAddr: string;
    httpMethods: HttpMethodsList[] = [];
    responseCodes: number[] = [];
    userTypes: UserTypesList[] = [];
    userIds: string;
    entityIds: string;
    entityTypes: string;
    startDate: Date;
    endDate: Date;
    pageIndex: number;
    pageSize: number;
    toJson() {
        const data = {};

        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        if (this.searchText) data['search_text'] = this.searchText;
        data['filter'] = {};
        if (this.urls) data['filter']['urls'] = this.urls.split(',').map((type) => type.trim());
        if (this.ipAddr) data['filter']['ip_addresses'] = this.ipAddr.split(',').map((type) => type.trim());
        if (this.httpMethods.length) data["filter"]["http_methods"] = this.httpMethods;
        if (this.responseCodes.length) data["filter"]['response_codes'] = this.responseCodes;
        if (this.userTypes.length) data["filter"]['user_types'] = this.userTypes;
        if (this.userIds) data['filter']['user_ids'] = this.userIds.split(',').map((type) => type.trim());
        if (this.entityTypes) data['filter']['entity_types'] = this.entityTypes.split(',').map((type) => type.trim());
        if (this.entityIds) data['filter']['entity_ids'] = this.entityIds.split(',').map((id) => id.trim());
        if (this.startDate) data['filter']['start_date'] = moment(this.startDate).format('YYYY-MM-DD');
        if (this.endDate) data['filter']['end_date'] = `${moment(this.endDate).format('YYYY-MM-DD')} 23:59:59`;

        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        return data;
    }

}
function convertDateAndTimeToEpoch(date: string) {
    return moment(date).format('DD-MM-y, h:mm A');
}
export enum HttpMethodsList {
    PUT = 'PUT',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}
export enum UserTypesList {
    admin = 'Admin',
    vendor = 'Vendor',
    partner = 'Partner'
}