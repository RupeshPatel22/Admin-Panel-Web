import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AddCuisineDialogComponent } from './add-cuisine-dialog/add-cuisine-dialog.component';
import { Cuisine, FilterCuisine } from './modal/cuisines';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { Services } from 'src/app/shared/models';

@Component({
  selector: 'app-cuisines',
  templateUrl: './cuisines.component.html',
  styleUrls: ['./cuisines.component.scss'],
})
export class CuisinesComponent implements OnInit {
  cuisinesList: MatTableDataSource<Cuisine>;
  displayedColumns: string[] = ['sr no', 'cusineImg', 'cuisineDetails', 'status','ageRestricted', 'actions'];
  showFilterFields: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  search = new FormControl();
  cuisinesDataArr: Cuisine[] = [];
  globalFilter: string;
  filterCuisineFields: FilterCuisine = new FilterCuisine();
  isToggle = true;
  cusinieStatus: string;
  statuses = {
    active: 'Active',
    in_active: 'Inactive'
  }
  readonly Services = Services;
  service: string;
  constructor(
    private dataDumpService: DataDumpService,
    private dialog: MatDialog,
    private toastMsgService: ToastService,
    private outletsService: OutletsService
  ) { }

  ngOnInit(): void {
    this.service = this.outletsService.service;
    this.setCuisinesList();
    if(this.service === Services.Paan) {
      this.displayedColumns = ['sr no', 'cusineImg', 'cuisineDetails', 'status','ageRestricted', 'actions'];
    }else{
      this.displayedColumns = ['sr no', 'cusineImg', 'cuisineDetails', 'status', 'actions'];
    }
  }

  /**
   * Method that sets cuisines list by API call
   */
  setCuisinesList() {
    this.dataDumpService.getCuisinesList().subscribe((data) => {
      if (data['status'] === true) {
        this.cuisinesDataArr = [];
        for (const c of data['result']) {
          this.cuisinesDataArr.push(Cuisine.fromJson(c));
        }
        this.cuisinesList = new MatTableDataSource(this.cuisinesDataArr);
        this.cuisinesList.paginator = this.paginator;
        this.cuisinesList.sort = this.sort;
        this.cuisinesList.filterPredicate = this.customFilterPredicate();
      }
    });
  }

  /**
   * Method that updates the status of the cuisine
   * @param cuisine 
   */
  changeStatus(cuisine: Cuisine) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to update the status of the Cuisine, ${cuisine.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        const data = {
          name: cuisine.name,
          status: cuisine.status === 'active' ? 'in_active' : 'active'
        }
          ;
        this.dataDumpService.updateCuisine(cuisine.id, data).subscribe(res => {
          cuisine.status = data['status'];
        });
      }
    })
  }

  /**
   * Method that deletes area based on user selection
   * @param row
   */
  deleteCuisine(row: Cuisine) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to delete ${row.name}`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel',
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.dataDumpService.deleteCuisine(row.id).subscribe((res) => {
          this.setCuisinesList();
        });
      }
    });
  }

  /**
   * Method that opens cuisine dialog and add/update cuisine
   * @param cuisine 
   */
  openCuisineDialog(cuisine?: Cuisine) {
    const dialogRef = this.dialog.open(AddCuisineDialogComponent, {
      autoFocus: false,
      data: cuisine
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        if (!cuisine) {
          this.dataDumpService.addNewCuisine(response.dataToSend).subscribe((res) => {
            this.setCuisinesList();
          });
        } else {
          this.dataDumpService.updateCuisine(cuisine.id, response.dataToSend).subscribe((res) => {
            this.setCuisinesList();
          });
        }
      }
    });
  }

  /**
   * Method that matches string of search bar with table content
   * @param filter
   */
  globalSearch(filter) {
    this.globalFilter = filter;
    this.cuisinesList.filter = JSON.stringify(this.filterCuisineFields);
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
      let filteredData: FilterCuisine = JSON.parse(filter);
      for (const i in filteredData) {
        if (!filteredData[i]) filteredData[i] = '';
      }
      return (
        data.id.trim().toLowerCase().indexOf(filteredData.id.toLowerCase()) !==
        -1 &&
        data.name
          .trim()
          .toLowerCase()
          .indexOf(filteredData.cuisine.toLowerCase()) !== -1 &&
        data.status
          .trim()
          .toLowerCase()
          .indexOf(filteredData.status.toLowerCase()) !== -1
      );
    };
    return filterPredicate;
  }

  /**
   * Method that filters table data based on user choice from dropdowns
   */
  applyFilter() {
    this.cuisinesList.filter = JSON.stringify(this.filterCuisineFields);
    this.cuisinesList.filterPredicate = this.customFilterPredicate();
  }

  /**
   * Method that clear all the filters from the table
   */
  clearFilter(fieldName: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterCuisineFields = new FilterCuisine();
    }
    this.cuisinesList.filter = JSON.stringify(this.filterCuisineFields);
  }
}
