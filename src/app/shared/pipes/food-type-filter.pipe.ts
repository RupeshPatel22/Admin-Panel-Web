import { Pipe, PipeTransform } from '@angular/core';
import { Addon, MenuItem } from 'src/app/modules/admin-panel/outlet-details/menu/model/menu';

@Pipe({
  name: 'foodTypeFilter'
})
export class FoodTypeFilterPipe implements PipeTransform {

 // Define a function called 'transform' that takes an array of MenuItems or Addons
// and a string representing a JSON-encoded array of strings as arguments
transform(data: (MenuItem | Addon)[], args: string): any {

  // Parse the 'args' string into an array of strings called 'selectedFoodTypes'
  const selectedFoodTypes: Array<string> =  JSON.parse(args);

  // If 'selectedFoodTypes' is not equal to 3, return the original 'data' array without filtering
  if (selectedFoodTypes.length === 3) {
    return data;
  }

  // Use the 'filter' method to iterate over each object in the 'data' array
  // For each object, check if the 'foodType' property matches any of the strings in 'selectedFoodTypes'
  // If the 'foodType' matches at least one string in 'selectedFoodTypes', keep the object in the filtered array
  // Otherwise, filter the object out
  return data.filter(item => {
    return selectedFoodTypes.includes(item.foodType)
  })
}


  

}
