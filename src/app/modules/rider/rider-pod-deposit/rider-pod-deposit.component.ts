import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { dateLongTimeFormat, pageSize, pageSizeOptions } from 'src/app/shared/models';
import { RiderService } from 'src/app/shared/services/rider.service';
import { DepositMethodList, FilterRiderPodDeposit, RiderPodDeposit } from './model/rider-pod-deposit';

@Component({
  selector: 'app-rider-pod-deposit',
  templateUrl: './rider-pod-deposit.component.html',
  styleUrls: ['./rider-pod-deposit.component.scss']
})
export class RiderPodDepositComponent implements OnInit {

  riderPodDepositsList: MatTableDataSource<RiderPodDeposit> = new MatTableDataSource();
  displayedColumns: string[] = [
    'id',
    'riderName',
    'amount',
    'depositMethod',
    'remarks',
    'collectedBy',
    'createdAt',
    'action',
  ];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalRecords: number;
  showFilterFields: boolean;
  filterRiderDepositFields: FilterRiderPodDeposit = new FilterRiderPodDeposit();
  readonly depositMethodList = DepositMethodList;
  readonly dateLongTimeFormat = dateLongTimeFormat;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private riderService: RiderService) { }

  ngOnInit(): void {
    this.getRiderPodDeposits();
  }

  getRiderPodDeposits(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterRiderDepositFields.pageIndex = this.pageIndex;
    this.filterRiderDepositFields.pageSize = this.pageSize;
    const data = this.filterRiderDepositFields.toJson();
    this.riderService.filterRiderPodDepoist(data).subscribe(res => {
      this.totalRecords = res['result']['total_records'];
      this.riderPodDepositsList.data = [];
      for (const i of res['result']['records']) {
        this.riderPodDepositsList.data.push(RiderPodDeposit.fromJson(i));
      }
      this.riderPodDepositsList.sort = this.sort;
    })
  }


  /**
   * Method that invokes on page change
   * @param event
   */
   onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getRiderPodDeposits();
  }
  /**
   * Method that clear filter params
   * @param fieldName
   */
  clearFilter(fieldName: 'all' | 'startDate' | 'endDate') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterRiderDepositFields = new FilterRiderPodDeposit();
    }
    else if (fieldName === 'startDate') this.filterRiderDepositFields.startDate = null;
    else if (fieldName === 'endDate') this.filterRiderDepositFields.endDate = null;
    this.getRiderPodDeposits();
  }
}
