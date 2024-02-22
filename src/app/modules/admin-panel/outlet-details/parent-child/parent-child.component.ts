import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ParentChild } from './parent-child';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OutletDialogComponent } from '../../outlets/outlet-dialog/outlet-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddNewChildComponent } from './add-new-child/add-new-child.component';
import { permissionDeniedErrorMsg } from 'src/app/shared/models';

@Component({
  selector: 'app-parent-child',
  templateUrl: './parent-child.component.html',
  styleUrls: ['./parent-child.component.scss']
})
export class ParentChildComponent implements OnInit {

  currentOutletId: string;
  parentChildDetail: MatTableDataSource<ParentChild>;
  displayedColumns = ['outletName','id','partnerId','status','action'];
  service: string;
  parentOrChild: string;
  isParentOutlet: boolean;
  childId: string;

  constructor(private outletsService: OutletsService, private activaRoute: ActivatedRoute, private dialog: MatDialog, private toastMsgService: ToastService, private sharedService: SharedService) { 
    this.currentOutletId = this.activaRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.service = this.outletsService.service;
    this.getParentChildDetail();
  }

  /**
   * Method that get child restaurant detial for home-tabs
   */
  getParentChildDetail(){
    this.parentOrChild = this.outletsService.outletDetails.parentOrChild;
    if(this.parentOrChild === 'parent' || this.parentOrChild !== 'child'){
      this.outletsService.getChildRestaurant(this.currentOutletId).subscribe((res) => {
        this.parentChildDetail = new MatTableDataSource<ParentChild>(res.map(i => ParentChild.fromJson(i))); 
      });
    }else{
      this.isParentOutlet = true;
      this.outletsService.getParentRestaurant(this.currentOutletId).subscribe((res) => {
        this.parentChildDetail = new MatTableDataSource<ParentChild>([ParentChild.fromJson(res)]);
      })
    }
  }

    /**
   * Method that enable or disable the outlet
   * @param outlet 
   */
    changeStatus(outlet: any) {
      if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
      const dialogRef = this.dialog.open(OutletDialogComponent, {
        data: {
          title: outlet.status === 'active' ? 'Select reason for disabling the outlet' : 'Enter reason for enabling the outlet',
          action: outlet.status === 'active' ? 'disable' : 'active'
        },
        autoFocus: false,
      });
  
      dialogRef.afterClosed().subscribe(response => {
        if (response.flag) {
          const data = {
            disable: outlet.status === 'active' ? true : false,
            comments: response.comments
          }
          this.outletsService.updateOutletStatus(outlet.id, data).subscribe(res => {
            outlet.status === 'active' ? outlet.status = 'disable' : outlet.status = 'active';
            this.toastMsgService.showSuccess(`Outlet status updated successfully`);
          })
        }
      })
    }

    /**
     * Method that navigates to another tab based on outlet Id
     * @param id 
     * @param childOutletName 
     */
    navigateToOutletDetailsInNewWindow(id: string, childOutletName: string) {
      this.sharedService.navigateToOutletDetailsInNewWindow(id, childOutletName);
    }

    /**
     * Method that open add new child restaurant dialog box
     */
    openAddNewDialog(){
      if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
      const diallogRef = this.dialog.open(AddNewChildComponent, {
        data: {
          parentId : this.currentOutletId
        }
      });
    }

    /**
     * Method that delete child restaurant
     * @param childDetail 
     */
    deleteChildOutlet(childDetail: any) {
      if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
      this.outletsService.deleteChildRestaurant(childDetail.id).subscribe(res => {
        this.toastMsgService.showSuccess(`Outlet: ${childDetail.outletName} deleted successfully`);
        this.getParentChildDetail();
      })
    }
}
