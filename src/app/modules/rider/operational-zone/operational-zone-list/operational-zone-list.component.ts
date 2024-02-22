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
import { FilterOperationalZone, IOpZoneEventEmitter, OperationalZone, OpZoneAction, OpZoneStatus } from '../model/operational-zone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-operational-zone-list',
  templateUrl: './operational-zone-list.component.html',
  styleUrls: ['./operational-zone-list.component.scss']
})
export class OperationalZoneListComponent implements OnInit {

  opZoneList: MatTableDataSource<OperationalZone> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'opCityName', 'bannerFactorUpperLimit', 'bannerFactorLowerLimit', 'isDeleted', 'status', 'action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalRecords: number;
  showFilterFields: boolean;
  readonly opZoneStatus = OpZoneStatus;
  readonly originalOrder = originalOrder;
  filterOpZoneFields: FilterOperationalZone = new FilterOperationalZone();

  @Output() showMap: EventEmitter<IOpZoneEventEmitter> = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private riderService: RiderService, private toastMsgService: ToastService, private dialog: MatDialog, private activeRoute: ActivatedRoute) { 
    if (Object.keys(activeRoute.snapshot.queryParams).length) {
      this.showFilterFields = true;
      const queryParams = activeRoute.snapshot.queryParams;
      this.filterOpZoneFields.id = queryParams.operationalZoneId;
    }
  }

  ngOnInit(): void {
    this.getOperationalZone();
  }

  /**
   * Method that filters operational zone
   * @param filterFlag 
   */
  getOperationalZone(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterOpZoneFields.pageIndex = this.pageIndex;
    this.filterOpZoneFields.pageSize = this.pageSize;
    const data = this.filterOpZoneFields.toJson();
    this.riderService.filterOperationalZone(data).subscribe(res => {
      this.opZoneList.data = [];
      if (this.pageIndex === 0) this.totalRecords = res['result']['total_records'];
      for (const i of res['result']['records']) {
        this.opZoneList.data.push(OperationalZone.fromJson(i));
      }
      this.opZoneList.sort = this.sort;
    })
  }

  /**
   * Method that updates status for the operational zone
   * @param zone 
   */
  changeStatus(zone: OperationalZone) {
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
        this.riderService.updateOperationalZone(zone.id, data).subscribe(res => {
          zone['status'] = data['status'];
          this.toastMsgService.showSuccess('status is updated successfully');
        })
      }
    })
  }

  /**
   * Method that deletes operational zone
   */
  deleteOperationalZone(zone: OperationalZone) {
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
        this.riderService.deleteOperationalZone(zone.id).subscribe(res => {
          this.toastMsgService.showSuccess('zone is deleted successfully');
          this.getOperationalZone();
        })
      }
    })
  }

  /**
   * Method that emits event to show map view with details if any
   * @param action 
   * @param zone 
   */
  goToMap(action: OpZoneAction, zoneDetails?: OperationalZone) {
    this.showMap.emit({action, zoneDetails});
  }

  /**
  * Method that invokes on page change
  * @param event 
  */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getOperationalZone();
  }

  /**
 * Method that clear filter params
 * @param fieldName 
 */
  clearFilter(fieldName: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterOpZoneFields = new FilterOperationalZone();
    }
    this.getOperationalZone();
  }

}
