import * as moment from "moment";

export class MasterCategory {
    id: string;
    name: string;
    imageName: string;
    imageUrl: string;
    description: string;
    sequence: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;

    static fromJson(data: any): MasterCategory{
        const m: MasterCategory = new MasterCategory();

        m['id'] = data['id'];
        m['name'] = data['name'];
        m['imageName'] = data['image']?.['name'];
        m['imageUrl'] = data['image']?.['url'];
        m['createdAt'] = convertDateAndTime(data['created_at']);
        m['updatedAt'] = convertDateAndTime(data['updated_at']);
        m['isDeleted'] = data['is_deleted'];
        m['sequence'] = data['sequence'];
        return m;
    }
}

function convertDateAndTime(date: string) {
    return moment(date).format('DD-MM-YYYY, h:mm A');
}