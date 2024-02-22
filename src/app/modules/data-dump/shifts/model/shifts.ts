export class RiderShifts {
    id: string;
    name: string;
    type: string;
    start_time: string;
    end_time: string;
    min_guarantee_in_rupees: number;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    toJson(action: RiderShiftAction) {
        const data = {};
        if (action === 'Edit') {
            data['id'] = this.id;
        }
        data['name'] = this.name;
        data['type'] = this.type;
        data['start_time'] = this.start_time;
        data['end_time'] = this.end_time;
        data['min_guarantee_in_rupees'] = this.min_guarantee_in_rupees;
        return data;
    }

}

export class FilterRiderShifts {
    id: string = null;
    name: string = null;
}

export type RiderShiftAction = 'Add' | 'Edit';