import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FilterOperationalCity, IOpCityEventEmitter, OpCityAction, OpCityStatus, OperationalCity } from '../model/operational-city';

@Component({
  selector: 'app-operational-city-list',
  templateUrl: './operational-city-list.component.html',
  styleUrls: ['./operational-city-list.component.scss']
})
export class OperationalCityListComponent implements OnInit {

  opCityList: MatTableDataSource<OperationalCity> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'isDeleted', 'status', 'action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalRecords: number;
  showFilterFields: boolean;
  showMapForPolygon: boolean;
  readonly opCityStatus = OpCityStatus;
  readonly originalOrder = originalOrder;
  filterOpCityFileds: FilterOperationalCity = new FilterOperationalCity();

  @Output() showMap: EventEmitter<IOpCityEventEmitter> = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private riderService: RiderService, private toastMsgService: ToastService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOperationalCity();
  }

  /**
   * Method that filters operational city
   * @param filterFlag 
   */
  getOperationalCity(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterOpCityFileds.pageIndex = this.pageIndex;
    this.filterOpCityFileds.pageSize = this.pageSize;
    const data = this.filterOpCityFileds.toJson();
    this.riderService.filterOperationalCity(data).subscribe(res => {
      this.opCityList.data = [];
      if (this.pageIndex === 0) this.totalRecords = res['result']['total_records'];
      for (const i of res['result']['records']) {
        this.opCityList.data.push(OperationalCity.fromJson(i));
      }
      this.opCityList.sort = this.sort;
    })
  }

  /**
   * Method that updates status for the operational city
   * @param city 
   */
  changeStatus(city: OperationalCity) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to change status for city: ${city.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const data = {
          status: city.status === 'enable' ? 'disable' : 'enable'
        }
        this.riderService.updateOperationalCity(city.id, data).subscribe(res => {
          city['status'] = data['status'];
          this.toastMsgService.showSuccess('status is updated successfully');
        })
      }
    })
  }

  /**
   * Method that deletes operational city
   */
  deleteOperationalCity(city: OperationalCity) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to delete the city: ${city.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.riderService.deleteOperationalCity(city.id).subscribe(res => {
          this.toastMsgService.showSuccess('city is deleted successfully');
          this.getOperationalCity();
        })
      }
    })
  }

  /**
   * Method that emits event to show map view with details if any
   * @param action 
   * @param cityDetails 
   */
   goToMap(action: OpCityAction, cityDetails?: OperationalCity) {
    this.showMap.emit({action, cityDetails});
  }

  /**
  * Method that invokes on page change
  * @param event 
  */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getOperationalCity();
  }

  /**
 * Method that clear filter params
 * @param fieldName 
 */
  clearFilter(fieldName: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterOpCityFileds = new FilterOperationalCity();
    }
    this.getOperationalCity();
  }

}
