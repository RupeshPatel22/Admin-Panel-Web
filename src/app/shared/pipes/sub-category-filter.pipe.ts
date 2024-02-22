import { Pipe, PipeTransform } from '@angular/core';
import { SubCategory } from 'src/app/modules/admin-panel/outlet-details/menu/model/menu';

@Pipe({
  name: 'subCategoryFilter'
})
export class SubCategoryFilterPipe implements PipeTransform {

  // Define a function called 'transform' that takes an array of SubCategory objects
// and a string representing a JSON-encoded array of strings as arguments
transform(data: SubCategory[], args: string): any {

  // Parse the 'args' string into an array of strings called 'selectedFoodTypes'
  const selectedFoodTypes: Array<string> =  JSON.parse(args);

  // If 'selectedFoodTypes' is not equal to 3, return the original 'data' array without filtering
  if (selectedFoodTypes.length === 3) {
    return data;
  }

  // Use the 'filter' method to iterate over each object in the 'data' array
  // For each object, iterate over its 'menuItems' array and count the number of items
  // that match the 'foodType' property of any string in 'selectedFoodTypes'
  // If at least one item matches the selected 'foodType' criteria, keep the 'SubCategory' object in the filtered array
  // Otherwise, filter the object out
  return data.filter(sub => {
    if (!sub.menuItems.length) return sub;
    let itemCount = 0;
    sub.menuItems.forEach(item => {
      if (selectedFoodTypes.includes(item.foodType)) {
        itemCount++;
      }
    })
    if (itemCount > 0) {
      return sub
    }
  })
}


}
