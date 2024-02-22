export class Cuisine {
    id: string;
    name: string;
    status: string;
    imageName: string;
    imageUrl: string;
    ageRestricted: boolean;

    static fromJson(data: any): Cuisine {
        const c: Cuisine = new Cuisine();

        c['id'] = data['id'];
        c['name'] = data['name'];
        c['status'] = data['status'];
        c['imageName'] = data['image']?.['name'];
        c['imageUrl'] = data['image']?.['url'];
        c['ageRestricted'] = data['age_restricted'];
        return c;
    }

}
export class FilterCuisine {
    id: string = null;
    cuisine: string = null;
    status: string = null;
}