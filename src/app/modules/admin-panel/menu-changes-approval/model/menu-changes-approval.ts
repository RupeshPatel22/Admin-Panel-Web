import * as moment from 'moment';
import { Services } from 'src/app/shared/models';
import { Category, SubCategory, MenuItem, AddonGroup, Addon, VariantGroup, Variant } from '../../outlet-details/menu/model/menu';
export class MenuChangesApproval {
    approvalId: number;
    action: ActionTypes;
    approvalStatus: MenuChangesApprovalStatus;
    remarks: string;
    additionalDetails: string;
    changesRequestedBy: string;
    entityId: string;
    entityType: EntityTypes;
    outletId: string;
    outletName: string;
    previousEntityDetails: any;
    requestedEntityDetails: any;
    createdAt: string;
    static fromJson(data: any): MenuChangesApproval {
        const m: MenuChangesApproval = new MenuChangesApproval();
        m['approvalId'] = data['id'];
        m['action'] = ActionTypes[data['action']];
        m['approvalStatus'] = data['status'];
        m['remarks'] = data['status_comments'];
        m['changesRequestedBy'] = data['change_requested_by'];
        m['entityId'] = data['entity_id'];
        m['entityType'] = EntityTypes[data['entity_type']];
        m['outletId'] = data['restaurant_id'] || data['store_id'] || data['outlet_id'];
        m['outletName'] = data['restaurant_name'] || data['store_name'] || data['outlet_name'];
        switch (m['entityType']) {
            case EntityTypes.main_category:
                m['previousEntityDetails'] = m['action'] === ActionTypes.update ? Category.fromJson(data['previous_entity_details']) : null;
                m['requestedEntityDetails'] = Category.fromJson(data['requested_entity_changes']);
                break;
            case EntityTypes.sub_category:
                m['previousEntityDetails'] = m['action'] === ActionTypes.update ? SubCategory.fromJson(data['previous_entity_details']) : null;
                m['requestedEntityDetails'] = SubCategory.fromJson(data['requested_entity_changes']);
                break;
            case EntityTypes.menu_item:
                m['previousEntityDetails'] = m['action'] === ActionTypes.update ? MenuItem.fromJson(data['previous_entity_details']) : null;
                m['requestedEntityDetails'] = MenuItem.fromJson(data['requested_entity_changes']);
                break;
            case EntityTypes.addon_group:
                m['previousEntityDetails'] = m['action'] === ActionTypes.update ? AddonGroup.fromJson(data['previous_entity_details']) : null;
                m['requestedEntityDetails'] = AddonGroup.fromJson(data['requested_entity_changes']);
                break;
            default:
                m['previousEntityDetails'] = m['action'] === ActionTypes.update ? Addon.fromJson(data['previous_entity_details']) : null;
                m['requestedEntityDetails'] = Addon.fromJson(data['requested_entity_changes']);
                break;
        }
        m['createdAt'] = convertDateAndTimeToEpoch(data['created_at']);
        return m;
    }
}

export class FilterMenuChanges {
    approvalId: string;
    actionType: string[] = [];
    entityType: string[] = [];
    outletId: string;
    startDate: Date;
    endDate: Date;
    approvalStatus: MenuChangesApprovalStatus[] = [];
    pageIndex: number;
    pageSize: number;
    startTime: string;
    endTime: string;
    toJson(service: string) {
        const data = {};

        data['pagination'] = {
            page_index: this.pageIndex,
            page_size: this.pageSize
        }
        if (this.approvalId) data['search_text'] = this.approvalId;
        data['filter'] = {};
        if (this.approvalStatus.length) data['filter']['status'] = this.approvalStatus;
        if (this.outletId) {
            if (service === Services.Food) {
                data['filter']['restaurant_id'] = [this.outletId];
            } else if (service === Services.Grocery) {
                data['filter']['store_id'] = [this.outletId];
            } else if (service === Services.Paan || service === Services.Flower || service === Services.Pharmacy || service === Services.Pet) {
                data['filter']['outlet_id'] = [this.outletId];
            }            
        }
        if (this.actionType.length) data['filter']['action'] = this.actionType;
        if (this.entityType.length) data['filter']['entity_type'] = this.entityType;
        if (this.startDate && this.endDate) {
            data['filter']['duration'] = {
              start_date: this.startTime? moment(new Date(moment(this.startDate).format('YYYY-MM-DD') + ' ' +  moment(this.startTime,'h:mm A').format('HH:mm:ss'))).unix() : moment(this.startDate).unix(),
              end_date: this.endTime? moment(new Date(moment(this.endDate).format('YYYY-MM-DD') + ' ' + moment(this.endTime,'h:mm A').format('HH:mm:ss'))).unix(): moment(this.endDate.setHours(23, 59, 59)).unix(),
            };
          }
        return data;
    }
}

export enum EntityTypes {
    main_category = 'Main Category',
    sub_category = 'Sub Category',
    menu_item = 'Menu Item',
    addon_group = 'Addon Group',
    addon = 'Addon'
}

export enum ActionTypes {
    create = 'Create',
    update = 'Update'
}
export type MenuChangesApprovalStatus = 'pending' | 'reviewed' | 'rejected';

function convertDateAndTimeToEpoch(date: string) {
    return moment(date).format('DD-MM-y, h:mm A');
}