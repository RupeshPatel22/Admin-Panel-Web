export class Banner {
    id: string;
    title: string;
    imageName: string;
    imageUrl: string;
    sequence: number;
    status: string;
    bannerLink: string;

    static fromJson(data: any): Banner {
        const b: Banner = new Banner();
        b['id'] = data['id'];
        b['title'] = data['title'];
        b['imageName'] = data['image']['name'];
        b['imageUrl'] = data['image']['url'];
        b['sequence'] = data['sequence'];
        b['status'] = data['status'];
        b['bannerLink'] = data['banner_link'];
        return b;
    }
}