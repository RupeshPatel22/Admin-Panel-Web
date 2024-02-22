import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HolidaySlotsActionDialogComponent } from './holiday-slots-action-dialog/holiday-slots-action-dialog.component';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { permissionDeniedErrorMsg } from 'src/app/shared/models';

@Component({
  selector: 'app-holiday-slots',
  templateUrl: './holiday-slots.component.html',
  styleUrls: ['./holiday-slots.component.scss'],
})
export class HolidaySlotsComponent implements OnInit {

  holidaySlotsList: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['srNo', 'createdBy', 'endDate', 'action'];
  showFilterFields: boolean;

  currentOutletId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private outletsService: OutletsService, private activeRoute: ActivatedRoute,
    private sharedService: SharedService, private toastMsgService: ToastService) {
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.getOutletHolidaySlotsData()
  }

  /**
   * Method that gets holiday slots details of the outlet
   */
  getOutletHolidaySlotsData() {
    this.outletsService.getOutletHolidaySlots(this.currentOutletId).subscribe(res => {
      this.holidaySlotsList.data = [];
      if (res['result']['is_holiday']) {
        this.holidaySlotsList.data.push(res['result'])
        this.holidaySlotsList.paginator = this.paginator;
        this.holidaySlotsList.sort = this.sort;
      }
    })
  }

  /**
   * Method that open the dialog for add new holiday slot
   * @param actionType
   */
  openHolidaySlotsActionDialog(actionType: string) {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    const dialogRef = this.dialog.open(HolidaySlotsActionDialogComponent, {
      data: { action: actionType },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response.flag) {
        if (actionType === 'add') {
          const data = {end_epoch: response.endDate }
          this.outletsService.postOutletHolidaySlot(this.currentOutletId, data).subscribe(res => {
            this.getOutletHolidaySlotsData();
          })
        } else {
          this.outletsService.deleteOutletHolidaySlot(this.currentOutletId).subscribe(res => {
            this.getOutletHolidaySlotsData();
          })
        }
      }
    })
  }
}
