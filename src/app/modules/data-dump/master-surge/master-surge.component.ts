import { Component, OnInit, ViewChild } from '@angular/core';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { FilterMasterSurge, MasterSurge, MasterSurgeAction, masterSurgeFrequencyList, masterSurgeRateTypeList, masterSurgeTypeList } from './model/master-surge';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-master-surge',
  templateUrl: './master-surge.component.html',
  styleUrls: ['./master-surge.component.scss']
})
export class MasterSurgeComponent implements OnInit {

  masterSurgeData: MatTableDataSource<MasterSurge> = new MatTableDataSource();
  displayedColumns: string[] = ['surgeDetail', 'type', 'frequency', 'startTime', 'endTime', 'rateType', 'rate', 'message', 'updatedAt', 'action'];
  filterSurgeData: FilterMasterSurge = new FilterMasterSurge();
  pageIndex: number = 0;
  pageSize: number = pageSize;
  pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalSurgeRecords: number;
  globalFilter: string;
  showFilterFields: boolean;
  masterSurgeForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    type: new FormControl(['', Validators.required]),
    frequency: new FormControl(['', Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    rateType: new FormControl(['', Validators.required]),
    rate: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });
  showId: boolean;
  action: MasterSurgeAction;
  showMasterSurgeModal: boolean;
  tableData: [] = [];
  readonly masterSurgeTypeList = masterSurgeTypeList;
  readonly masterSurgeFrequencyList = masterSurgeFrequencyList;
  readonly masterSurgeRateTypeList = masterSurgeRateTypeList;


  constructor(private dialog: MatDialog, private dataDumpService: DataDumpService, private toastMsgService: ToastService, private activeRoute: ActivatedRoute) {
    if (Object.keys(activeRoute.snapshot.queryParams).length) {
      this.showFilterFields = true;
      const queryParams = activeRoute.snapshot.queryParams;
      this.filterSurgeData.surgeIds = queryParams.surgeId;
    }
  }

  ngOnInit(): void {
    this.getAllMasterSurgeDetails();
  }

  /**
 * Method that Retrieves Master Surge details, optionally applying a filter if `filterFlag` is true.
 * If a filter is applied, it resets the page index and paginator.
 * @param filterFlag - A flag indicating whether to apply a filter.
 */
  getAllMasterSurgeDetails(filterFlag?: boolean) {
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterSurgeData.pageIndex = this.pageIndex;
    this.filterSurgeData.pageSize = this.pageSize;
    const data = this.filterSurgeData.toJson();
    this.dataDumpService.postMasterSurge(data).subscribe((res) => {
      this.totalSurgeRecords = res['result']['total_records'];

      this.masterSurgeData.data = []
      for (const i of res['result']['records']) {
        this.masterSurgeData.data.push(MasterSurge.fromJson(i))
      }
      this.masterSurgeData.sort = this.sort;
    });
  }

  /**
 * Method that Creates or updates a Master Surge record based on the specified action (Add or Edit).
 * If the form is invalid, it marks all fields as touched and does not proceed.
 * @param id - The ID of the Master Surge record (used in Edit mode).
 */
  createSurge(id: number) {
    if (this.masterSurgeForm.status === 'INVALID')
      return this.masterSurgeForm.markAllAsTouched();

    const formData = this.masterSurgeForm.getRawValue();
    const data: FilterMasterSurge = new FilterMasterSurge();
    Object.assign(data, formData);

    if (this.action === 'Add') {
      this.dataDumpService.createMasterSurge(data.toJson(this.action)).subscribe(res => {
        this.getAllMasterSurgeDetails();
        this.toastMsgService.showSuccess('Created Successfully');
        this.closeMasterSurgeModal();
      })
    }
    if (this.action === 'Edit') {
      const id = this.masterSurgeForm.get('id').value;
      this.dataDumpService.putMasterSurge(id, data.toJson(this.action)).subscribe(res => {
        this.getAllMasterSurgeDetails();
        this.toastMsgService.showSuccess(`Surge ${id} Updated Successfully`)
        this.closeMasterSurgeModal();
      })
    }

  }

  /**
 * Method that Performs a global search by setting the global filter and updating the data filter.
 * @param filter - The filter criteria for the global search.
 */
  globalSearch(filter) {
    this.globalFilter = filter;
    this.masterSurgeData.filter = JSON.stringify(this.filterSurgeData);
  }

  /**
 * Method that Clears the filter criteria for Master Surge data, optionally clearing all filter fields.
 * @param fieldName - The name of the field to clear (or 'all' to clear all fields).
 */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterSurgeData = new FilterMasterSurge();
    }
    this.getAllMasterSurgeDetails();
  }

  /**
 * Method that Closes the Master Surge modal, resets the form, and enables it.
 */
  closeMasterSurgeModal() {
    this.masterSurgeForm.reset();
    this.masterSurgeForm.enable();
    this.showMasterSurgeModal = false;
  }


  /**
 * Method that Opens the Master Surge modal for a specified action type (Add or Edit) and optionally pre-fills data for editing.
 * @param actionType - The action type (Add or Edit).
 * @param masterSurge - The Master Surge data to pre-fill in case of editing (optional).
 */
  openMasterSurgeModal(actionType: MasterSurgeAction, masterSurge?: MasterSurge) {
    if (actionType === 'Edit') {
      this.masterSurgeForm.patchValue({ ...masterSurge });
      // this.masterSurgeForm.get('type').setValue(masterSurge.type);
      this.showId = true;
      this.masterSurgeForm['controls']['id'].disable();
      this.masterSurgeForm['controls']['frequency'].disable();
      this.masterSurgeForm['controls']['startTime'].disable();
      this.masterSurgeForm['controls']['endTime'].disable();
    }
    this.action = actionType;
    this.showMasterSurgeModal = true;
  }

  /**
 * Method that Opens a confirmation dialog and deletes a Master Surge record if confirmed.
 * @param masterSurge - The Master Surge record to be deleted.
 */
  deleteRiderSurges(masterSurge: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to delete this Surge: ${masterSurge.id}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.dataDumpService.deleteMasterSurge(masterSurge.id).subscribe(res => {
          this.getAllMasterSurgeDetails();
          this.toastMsgService.showSuccess(`Master Surge Id: ${masterSurge.id} is deleted !!!`);
        });
      }
    })
  }

}