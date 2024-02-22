import { Pipe, PipeTransform } from '@angular/core';
import { AddonGroup } from 'src/app/modules/admin-panel/outlet-details/menu/model/menu';

@Pipe({
  name: 'addonGroupFilter'
})
export class AddonGroupFilterPipe implements PipeTransform {

  // Define a function called 'transform' that takes an array of AddonGroup objects
// and a string representing a JSON-encoded array of strings as arguments
transform(data: AddonGroup[], args: string): any {

  // Parse the 'args' string into an array of strings called 'selectedFoodTypes'
  const selectedFoodTypes: Array<string> = JSON.parse(args);

  // If 'selectedFoodTypes' is not equal to 3, return the original 'data' array without filtering
  if (selectedFoodTypes.length === 3) {
    return data;
  }

  // Use the 'filter' method to iterate over each object in the 'data' array
  // For each object, iterate over its 'addons' array
  // Count the number of 'Addon' objects that match the 'foodType' property of any string in 'selectedFoodTypes'
  // If at least one addon matches the selected 'foodType' criteria, keep the 'AddonGroup' object in the filtered array
  // Otherwise, filter the object out
  // If at least one 'AddonGroup' object is kept in the filtered array, return it in the final output
  data = data.filter(addonGroup => {
    let addonCount = 0;
    if (!addonGroup.addons.length) {
      return addonGroup
    }
    addonGroup.addons.forEach(addon => {
      if (selectedFoodTypes.includes(addon.foodType)) {
        addonCount++;
      }
    })
    if (addonCount > 0) {
      return addonGroup
    }
  })
  return data;
}


}
