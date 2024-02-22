import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ApprovalStatusList, FilterRider, Rider, RiderStatusList, RiderTypeList } from './model/rider-lists';
import { downloadFile, originalOrder } from 'src/app/shared/functions/modular.functions';

@Component({
  selector: 'app-rider-lists',
  templateUrl: './rider-lists.component.html',
  styleUrls: ['./rider-lists.component.scss']
})
export class RiderListsComponent implements OnInit {

  riderList: MatTableDataSource<Rider> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'phone', 'isBlocked','type', 'status', 'action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalRiderRecords: number;
  showFilterFields: boolean;
  filterRiderFields: FilterRider = new FilterRider();
  readonly riderStatusList = RiderStatusList;
  readonly approvalStatusList = ApprovalStatusList;
  readonly riderTypeList = RiderTypeList;
  readonly originalOrder = originalOrder;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private riderService: RiderService, private toastMsgService: ToastService, private router: Router, ) { }

  ngOnInit(): void {
    this.getRiderList();
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
  /**
   * Method that make api call to block/unblock rider after event is emitted from rider-details component
   * @param event 
   */
  takeAction(event) {
    const rider = this.riderList.data.filter(r => r.id === event.riderId);
    if (event.action === 'block') {
      const data = {
        blocked_reason: event.reason
      }
      this.riderService.postBlockRider(rider[0]['id'], data).subscribe(res => {
        rider[0]['status'] = res['result']['active_status'];
        rider[0]['blockedBy'] = res['result']['blocked_by'];
        rider[0]['blockedReason'] = res['result']['blocked_reason'];
        rider[0]['isBlocked'] = !rider[0]['isBlocked'];
        this.toastMsgService.showSuccess('Rider is blocked successfully');
      })
    }
    if (event.action === 'un-block') {
      this.riderService.postUnBlockRider(rider[0]['id']).subscribe(res => {
        rider[0]['isBlocked'] = !rider[0]['isBlocked'];
        this.toastMsgService.showSuccess('Rider is un-blocked successfully');
      })
    }
  }
  /**
   * Method that navigates to rider-orders page to show orders with that rider
   * @param riderId 
   */
  navigateToRiderOrdersPage(riderId: string) {
    this.router.navigate(['rider/orders'], { queryParams: { riderId } })
  }

  /**
   * Method to download filtered riders in csv
   */
  exportRidersInCsv() {
    const data = this.filterRiderFields.toJson();
    data['filter']['in_csv'] = true;
    this.riderService.downloadCsvFile('riders', data).subscribe(
      res => {
        downloadFile(res, 'riders');
      });
  }

}
