import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FilterRiderShifts, RiderShiftAction, RiderShifts } from './model/shifts';
import { pageSize, pageSizeOptions } from 'src/app/shared/models/constants/constant.type';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RiderService } from 'src/app/shared/services/rider.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})
export class ShiftsComponent implements OnInit {
  riderList: MatTableDataSource<RiderShifts> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'type', 'start_time', 'end_time', 'min_guarantee_in_rupees', 'delete'];
  pageIndex: number = 0;
  pageSize = pageSize;
  pageSizeOptions = pageSizeOptions;
  showFilterFields: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterRiderShifts: FilterRiderShifts = new FilterRiderShifts();
  riderShiftsData = [];
  globalFilter: string;
  riderShiftForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    start_time: new FormControl('', [Validators.required]),
    end_time: new FormControl('', [Validators.required]),
    min_guarantee_in_rupees: new FormControl('', [Validators.required]),
  });
  action: RiderShiftAction;
  showRiderShiftModal: boolean;
  showId: boolean;
  constructor(private riderService: RiderService,
    private dialog: MatDialog,
    private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.getAllRiderShiftsData();
  }

  /**
   * Method that gets all the rider shifts
   */
  getAllRiderShiftsData() {
    this.riderService.getAllRiderShifts().subscribe((data) => {
      if (data['status'] === true) {
        this.riderShiftsData = [];
        for (const c of data['result']) {
          this.riderShiftsData.push(c);
        }
        this.riderList = new MatTableDataSource(this.riderShiftsData);
        this.riderList.paginator = this.paginator;
        this.riderList.sort = this.sort;
        this.riderList.filterPredicate = this.customFilterPredicate();
      }
    });
  }

  /**
   * Method that matches string of search bar with table content
   * @param filter
   */
  globalSearch(filter) {
    this.globalFilter = filter;
    this.riderList.filter = JSON.stringify(this.filterRiderShifts);
  }

  /**
   * Method that filters data based on search strings and filters
   * @returns boolean
   */
  customFilterPredicate() {
    const filterPredicate = (data: any, filter: string): boolean => {
      if (this.globalFilter) {
        // search all text fields
        return (
          data.id
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.name
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1
        );
      }
      let filteredData: FilterRiderShifts = JSON.parse(filter);
      for (const i in filteredData) {
        if (!filteredData[i]) filteredData[i] = '';
      }
      return (
        data.id.trim().toLowerCase().indexOf(filteredData.id.toLowerCase()) !==
        -1 &&
        data.name
          .trim()
          .toLowerCase()
          .indexOf(filteredData.name.toLowerCase()) !== -1
      );
    };
    return filterPredicate;
  }

  /**
   * Method that filters table data based on user choice from id, type
   */
  applyFilter() {
    this.riderList.filter = JSON.stringify(this.filterRiderShifts);
    this.riderList.filterPredicate = this.customFilterPredicate();
  }

  /**
   * Method that clear all the filters from the table
   */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterRiderShifts = new FilterRiderShifts();
    }
    this.riderList.filter = JSON.stringify(this.filterRiderShifts);
  }
  deleteRiderShifts(riderShifts: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `Do you want to delete the shift: ${riderShifts.name}?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.riderService.deleteRiderShift(riderShifts.id).subscribe(res => {
          this.getAllRiderShiftsData();
          this.toastMsgService.showSuccess(`Rider Shifts: ${riderShifts.name} is deleted !!!`);
        });
      }
    })
  }

  /**
   * Method that adds or edits rider shift
   * @returns 
   */
  submitRiderShift() {
    if (this.riderShiftForm.status === 'INVALID') return this.riderShiftForm.markAllAsTouched();
    const formValues = this.riderShiftForm.getRawValue();
    const data: RiderShifts = new RiderShifts();
    Object.assign(data, formValues);

    if (this.action === 'Add') {
      this.riderService.createRiderShift(data.toJson(this.action)).subscribe(res => {
        this.getAllRiderShiftsData();
        this.toastMsgService.showSuccess('New Plan is created successfully');
        this.closeRiderShiftModal();
      })
    }
    if (this.action === 'Edit') {
      this.riderService.updateRiderShift(data.toJson(this.action)).subscribe(res => {
        this.getAllRiderShiftsData();
        this.toastMsgService.showSuccess(`Plan ID: ${data.id} is updated successfully`);
        this.closeRiderShiftModal();
      })
    }
  }

  /**
   * Method that closes the rider shift modal
   */
  closeRiderShiftModal() {
    this.riderShiftForm.reset();
    this.riderShiftForm.enable();
    this.showRiderShiftModal = false;
  }

  /**
 * Method that opens rider shift modal after performing action based on actionType
 * @param actionType 
 * @param plan 
 */
  openRiderShiftModal(actionType: RiderShiftAction, riderShift?: RiderShifts) {
    if (actionType === 'Edit') {
      this.riderShiftForm.patchValue({ ...riderShift });
      this.showId = true;
      this.riderShiftForm['controls']['id'].disable();
    }
    this.action = actionType;
    this.showRiderShiftModal = true;
  }

}
