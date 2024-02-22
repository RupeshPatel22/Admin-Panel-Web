export class DeliverySplitting {
    normal: ISplitting[] = [];
    longDistance: ISplitting;

    static fromJson(data: any): DeliverySplitting {
        const d: DeliverySplitting = new DeliverySplitting();
        if (data['normal']) {
            for (const i of data['normal']['slabs']) {
                d['normal'].push(
                    {
                        minOrderValue: i['start'],
                        maxOrderValue: i['end'],
                        shareType: i['splitting']['share_type'],
                        vendorShare: i['splitting']['vendor_share'],
                        customerShare: i['splitting']['customer_share'],
                        speedyyShare: i['splitting']['speedyy_share'],
                    }
                )
            }
        }
        if (data['ld']) {
            d['longDistance'] = <ISplitting>{};
            d['longDistance']['shareType'] = data['ld']['share_type'];
            d['longDistance']['vendorShare'] = data['ld']['vendor_share'];
            d['longDistance']['customerShare'] = data['ld']['customer_share'];
            d['longDistance']['speedyyShare'] = data['ld']['speedyy_share'];
        }
        return d;
    }

    toJson() {
        const data = { delivery_splitting: {} };
        if (this.normal.length) {
            data['delivery_splitting']['normal'] = {};
            data['delivery_splitting']['normal']['slabs'] = this.normal.map(item => ({
                start: item['minOrderValue'],
                end: item['maxOrderValue'] || undefined,
                splitting: {
                    share_type: item['shareType'],
                    vendor_share: item['vendorShare'] ?? undefined,
                    customer_share: item['customerShare'] ?? undefined,
                    speedyy_share: item['speedyyShare'] ?? undefined,
                }
            }));
        }
        if (this.longDistance) {
            data['delivery_splitting']['ld'] = {
                share_type: this.longDistance['shareType'],
                vendor_share: this.longDistance['vendorShare'] ?? undefined,
                customer_share: this.longDistance['customerShare'] ?? undefined,
                speedyy_share: this.longDistance['speedyyShare'] ?? undefined
            };
        }
        return data;
    }
}

export interface ISplitting {
    minOrderValue?: number;
    maxOrderValue?: number;
    shareType: string;
    vendorShare: number;
    customerShare: number;
    speedyyShare: number;
}

export enum SplittingShareType {
    fixed = 'Fixed',
    percent = 'Percentage'
}