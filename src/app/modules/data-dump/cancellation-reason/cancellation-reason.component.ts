import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pageSizeOptions } from 'src/app/shared/models';
import { DataDumpService } from 'src/app/shared/services/data-dump.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AddCancellationReasonDialogComponent } from './add-cancellation-reason-dialog/add-cancellation-reason-dialog.component';
import { CancellationReason } from './model/cancellation-reason';

@Component({
  selector: 'app-cancellation-reason',
  templateUrl: './cancellation-reason.component.html',
  styleUrls: ['./cancellation-reason.component.scss']
})
export class CancellationReasonComponent implements OnInit {

  cancellationReasonList: MatTableDataSource<CancellationReason> = new MatTableDataSource();
  displayedColumns: string[] = ['reasonId', 'userType', 'cancellationReason', 'action'];
  globalFilter: string;
  pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataDumpService: DataDumpService, private dialog: MatDialog, private toastMsgService: ToastService) { }

  ngOnInit(): void {
    this.setCancellationReasonList();
  }


  /**
  * Method that matches string of search bar with table content
  * @param filter
  */
  globalSearch(filter: string) {
    this.globalFilter = filter;
    this.cancellationReasonList.filter = this.globalFilter.trim().toLowerCase();

    if (this.cancellationReasonList.paginator) {
      this.cancellationReasonList.paginator.firstPage();
    }
  }

  /**
   * Method that gets all cancellation reasons
   */
  setCancellationReasonList() {
    this.dataDumpService.getCancellationReasonList().subscribe(res => {
      this.cancellationReasonList.data = [];
      for (const i of res['result']['reasons']) {
        this.cancellationReasonList.data.push(CancellationReason.fromJson(i));
      }
      this.cancellationReasonList.paginator = this.paginator;
      this.cancellationReasonList.sort = this.sort;
    })
  }

  /**
   * Method that adds new camcellation reason
   */
  addCancellationReason() {
    const dialogRef = this.dialog.open(AddCancellationReasonDialogComponent, { data: { action: 'ADD' }, autoFocus: false });

    dialogRef.afterClosed().subscribe(response => {
      if (response.flag) {
        const data = {
          user_type: response.userType,
          cancellation_reason: response.cancellationReason
        }
        this.dataDumpService.postCancellationReason(data).subscribe(res => {
          this.toastMsgService.showSuccess('Cancellation reason added successfully');
          this.setCancellationReasonList();
        })
      }
    })
  }

  /**
   * Method that updates cancellation reason
   * @param reason 
   */
  updateCancellationReason(reason: CancellationReason) {
    const dialogRef = this.dialog.open(AddCancellationReasonDialogComponent, {
      data: {
        action: 'UPDATE',
        userType: reason.userType,
        cancellationReason: reason.cancellationReason,
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response.flag) {
        const data = {
          user_type: response.userType,
          cancellation_reason: response.cancellationReason
        }
        this.dataDumpService.putCancellationReason(reason.id, data).subscribe(res => {
          this.toastMsgService.showSuccess('Cancellation reason updated successfully');
          this.setCancellationReasonList();
        })
      }
    })
  }

  /**
   * Method that deletes cancellation reason
   * @param reason 
   */
  deleteCancellationReason(reason: CancellationReason) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: `You want to delete this cancellation reason?`,
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel',
      },
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.dataDumpService.deleteCancellationReason(reason.id).subscribe(res => {
          this.toastMsgService.showSuccess('Cancellation reason deleted successfully');
          this.setCancellationReasonList();
        })
      }
    })
  }
}
