import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  itemsList: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['image', 'itemName', 'recommended', 'status', 'itemType', 'price'];
  showFilterFields: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  cuisinesDataArr = [];
  filteredValues = { veg: '', inStock: '', status: '', type: '' };
  globalFilter: string;
  filterVeg: string;
  //filterInStock: string;
  filterStatus: string;
  //filterType: string;

  ELEMENT_DATA = [
    {
      id: '1',
      itemName: 'Pizza',
      // inStock: 'yes',
      // isPerishable: false,
      recommended: 'yes',
      status: 'enabled',
      price: '55',
      // type: 'regular',
      veg: 'veg'
    },
    {
      id: '2',
      // itemName: 'Idli',
      // inStock: 'no',
      recommended: 'yes',
      isPerishable: false,
      status: 'enabled',
      price: '40',
      // type: 'regular',
      veg: 'veg'
    },
    {
      id: '3',
      itemName: 'vada pav',
      // inStock: 'yes',
      // isPerishable: true,
      recommended: 'no',
      status: 'enabled',
      price: '15',
      // type: 'popular',
      veg: 'veg'
    },
    {
      id: '4',
      itemName: 'pasta',
      // inStock: 'yes',
      // isPerishable: false,
      recommended: 'yes',
      status: 'disabled',
      price: '150',
      // type: 'popular',
      veg: 'non-veg'
    },
    {
      id: '5',
      itemName: 'kulcha',
      // inStock: 'yes',
      // isPerishable: false,
      recommended: 'no',
      status: 'disabled',
      price: '55',
      // type: 'regular',
      veg: 'non-veg'
    }
  ]

  constructor() { }

  ngOnInit(): void {
    // this.itemsList = new MatTableDataSource(this.ELEMENT_DATA);
    // setTimeout(() => {
    //   this.itemsList.paginator = this.paginator;
    //   this.itemsList.sort = this.sort;
    //   this.itemsList.filterPredicate = this.customFilterPredicate();
    // }, 100);
  }

  /**
  * Method that matches string of search bar with table content
  * @param filter 
  */
  globalSearch(filter) {
    this.globalFilter = filter;
    this.itemsList.filter = JSON.stringify(this.filteredValues);
  }

  /**
   * Method that filters data based on search strings and filters
   * @returns boolean
   */
  customFilterPredicate() {
    const filterPredicate = (data: any, filter: string): boolean => {
      if (this.globalFilter) {
        // search all text fields
        return data.veg.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.itemName.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.inStock.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.status.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.type.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1;
      }
      let filteredData = JSON.parse(filter);
      return data.veg.trim().toLowerCase().indexOf(filteredData.veg.toLowerCase()) !== -1 &&
        data.inStock.trim().toLowerCase().indexOf(filteredData.inStock.toLowerCase()) !== -1 &&
        data.status.trim().toLowerCase().indexOf(filteredData.status.toLowerCase()) !== -1 &&
        data.type.trim().toLowerCase().indexOf(filteredData.type.toLowerCase()) !== -1;
    }
    return filterPredicate;
  }

  /**
   * Method that filters table data based on user choice from dropdowns
   */
  applyFilter() {
    this.filterVeg ? this.filteredValues['veg'] = this.filterVeg : this.filteredValues['id'] = '';
    // this.filterInStock ? this.filteredValues['inStock'] = this.filterInStock : this.filteredValues['inStock'] = '';
    this.filterStatus ? this.filteredValues['status'] = this.filterStatus : this.filteredValues['status'] = '';
    // this.filterType ? this.filteredValues['type'] = this.filterType : this.filteredValues['type'] = '';

    this.itemsList.filter = JSON.stringify(this.filteredValues);

    this.itemsList.filterPredicate = this.customFilterPredicate();
  }

  /**
   * Method that clear all the filters from the table
   */
  clearFilter(fieldName: string) {
    if (fieldName === 'veg') {
      this.filterVeg = null;
      this.filteredValues['veg'] = '';
    }
    else if (fieldName === 'inStock') {
      // this.filterInStock = null;
      this.filteredValues['inStock'] = '';
    }
    else if (fieldName === 'status') {
      this.filterStatus = null;
      this.filteredValues['status'] = '';
    }
    else if (fieldName === 'type') {
      // this.filterType = null;
      this.filteredValues['type'] = '';
    }
    else {
      // this.filterVeg = this.filterInStock = this.filterStatus = this.filterType = null;
      this.showFilterFields = false;
      this.filteredValues['veg'] = '';
      this.filteredValues['inStock'] = '';
      this.filteredValues['status'] = '';
      this.filteredValues['type'] = '';
    }
    this.itemsList.filter = JSON.stringify(this.filteredValues);
  }
}
