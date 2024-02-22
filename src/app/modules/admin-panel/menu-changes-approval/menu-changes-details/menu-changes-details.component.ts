import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Services } from 'src/app/shared/models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { EntityTypes, MenuChangesApproval, MenuChangesApprovalStatus } from '../model/menu-changes-approval';
@Component({
  selector: 'app-menu-changes-details',
  templateUrl: './menu-changes-details.component.html',
  styleUrls: ['./menu-changes-details.component.scss']
})
export class MenuChangesDetailsComponent implements OnInit {
  readonly EntityTypes = EntityTypes;
  readonly Services = Services;
  entityDetails: any;
  approvalRemarks = new FormControl('');
  service: string;
  @Input() differentProps: any;
  @Input() menuChangesDetails: MenuChangesApproval;
  @Input() openedFor: string;
  @Output() takeAction: EventEmitter<any> = new EventEmitter();
  constructor(private toastMsgService: ToastService, private dialog: MatDialog, private sharedService: SharedService) { }
  ngOnInit(): void {
    this.openedFor === 'previous entity'
      ? this.entityDetails = this.menuChangesDetails['previousEntityDetails'] : this.entityDetails = this.menuChangesDetails['requestedEntityDetails'];
    this.service = this.sharedService.service;
  }
  /**
   * Method that emits approval action to be taken after confimation
   * @param status 
   * @returns 
   */
  approveRejectMenuChanges(status: MenuChangesApprovalStatus) {
    if (status === 'rejected' && !this.approvalRemarks.value) {
      return this.toastMsgService.showError('Kindly enter remarks');
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Are you sure ?',
        message: status === 'reviewed' ? 'You want to approve the changes ?' : 'You want to reject the changes ?',
        confirmBtnText: 'OK',
        dismissBtnText: 'Cancel'
      }
    })
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const toSendData = {
          status,
          status_comments: this.approvalRemarks.value || undefined
        }
        this.takeAction.emit({ approvalId: this.menuChangesDetails.approvalId, data: toSendData });
      }
    })
  }
}
