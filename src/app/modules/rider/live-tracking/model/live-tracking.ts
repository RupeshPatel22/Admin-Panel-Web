export class RiderTracking {
    riderId: string;
    riderName: string;
    image: string;
    riderStatus: string;
    latitude: number;
    longitude: number;

    static fromJson(data): RiderTracking {
        const r: RiderTracking = new RiderTracking();

        r['riderId'] = data['id'];
        r['riderName'] = data['name'];
        r['image'] = data['image']['url'];
        r['riderStatus'] = data['active_status'];
        r['latitude'] = data['coordinates']['latitude'];
        r['longitude'] = data['coordinates']['longitude'];
        return r;
    }
}