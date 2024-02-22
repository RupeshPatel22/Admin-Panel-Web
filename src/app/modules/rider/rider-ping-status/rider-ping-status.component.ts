import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
import { RiderService } from 'src/app/shared/services/rider.service';
import { FilterRider, Rider, RiderOfflineReasonsList, RiderPingStatusList, RiderStatusList, RiderTypeList } from '../rider-lists/model/rider-lists';

@Component({
  selector: 'app-rider-ping-status',
  templateUrl: './rider-ping-status.component.html',
  styleUrls: ['./rider-ping-status.component.scss']
})
export class RiderPingStatusComponent implements OnInit {

  riderList: MatTableDataSource<Rider> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'phone', 'type', 'status','pingStatus','pingStatusUpdatedAt', 'lastOfflineAt','offlineReason'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalRiderRecords: number;
  showFilterFields: boolean;
  filterRiderFields: FilterRider = new FilterRider();
  readonly riderStatusList = RiderStatusList;
  readonly riderTypeList = RiderTypeList;
  readonly riderPingStatusList = RiderPingStatusList;
  readonly originalOrder = originalOrder;
  readonly riderOfflineReasonsList = RiderOfflineReasonsList;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private riderService: RiderService) { 
    
  }

  ngOnInit(): void {
    this.getRiderList();
    this.filterRiderFields.offlineReason = ['ping_not_received','out_of_operational_zone'];
  }

  /**
   * Method that gets all riders list
   * @param filterFlag 
   */
   getRiderList(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterRiderFields.pageIndex = this.pageIndex;
    this.filterRiderFields.pageSize = this.pageSize;
    if (!this.filterRiderFields.riderPingStatus.length) this.filterRiderFields.riderPingStatus = ['warning', 'offline'];
    this.filterRiderFields.offlineReason = ['ping_not_received','out_of_operational_zone'];
    const data = this.filterRiderFields.toJson();
    this.riderService.filterRiderList(data).subscribe(res => {
      this.riderList.data = [];
      this.totalRiderRecords = res['result']['total_records'];
      for (const i of res['result']['records']) {
        this.riderList.data.push(Rider.fromJson(i));
      }
      this.riderList.sort = this.sort;
    })
  }
  
  /**
   * Method that invokes on page change
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getRiderList();
  }

  /**
   * Method that clear filter params
   * @param fieldName 
   */
  clearFilter(fieldName: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterRiderFields = new FilterRider();
    }
    this.getRiderList();
  }
}
