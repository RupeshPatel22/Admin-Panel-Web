import { Pipe, PipeTransform } from '@angular/core';
import { Menu } from 'src/app/modules/admin-panel/outlet-details/menu/model/menu';

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {

  // Define a function called 'transform' that takes an array of Menu objects
// and a string representing a JSON-encoded array of strings as arguments
transform(data: Menu[], args: string): any {

  // Parse the 'args' string into an array of strings called 'selectedFoodTypes'
  const selectedFoodTypes: Array<string> =  JSON.parse(args);

  // If 'selectedFoodTypes' is not equal to 3, return the original 'data' array without filtering
  if (selectedFoodTypes.length === 3) {
    return data;
  }

  // Use the 'filter' method to iterate over each object in the 'data' array
  // For each object, iterate over its 'subCategories' array and then its 'menuItems' array
  // Count the number of 'MenuItem' objects that match the 'foodType' property of any string in 'selectedFoodTypes'
  // If at least one item matches the selected 'foodType' criteria, keep the 'SubCategory' object in the filtered array
  // Otherwise, filter the object out
  // If at least one 'SubCategory' object is kept in the filtered array, keep the 'Menu' object in the final output
  data = data.filter(category => {
    if (!category.subCategories.length) return category;

    let subCategoryCount = 0;
    for (const sub of category.subCategories) {
      if (!sub.menuItems.length) return category;
      
      let itemCount = 0;
      for(const item of sub.menuItems) {
        if (selectedFoodTypes.includes(item.foodType)) {
          itemCount++;
        }
      }
      if (itemCount > 0) {
        subCategoryCount++
      }
    }
    if (subCategoryCount > 0) {
      return category;
    }
  })
  return data;
}


}
