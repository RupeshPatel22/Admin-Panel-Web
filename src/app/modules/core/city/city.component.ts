import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { CityAreaService } from 'src/app/shared/services/city-area.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AddCityDialogComponent } from './add-city-dialog/add-city-dialog.component';
import { FilterCity } from './modal/city';
@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent implements OnInit {
  showFilterFields: boolean;
  cityList: MatTableDataSource<any>;
  displayedColumns: string[] = ['sr no', 'name', 'status'];
  cityDataArr = [];
  globalFilter: string;
  filterCityFields: FilterCity = new FilterCity();
  isToggle = true;
  cityStatus: string;
  pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private cityAreaService: CityAreaService,
    private dialog: MatDialog,
    private toastMsgService: ToastService,
  ) { }
  ngOnInit() {
    this.setCityList();
  }
  /**
   * Method that calls city list API from city-area service
   */
  setCityList() {
    this.cityAreaService.getCityList().subscribe((data) => {
      if (data['status'] === true) {
        this.cityDataArr = [];
        for (const c of data['result']) {
          this.cityDataArr.push(c);
        }
        this.cityList = new MatTableDataSource(this.cityDataArr);
        this.cityList.paginator = this.paginator;
        this.cityList.sort = this.sort;
        this.cityList.filterPredicate = this.customFilterPredicate();
      }
    });
  }
  /**
   * Method that matches string of search bar with table content
   * @param filter
   */
  globalSearch(filter) {
    this.globalFilter = filter;
    this.cityList.filter = JSON.stringify(this.filterCityFields);
  }
  /**
   * Method that filters data based on search strings and filters
   * @returns boolean
   */
  customFilterPredicate() {
    const filterPredicate = (data: any, filter: string): boolean => {
      if (this.globalFilter) {
        // search all text fields
        return (
          data.id
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.name
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.status
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1
        );
      }
      let filteredData: FilterCity = JSON.parse(filter);
      for (const i in filteredData) {
        if (!filteredData[i]) filteredData[i] = '';
      }
      return (
        data.id.trim().toLowerCase().indexOf(filteredData.id.toLowerCase()) !==
        -1 &&
        data.name
          .trim()
          .toLowerCase()
          .indexOf(filteredData.city.toLowerCase()) !== -1 &&
        data.status
          .trim()
          .toLowerCase()
          .indexOf(filteredData.status.toLowerCase()) !== -1
      );
    };
    return filterPredicate;
  }
  /**
   * Method that filters table data based on user choice from id,city,status dropdown
   */
  applyFilter() {
    this.cityList.filter = JSON.stringify(this.filterCityFields);
    this.cityList.filterPredicate = this.customFilterPredicate();
  }

  /**
   * Method that clear all the filters from the table
   */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterCityFields = new FilterCity();
    }
    this.cityList.filter = JSON.stringify(this.filterCityFields);
  }
  /**
   * Method that calls the add city dialog
   */
  openAddCityDialog() {
    const dialogRef = this.dialog.open(AddCityDialogComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const data = {
          name: response.cityName,
          status: 'active',
        };
        this.cityAreaService.addNewCity(data).subscribe((res) => {
          this.setCityList();
          this.toastMsgService.showSuccess('New city added !!!');
        });
      }
    });
  }
  /**
   * Method that changes the status of the city
   */
  changeStatus(city: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to update the status of the city, ${city.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        city.status === 'active' ? city.status = 'inactive' : city.status = 'active';
        this.cityAreaService.updateCity(city.id, city).subscribe();
        this.toastMsgService.showSuccess(`City: ${city.name}'s status updated !!!`);
      }
    })
  }
  deleteCity(city: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to delete the city, ${city.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.cityAreaService.deleteCity(city.id).subscribe(res => {
          this.setCityList();
          this.toastMsgService.showSuccess(`City: ${city.name} is deleted !!!`);
        });
      }
    })
  }
}
