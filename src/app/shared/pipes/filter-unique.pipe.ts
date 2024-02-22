import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUnique'
})
export class FilterUniquePipe implements PipeTransform {

  transform(data: any[], args: any) {
    const uniqueList = data.filter((value, i, arr) => arr.findIndex(t => t[args] === value[args]) === i);
    return uniqueList;
  }

}
