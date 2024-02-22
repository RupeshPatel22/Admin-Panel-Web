// import {
//   RiderPodCollections,
//   FilterRiderPodCollection,
//   DeliveryStatusList,
//   RiderTypeList,
// } from './../model/rider';

import { Component, OnInit, ViewChild } from '@angular/core';
import { RiderService } from 'src/app/shared/services/rider.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  pageSize,
  pageSizeOptions,
} from 'src/app/shared/models/constants/constant.type';
import { formatNum } from 'src/app/shared/functions/modular.functions';
import { RiderPodCollections, FilterRiderPodCollection } from './model/rider-pod-collection';
import { DeliveryStatusList } from '../rider-orders/model/rider-order';
import { RiderTypeList } from '../rider-lists/model/rider-lists';
import { ToastService } from 'src/app/shared/services/toast.service';
import { validateDate } from 'src/app/shared/functions/common-validation.functions';
import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-rider-pod-collections',
  templateUrl: './rider-pod-collections.component.html',
  styleUrls: ['./rider-pod-collections.component.scss'],
})
export class RiderPodCollectionsComponent implements OnInit {
  riderPodCollectionsList: MatTableDataSource<RiderPodCollections> =
    new MatTableDataSource();
  displayedColumns: string[] = [
    'riderDetails',
    'riderPhone',
    // 'riderActiveStatus',
    'podCollection',
    'totalPodDeposit',
    'cashInHand',
    'action',
  ];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  totalRiderPodCollectionRecords: number;
  pageHeading: string = 'Rider POD Collections';
  // showFilterFields: boolean;
  filterRiderPodCollections: FilterRiderPodCollection =
    new FilterRiderPodCollection();
  readonly deliveryStatusList = DeliveryStatusList;
  readonly riderTypeList = RiderTypeList;
  readonly formatNum = formatNum;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  showPodCollectionReportModal: boolean;
  userAdminEmailId: string;

  constructor(private riderService: RiderService, private toastMsgService: ToastService, private loginService: LoginService) {}
  ngOnInit(): void {
    this.getRiderPodCollections();
    this.userAdminEmailId = localStorage.getItem('email');
  }
  /**
   * Method that gets Rider POD collection list
   * @param filterFlag
   */
  getRiderPodCollections(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterRiderPodCollections.pageIndex = this.pageIndex;
    this.filterRiderPodCollections.pageSize = this.pageSize;
    const data = this.filterRiderPodCollections.toJson();
    this.riderService.filterRiderPodCollections(data).subscribe((res) => {
      if (this.pageIndex === 0) {
        this.totalRiderPodCollectionRecords = res['result']['total_records'];
      }
      this.riderPodCollectionsList.data = [];
      for (const i of res['result']['records']) {
        this.riderPodCollectionsList.data.push(RiderPodCollections.fromJson(i));
      }
      this.riderPodCollectionsList.sort = this.sort;
    });
  }
  /**
   * Method that invokes on page change
   * @param event
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getRiderPodCollections();
  }
  /**
   * Method that clear filter params
   * @param fieldName
   */
  // clearFilter(fieldName: 'all' | 'startDate' | 'endDate') {
  //   if (fieldName === 'all') {
  //     this.showFilterFields = false;
  //     this.filterRiderPodCollections = new FilterRiderPodCollection();
  //   }
  //   else if (fieldName === 'startDate') this.filterRiderPodCollections.startDate = null;
  //   else if (fieldName === 'endDate') this.filterRiderPodCollections.endDate = null;
  // }

  /**
   * Method to download filtered pod collection in csv
   */
  exportPodCollectionInCsv() {
    const errorMsg = validateDate(this.filterRiderPodCollections.startDate, this.filterRiderPodCollections.endDate);
    if (errorMsg) {
      this.toastMsgService.showError(errorMsg);
      return
    }
    const data = this.filterRiderPodCollections.toJsonCSV();
    this.riderService.emailPodCollectionCsvFile(data).subscribe(
      res => {
        this.toastMsgService.showSuccess(`Report has been sent to ${this.userAdminEmailId}`)
      });
      this.showPodCollectionReportModal = false;
  }

  /**
   * Method that toggles for opening and closing the POD Collection CSV report Modal
   */
  togglePodCollectionCsvModal() {
    this.showPodCollectionReportModal = !this.showPodCollectionReportModal;
    this.filterRiderPodCollections = new FilterRiderPodCollection();
  }
  
}
