import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { dateLongTimeFormat, pageSize, pageSizeOptions } from 'src/app/shared/models';
import { CityAreaService } from 'src/app/shared/services/city-area.service';
import { ClientAppType, ClientLog, ClientLogLevel, FilterClientLog, UserType } from './model/client-log';

@Component({
  selector: 'app-client-logs',
  templateUrl: './client-logs.component.html',
  styleUrls: ['./client-logs.component.scss']
})
export class ClientLogsComponent implements OnInit {

  clientLogsList: MatTableDataSource<ClientLog> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'userType', 'level', 'ipAddr', 'clientApp', 'deviceDetails', 'code', 'message', 'data', 'createdAt'];
  pageIndex: number = 0;
  pageSize: number = pageSize;
  totalRecords: number;
  showFilterFields: boolean;
  currentDate = new Date();
  filterClientLogsFields: FilterClientLog = new FilterClientLog();
  readonly pageSizeOptions = pageSizeOptions;
  readonly dateLongTimeFormat = dateLongTimeFormat;
  readonly originalOrder = originalOrder;
  readonly userType = UserType;
  readonly clientAppType = ClientAppType;
  readonly clientLogLevel = ClientLogLevel;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private cityAreaService: CityAreaService) { }

  ngOnInit(): void {
    this.getClientLogs();
  }

  /**
   * Method that gets client logs based on filter params
   * @param filterFlag 
   */
  getClientLogs(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterClientLogsFields.pageIndex = this.pageIndex;
    this.filterClientLogsFields.pageSize = this.pageSize;
    const data = this.filterClientLogsFields.toJson();
    this.cityAreaService.filterClientLogs(data).subscribe(res => {
      if (this.pageIndex === 0) this.totalRecords = res['result']['total_records'];
      this.clientLogsList.data = [];
      for (const i of res['result']['records']) {
        this.clientLogsList.data.push(ClientLog.fromJson(i));
      }
      this.clientLogsList.sort = this.sort;
    })
  }

  /**
   * Method that invokes on page change
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getClientLogs();
  }

  /**
   * Method that clears filter params
   * @param fieldName 
   */
  clearFilter(fieldName?: 'all' | 'date') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterClientLogsFields = new FilterClientLog();
    }
    if (fieldName === 'date') {
      this.filterClientLogsFields.startDate = this.filterClientLogsFields.endDate = null;
    }
    this.getClientLogs();
  }

}
