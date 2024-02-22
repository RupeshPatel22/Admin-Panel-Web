

export class Client {
    clientId: string;
    clientName: string;
    deliveryCharges: DeliveryCharges;
    authToken: string;
    callbackToken: string;
    orderStatusCbUrl: string;
    orderStatusCbMethod: string;
    riderLocationCbUrl: string;
    riderLocationCbMethod: string;

    static fromJson(data): Client {
        const c: Client = new Client();

        c['clientId'] = data['id'];
        c['clientName'] = data['name'];
        c['deliveryCharges'] = DeliveryCharges.fromJson(data['delivery_charge_config']);
        c['authToken'] = data['auth_token'];
        c['callbackToken'] = data['callback_token'];
        c['orderStatusCbUrl'] = data['order_status_cb_url'];
        c['orderStatusCbMethod'] = data['order_status_cb_method'];
        c['riderLocationCbUrl'] = data['rider_location_cb_url'];
        c['riderLocationCbMethod'] = data['rider_location_cb_method'];
        return c;
    }
}

export enum ClientAction {
    AddClient,
    UpdatePricing,
    ViewPricing,
    GenerateAuthToken,
    ViewAuthToken,
    CallbackToken,
    OrderStatusCb,
    RiderLocationCb
}

export class DeliveryCharges {
    normal: ISlab[] = [];
    longDistance: ISlab;

    static fromJson(data: any): DeliveryCharges {
        const d: DeliveryCharges = new DeliveryCharges();
        if (data['normal']) {
            for (const i of data['normal']['slabs']) {
                d['normal'].push(
                    {
                        minDistance: i['start'],
                        maxDistance: i['end'],
                        rateType: i['rate_type'],
                        rate: i['rate'],
                    }
                )
            }
        }
        if (data['ld']) {
            d['longDistance'] = <ISlab>{};
            d['longDistance']['minDistance'] = data['ld']['start'];
            d['longDistance']['rateType'] = data['ld']['rate_type'];
            d['longDistance']['rate'] = data['ld']['rate'];
        }
        return d;
    }

    toJson() {
        const data = { delivery_charge_config: {} };
        if (this.normal.length) {
            data['delivery_charge_config']['normal'] = {};
            data['delivery_charge_config']['normal']['slabs'] = this.normal.map(item => ({
                start: item['minDistance'],
                end: item['maxDistance'] || undefined,
                rate_type: item['rateType'],
                rate: item['rate']
            }));
        }
        if (this.longDistance) {
            data['delivery_charge_config']['ld'] = {
                start: this.longDistance['minDistance'],
                rate_type: this.longDistance['rateType'],
                rate: this.longDistance['rate']
            };
        }
        return data;
    }
}

export interface ISlab {
    minDistance: number;
    maxDistance?: number;
    rateType: string;
    rate: number;
}

export enum SlabRateType {
    fixed = 'Fixed',
    per_km = 'Per Km'
}