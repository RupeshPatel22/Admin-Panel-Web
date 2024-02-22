export class CancellationReason {
    id: number;
    userType: string;
    cancellationReason: string;

    static fromJson(data): CancellationReason {
        const c: CancellationReason = new CancellationReason();

        c['id'] = data['id'];
        c['userType'] = data['user_type'];
        c['cancellationReason'] = data['cancellation_reason'];
        return c;
    }
}

export enum UserType {
    admin = 'Admin',
    customer = 'Customer',
    vendor = 'Vendor'
}