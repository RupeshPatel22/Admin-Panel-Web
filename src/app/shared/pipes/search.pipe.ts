import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(dataSource: MatTableDataSource<any>, search: string) {
    if (search !== null) {
      dataSource.filter = search.trim().toLowerCase();
    }
    return dataSource
  }
}
