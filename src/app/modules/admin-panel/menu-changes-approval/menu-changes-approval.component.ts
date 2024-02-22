import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { ApprovalService } from 'src/app/shared/services/approval.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ActionTypes, EntityTypes, FilterMenuChanges, MenuChangesApproval, MenuChangesApprovalStatus } from './model/menu-changes-approval';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-menu-changes-approval',
  templateUrl: './menu-changes-approval.component.html',
  styleUrls: ['./menu-changes-approval.component.scss']
})
export class MenuChangesApprovalComponent implements OnInit {

  menuChangesApprovalList: MatTableDataSource<MenuChangesApproval> = new MatTableDataSource();
  totalMenuChangesApprovalRecords: number;
  pageIndex: number = 0
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  showFilterFields: boolean;
  displayedColumns = ['approvalId', 'outletName', 'actionType', 'entityId', 'entityType', 'approvalStatus', 'remarks','createdAt','action'];
  filterMenuChangesFields: FilterMenuChanges = new FilterMenuChanges();
  readonly actionTypes = ActionTypes;
  readonly entityTypes = EntityTypes;
  approvalStatus: MenuChangesApprovalStatus[] = ['pending'];
  isHistoryTab: boolean;
  maxDate = new Date();
  differentPropsInApprovalData = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private approvalService: ApprovalService, private toastService: ToastService,
     private activeRoute: ActivatedRoute, private sharedService: SharedService) {
    this.activeRoute.data.subscribe(data => {
      if (data.kind === 'history') {
        this.isHistoryTab = true;
        this.approvalStatus = ['reviewed', 'rejected']
      } 
      else {
        this.displayedColumns = this.displayedColumns.filter(c => c !== 'remarks');
      }
    })
  }

  ngOnInit(): void {
    this.getMenuChangesApprovalData();
  }

  /**
   * Method that gets data for approval
   * @param filterFlag 
   */
  getMenuChangesApprovalData(filterFlag?: boolean) {
    if (filterFlag) {      
      this.pageIndex = 0;
      this.paginator.pageIndex = 0
    }
    this.filterMenuChangesFields.approvalStatus = this.approvalStatus;
    this.filterMenuChangesFields.pageIndex = this.pageIndex;
    this.filterMenuChangesFields.pageSize = this.pageSize;
    if(this.filterMenuChangesFields.startDate && !this.filterMenuChangesFields.endDate){
      this.toastService.showError("Enter end date");
      return;
    }
    if(!this.filterMenuChangesFields.startDate && this.filterMenuChangesFields.endDate){
      this.toastService.showError("Enter start date");
      return;
    }
    if(!this.filterMenuChangesFields.startDate && (this.filterMenuChangesFields.startTime || this.filterMenuChangesFields.endTime)){
      this.toastService.showError("Enter start date and end date");
      return;
    }
    if(!this.filterMenuChangesFields.endDate && (this.filterMenuChangesFields.startTime || this.filterMenuChangesFields.endTime)){
      this.toastService.showError("Enter start date and end date");
      return;
    }
    const data = this.filterMenuChangesFields.toJson(this.approvalService.service);
    this.approvalService.filterMenuChangesApprovalData(data).subscribe(res => {
      this.totalMenuChangesApprovalRecords = res['result']['total_records'];
      this.menuChangesApprovalList.data = [];
      for (const i of res['result']['records']) {
        this.menuChangesApprovalList.data.push(MenuChangesApproval.fromJson(i));
      }
      this.menuChangesApprovalList.sort = this.sort;
      this.identifyChangesInApprovalData();
    });
  }

  /**
   * Method that finds difference b/w two objects
   */
  identifyChangesInApprovalData() {
    for (const record of this.menuChangesApprovalList.data) {
      if (record.action === ActionTypes.update) {
        this.differentPropsInApprovalData[record['approvalId']] = {};
        for (const j in record.previousEntityDetails) {
          if (Array.isArray(record.previousEntityDetails[j])) {
            this.differentPropsInApprovalData[record['approvalId']][j] = {}
            this.handleArray(record.previousEntityDetails[j], record.requestedEntityDetails[j], record['approvalId'], j);
          }
          else if (JSON.stringify(record.previousEntityDetails[j]) !== JSON.stringify(record.requestedEntityDetails[j])) {
            this.differentPropsInApprovalData[record['approvalId']][j] = !this.differentPropsInApprovalData[record['approvalId']][j];
          }
        }
      }
    }
  }

  /**
   * Method that finds deep difference in nested array
   * @param arr1 
   * @param arr2 
   * @param id 
   * @param arrKeyName 
   */
  handleArray(arr1: any[], arr2: any[], id: number, arrKeyName: string) {
    const maxLength = Math.max(arr1.length, arr2.length);

    for (let i = 0; i < maxLength; i++) {
      if (i >= arr1.length || i >= arr2.length) {
        this.differentPropsInApprovalData[id][arrKeyName][i] = true;
      }
      else if (typeof arr1[i] === 'object' && typeof arr2[i] === 'object') {
        this.differentPropsInApprovalData[id][arrKeyName][i] = {}
        for (const key in arr1[i]) {
          if (Array.isArray(arr1[i][key]) && Array.isArray(arr2[i][key])) {
            this.differentPropsInApprovalData[id][arrKeyName][i][key] = {};
            const ml = Math.max(arr1[i][key].length, arr2[i][key].length);
            for (let j = 0; j < ml; j++) {
              if (j >= arr1[i][key].length || j >= arr2[i][key].length) {
                this.differentPropsInApprovalData[id][arrKeyName][i][key][j] = true;
              }
              else if (typeof arr1[i][key][j] === 'object' && typeof arr2[i][key][j] === 'object') {
                this.differentPropsInApprovalData[id][arrKeyName][i][key][j] = {};
                for (const a in arr1[i][key][j]) {
                  if (arr1[i][key][j][a] !== arr2[i][key][j][a]) {
                    this.differentPropsInApprovalData[id][arrKeyName][i][key][j][a] = true;
                  }
                }
              }
            }
          }
          else if (arr1[i][key] !== arr2[i][key]) {
            this.differentPropsInApprovalData[id][arrKeyName][i][key] = true;
          }
        }
      }
    }
  }

  /**
   * Method that makes API call to send approval status [reviewed or rejected]
   * @param event 
   */
  sendApprovalStatus(event: any) {
    this.approvalService.postMenuChangesReview((event.approvalId).toString(), event.data).subscribe(res => {
      if (this.menuChangesApprovalList.data.length === 1 && this.pageIndex > 0) {
        this.pageIndex -= 1;
        this.paginator.pageIndex = this.pageIndex;
      }
      this.getMenuChangesApprovalData();
      this.toastService.showSuccess(`Remarks submitted successfully for ID: ${event.approvalId}`);
    })
  }

  /**
   * Method that invokes on page change and get new data for approval
   * by pageindex and pagesize
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getMenuChangesApprovalData();
  }

  /**
  * Method that clears all filter parameters
  */
  clearFilter(fieldName?: 'all' | 'date'| 'startTime' | 'endTime') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterMenuChangesFields = new FilterMenuChanges();
    } else if (fieldName === 'date') {
      this.filterMenuChangesFields.startDate = this.filterMenuChangesFields.endDate = this.filterMenuChangesFields.startTime = this.filterMenuChangesFields.endTime = null;
    }
    else if (fieldName === 'startTime') {
      this.filterMenuChangesFields.startTime = null;
    }
    else if (fieldName === 'endTime') {
      this.filterMenuChangesFields.endTime = null;
    }
    this.getMenuChangesApprovalData()
  }

  /**
   * Method that opens outlet details in new tab
   * @param outletId 
   */
   navigateToOutletDetailsInNewWindow(outletId: string,outletName:string) {
    this.sharedService.navigateToOutletDetailsInNewWindow(outletId, outletName);
  }
}
