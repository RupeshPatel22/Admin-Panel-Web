import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent implements OnInit {
  restaurantList: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'restaurantName', 'commission', 'gstNumber', 'action'];

  showFilterFields: boolean;
  ELEMENT_DATA = [
    {
      id: '1201',
      restaurantName: 'Restaurant Name',
      commission: '30%',
      gstNumber: '123412341234',
    },
    {
      id: '1202',
      restaurantName: 'Restaurant Name',
      commission: '10%',
      gstNumber: '123412341234',
    },
    {
      id: '1203',
      restaurantName: 'Restaurant Name',
      commission: '10%',
      gstNumber: '123412341234',
    },
    {
      id: '1204',
      restaurantName: 'Restaurant Name',
      commission: '30%',
      gstNumber: '123412341234',
    },
    {
      id: '1205',
      restaurantName: 'Restaurant Name',
      commission: '20%',
      gstNumber: '123412341234',
    },
    {
      id: '1206',
      restaurantName: 'Restaurant Name',
      commission: '10%',
      gstNumber: '123412341234',
    },
    {
      id: '1207',
      restaurantName: 'Restaurant Name',
      commission: '10%',
      gstNumber: '123412341234',
    },
    {
      id: '1208',
      restaurantName: 'Restaurant Name',
      commission: '10%',
      gstNumber: '123412341234',
    },
    {
      id: '1209',
      restaurantName: 'Restaurant Name',
      commission: '20%',
      gstNumber: '123412341234',
    },
  ];

  filteredValues = { id: '', restaurantName: '', commission: '', gstNumber: '' };
  globalFilter: string;
  filterId: string;
  filterRestaurantName: string;
  filterCommission: string;
  filterGstNumber: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  showFinanceModal: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  /**
  * Method that matches string of search bar with table content
  * @param filter 
  */
  globalSearch(filter) {
    this.globalFilter = filter;
    this.restaurantList.filter = JSON.stringify(this.filteredValues);
  }

  /**
   * Method that filters data based on search strings and filters
   * @returns boolean
   */
  customFilterPredicate() {
    const filterPredicate = (data: any, filter: string): boolean => {
      if (this.globalFilter) {
        // search all text fields
        return data.id.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.restaurantName.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.commission.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.gstNumber.trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1;
      }
      let filteredData = JSON.parse(filter);
      return data.id.trim().toLowerCase().indexOf(filteredData.id.toLowerCase()) !== -1 &&
        data.restaurantName.trim().toLowerCase().indexOf(filteredData.restaurantName.toLowerCase()) !== -1 &&
        data.commission.trim().toLowerCase().indexOf(filteredData.commission.toLowerCase()) !== -1 &&
        data.gstNumber.trim().toLowerCase().indexOf(filteredData.gstNumber.toLowerCase()) !== -1;
    }
    return filterPredicate;
  }

  /**
   * Method that filters table data based on user choice from dropdowns
   */
  applyFilter() {
    this.filterId ? this.filteredValues['id'] = this.filterId : this.filteredValues['id'] = '';
    this.filterRestaurantName ? this.filteredValues['restaurantName'] = this.filterRestaurantName : this.filteredValues['restaurantName'] = '';
    this.filterCommission ? this.filteredValues['commission'] = this.filterCommission : this.filteredValues['commission'] = '';
    this.filterGstNumber ? this.filteredValues['gstNumber'] = this.filterGstNumber : this.filteredValues['gstNumber'] = '';

    this.restaurantList.filter = JSON.stringify(this.filteredValues);

    this.restaurantList.filterPredicate = this.customFilterPredicate();
  }

  /**
   * Method that clear all the filters from the table
   */
  clearFilter(fieldName: string) {
    if (fieldName === 'id') {
      this.filterId = null;
      this.filteredValues['id'] = '';
    }
    else if (fieldName === 'restaurantName') {
      this.filterRestaurantName = null;
      this.filteredValues['restaurantName'] = '';
    }
    else if (fieldName === 'commission') {
      this.filterCommission = null;
      this.filteredValues['commission'] = '';
    }
    else if (fieldName === 'gstNumber') {
      this.filterGstNumber = null;
      this.filteredValues['gstNumber'] = '';
    }
    else {
      this.filterId = this.filterRestaurantName = this.filterCommission = this.filterGstNumber = null;
      this.showFilterFields = false;
      this.filteredValues['id'] = '';
      this.filteredValues['restaurantName'] = '';
      this.filteredValues['commission'] = '';
      this.filteredValues['gstNumber'] = '';
    }
    this.restaurantList.filter = JSON.stringify(this.filteredValues);
  }

  /**
   * Method that shows the Finance Detail Modal
   */
  toggleFinanceModal() {
    this.showFinanceModal = !this.showFinanceModal;
  }
}