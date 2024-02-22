import * as moment from "moment";

export class OperationalCities {
    id: number;
    name: string;
    polygon: {lat: number, lng: number}[];
    operationalZones: OperationalZone[] = [];

    static fromJson (data: any): OperationalCities {
        const l : OperationalCities = new OperationalCities();
        l['id'] = data['id'];
        l['name'] = data['name'];
        l['polygon'] = data['polygon'].map(pair => ({ lat: pair.latitude, lng: pair.longitude }));
        l['operationalZones'] = data['operational_zones'].map((zoneData:any) => OperationalZone.fromJson(zoneData));  
        return l;
    }
}

export class OperationalZone {
    id: number;
    name: string;
    polygon: {lat: number, lng: number}[];
    liveRiders: number;
    liveOrders: number;
    bannerFactorLowerLimit: number;
    bannerFactorUpperLimit: number;
    bannerFactorCoolDownSince: string;
    currentBannerFactor: number;

    static fromJson (data: any): OperationalZone {
        const o : OperationalZone = new OperationalZone();
        o['id'] = data['id'];
        o['name'] = data['name'];
        o['polygon'] = data['polygon'].map(pair => ({ lat: pair.latitude, lng: pair.longitude}));
        o['liveRiders'] = data['live_riders'];
        o['liveOrders'] = data['live_orders'];
        o['bannerFactorLowerLimit'] = data['banner_factor_lower_limit'];
        o['bannerFactorUpperLimit'] = data['banner_factor_upper_limit'];
        o['bannerFactorCoolDownSince'] =  data['banner_factor_cool_down_since'] ? convertDateAndTime(data['banner_factor_cool_down_since']) : 'No';
        o['currentBannerFactor'] = data['current_banner_factor'] !== null ? data['current_banner_factor'] : 'N/A';
        return o;
    }
}

export class Filter {
    operationalCityId: number;
    operationalZoneId: number[] = [];

    toJson() {
        const data = {};
        data['filter'] = {};
        if (this.operationalCityId){
            data['filter']['operational_city_id'] = [this.operationalCityId];
        }
        if(this.operationalZoneId?.length) {
            data['filter']['operational_zone_id'] = this.operationalZoneId;
        }

        return data;
    }
}

function convertDateAndTime(date: string) {
    return moment(date).format('DD-MM-YYYY, h:mm A');
}