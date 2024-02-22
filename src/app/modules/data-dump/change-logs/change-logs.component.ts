import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { pageSize, pageSizeOptions, Services } from 'src/app/shared/models'
import {
  FilterChangeLog,
  HttpMethodsList,
  ChangeLog,
  UserTypesList
} from './model/change-log'
import { DataDumpService } from 'src/app/shared/services/data-dump.service'

@Component({
  selector: 'app-change-logs',
  templateUrl: './change-logs.component.html',
  styleUrls: ['./change-logs.component.scss']
})
export class ChangeLogsComponent implements OnInit {

  logsList: MatTableDataSource<ChangeLog> = new MatTableDataSource()
  totalLogRecords: number
  showFilterFields: boolean
  pageSizeOptions = pageSizeOptions
  pageIndex: number = 0
  pageSize: number = pageSize
  displayedColumns = [
    'id',
    'url',
    'ipAddr',
    'httpMethods',
    'responseCode',
    'userId',
    'entityType',
    'createdAt',
    'action'
  ]
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  filterLogData: FilterChangeLog = new FilterChangeLog()
  readonly httpMethodsList = HttpMethodsList;
  userTypesList: any;
  responseCodeNumber: number[] = Array.from({ length: 200 }, (_, index) => index + 200);
  expandedRow: number

  constructor(private dataDumpService: DataDumpService) { }
  ngOnInit(): void {
    this.getChangesLogList();
    if ([Services.PND, Services.User, Services.Rider].some(service => service === this.dataDumpService.service)) {
      this.userTypesList = { admin: 'Admin' };
    } else {
      this.userTypesList = UserTypesList;
    }
  }

  /**
   * Method that gets all changes logs
   */
  getChangesLogList(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0
      this.paginator.pageIndex = 0
    }
    this.filterLogData.pageIndex = this.pageIndex
    this.filterLogData.pageSize = this.pageSize
    const data = this.filterLogData.toJson()
    this.dataDumpService.postChangesLog(data).subscribe(res => {
      this.totalLogRecords = res['result']['total_records']
      this.logsList.data = []
      for (const i of res['result']['records']) {
        this.logsList.data.push(ChangeLog.fromJson(i))
      }
      this.logsList.sort = this.sort
    })
  }

  /**
   * Method that is called when page change event is fired
   * @param event
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.getChangesLogList()
  }

  /**
   * Method that is called when filter/filters are cleared
   * @param fieldName
   */
  clearFilter(fieldName) {
    if (fieldName === 'all') {
      this.showFilterFields = false
      this.filterLogData = new FilterChangeLog()
    } else {
      this.filterLogData[fieldName] = ''
    }
    this.getChangesLogList()
  }
}
