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
import { BlackZone, BlackZoneAction, BlackZoneDurationType, BlackZoneStatus, FilterBlackZone, IBlackZoneEventEmitter } from '../model/black-zone';

@Component({
  selector: 'app-black-zone-list',
  templateUrl: './black-zone-list.component.html',
  styleUrls: ['./black-zone-list.component.scss']
})
export class BlackZoneListComponent implements OnInit {

  blackZoneList: MatTableDataSource<BlackZone> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'opCityName', 'durationType', 'description', 'isDeleted', 'status', 'action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalRecords: number;
  showFilterFields: boolean;
  readonly blackZoneStatus = BlackZoneStatus;
  readonly blackZoneDurationType = BlackZoneDurationType;
  readonly originalOrder = originalOrder;
  filterBlackZoneFields: FilterBlackZone = new FilterBlackZone();

  @Output() showMap: EventEmitter<IBlackZoneEventEmitter> = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private riderService: RiderService, private toastMsgService: ToastService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getBlackZone();
  }

  /**
   * Method that filters black zone
   * @param filterFlag 
   */
   getBlackZone(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterBlackZoneFields.pageIndex = this.pageIndex;
    this.filterBlackZoneFields.pageSize = this.pageSize;
    const data = this.filterBlackZoneFields.toJson();
    this.riderService.filterBlackZone(data).subscribe(res => {
      this.blackZoneList.data = [];
      if (this.pageIndex === 0) this.totalRecords = res['result']['total_records'];
      for (const i of res['result']['records']) {
        this.blackZoneList.data.push(BlackZone.fromJson(i));
      }
      this.blackZoneList.sort = this.sort;
    })
  }

  /**
   * Method that updates status for the black zone
   * @param zone 
   */
  changeStatus(zone: BlackZone) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to change status for zone: ${zone.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const data = {
          status: zone.status === 'enable' ? 'disable' : 'enable'
        }
        this.riderService.updateBlackZone(zone.id, data).subscribe(res => {
          zone['status'] = data['status'];
          this.toastMsgService.showSuccess('status is updated successfully');
        })
      }
    })
  }

  /**
   * Method that deletes black zone
   */
  deleteBlackZone(zone: BlackZone) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to delete the zone: ${zone.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.riderService.deleteBlackZone(zone.id).subscribe(res => {
          this.toastMsgService.showSuccess('zone is deleted successfully');
          this.getBlackZone();
        })
      }
    })
  }

  /**
   * Method that emits event to show map view with details if any
   * @param action 
   * @param zone 
   */
  goToMap(action: BlackZoneAction, zoneDetails?: BlackZone) {
    this.showMap.emit({action, zoneDetails});
  }

  /**
  * Method that invokes on page change
  * @param event 
  */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getBlackZone();
  }

  /**
 * Method that clear filter params
 * @param fieldName 
 */
  clearFilter(fieldName: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterBlackZoneFields = new FilterBlackZone();
    }
    this.getBlackZone();
  }

}
