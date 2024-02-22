import * as moment from "moment";

export class GlobalVar {
    key: string;
    value: any;
    type: string;
    isEditable: boolean;
    description: string;
    updatedBy: string;
    updatedAt: string;

    static fromJson(data: any): GlobalVar {
        const g: GlobalVar = new GlobalVar();

        g['key'] = data['key'];
        g['type'] = data['type'];
        if (data['type'] === 'json') {
            g['value'] = JSON.stringify(data['value']);
        } else {
            g['value'] = data['value'];
        }
        g['isEditable'] = data['editable'];
        g['description'] = data['description'];
        g['updatedBy'] = data['updated_by'];
        g['updatedAt'] = convertDateAndTimeToEpoch(data['updated_at']);
        return g;
    }
}

function convertDateAndTimeToEpoch(date: string) {
    return moment(date).format('DD-MM-y, h:mm a');
}