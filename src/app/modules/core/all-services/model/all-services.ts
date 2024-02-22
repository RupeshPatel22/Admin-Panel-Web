export class AllServices {
  id: string;
  name: string;
  sequence: number;
  showOnAndroid: boolean;
  showOnIos: boolean;
  statusOnAndroid: string;
  statusOnIos: string;
  imageUrl: string;
  imageName: string;

  static fromJson(data): AllServices {
    const a: AllServices = new AllServices();
    a.id = data['id'];
    a.name = data['name'];
    a.sequence = data['sequence'];
    a.showOnAndroid = data['show_on_android'];
    a.showOnIos = data['show_on_ios'];
    a.statusOnAndroid = data['status_on_android'];
    a.statusOnIos = data['status_on_ios'];
    if(data['image']) {
      a.imageUrl = data['image']?.['url'];
      a.imageName = data['image']?.['name'];
    }else{
      a.imageUrl = data['image_url'];
    }
    return a;
  }
}
