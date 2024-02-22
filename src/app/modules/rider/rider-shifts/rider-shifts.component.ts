import { AllRiderShifts, FilterAllRidersShift, ISettleShift } from './model/rider-shifts';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { dateLongTimeFormat, pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { RiderService } from 'src/app/shared/services/rider.service';
import { Router } from '@angular/router';
import { downloadFile } from 'src/app/shared/functions/modular.functions';
import { RiderStatusList } from '../rider-lists/model/rider-lists';

@Component({
  selector: 'app-rider-shifts',
  templateUrl: './rider-shifts.component.html',
  styleUrls: ['./rider-shifts.component.scss']
})
export class RiderShiftsComponent implements OnInit {
  filterAllRidersShift: FilterAllRidersShift = new FilterAllRidersShift();
  allRidersShiftList: MatTableDataSource<AllRiderShifts> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'riderId', 'type', 'shiftName', 'firstPingEpoch', 'lastPingEpoch','riderStatus', 'uptimeSeconds', 'downtimeSeconds', 'stopPayout', 'action'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalAllRidersShiftRecords: number;
  pageHeading: string = 'Rider Shifts';
  showFilterFields: boolean;
  settlementStatus: string[] = [];
  readonly dateLongTimeFormat = dateLongTimeFormat;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly riderStatusList = RiderStatusList;

  constructor(private riderService: RiderService, private router: Router) { }

  ngOnInit(): void {
    this.getAllRidersShiftData();
  }
  /**
     * Method that gets shifts list
     * @param filterFlag 
     */
  getAllRidersShiftData(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterAllRidersShift.pageIndex = this.pageIndex;
    this.filterAllRidersShift.pageSize = this.pageSize;
    const data = this.filterAllRidersShift.toJson();
    this.riderService.filterAllRidersShift(data).subscribe(res => {
      this.totalAllRidersShiftRecords = res['result']['total_records'];
      this.allRidersShiftList.data = [];
      for (const i of res['result']['records']) {
        this.allRidersShiftList.data.push(AllRiderShifts.fromJson(i));
      }
      this.allRidersShiftList.sort = this.sort;
    })
  }
  /**
   * Method that invokes on page change
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllRidersShiftData();
  }

  /**
   * Method that settles shift payout
   * @param settleShiftData 
   */
  settleRiderShift(settleShiftData: ISettleShift) {
    const data = {
      payout_amount: settleShiftData.payoutAmt,
      settlement_message: settleShiftData.settlementMsg
    }
    this.riderService.settleRiderShift(settleShiftData.riderShiftId, data).subscribe(res => {
      this.getAllRidersShiftData();
    })
  }

  /**
   * Method that navigates to rider-orders page to show orders with that riderShiftId
   * @param payoutId 
   */
   navigateToRiderOrdersPage(riderId: number) {
    this.router.navigate(['rider/orders'], { queryParams: { riderId } })
  }
  /**
   * Method that clear filter params
   * @param fieldName 
   */
  clearFilter(fieldName: 'all' | 'startDate' | 'endDate') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterAllRidersShift = new FilterAllRidersShift();
    } else if (fieldName === 'startDate') this.filterAllRidersShift.startDate =  null;
      else if(fieldName === 'endDate') this.filterAllRidersShift.endDate = null;
    this.getAllRidersShiftData();
  }

  /**
   * Method to download filtered rider shifts in csv
   */
  exportRiderShiftsInCsv() {
    const data = this.filterAllRidersShift.toJson();
    data['filter']['in_csv'] = true;
  
    this.riderService.downloadCsvFile('ridersShifts', data).subscribe(
      res => {
        downloadFile(res, 'rider shifts');
      });
  }

  navigateToRiderPingLogs(riderShiftId: string, riderId: string, riderName: string) {
    this.router.navigate(['rider/rider-ping-logs'], { queryParams: { riderShiftId, riderId, riderName }});
  }
}
