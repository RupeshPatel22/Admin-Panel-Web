export class Area {
  id: string;
  areaName: string;
  status: string;
  cityId: string;
  cityName: string;
  coordinates: any[];
  static fromJson(data): Area {
    const a: Area = new Area();
    a.id = data['id'];
    a.areaName = data['name'];
    a.status = data['status'];
    a.cityId = data['city_id'];
    a.cityName = data['city_name'];
    a.coordinates = data['coordinates'];
    return a;
  }
}

export class FilterArea {
  id: string = null;
  city: string = null;
  area: string = null;
  status: string = null;
}