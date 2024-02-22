import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { permissionDeniedErrorMsg } from 'src/app/shared/models';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { VendorDetail } from './model/vendor-detail';
import { SetPasswordDialogComponent } from './set-password-dialog/set-password-dialog.component';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {

  currentOutletId: string;
  vendorDetail: MatTableDataSource<VendorDetail>;
  displayedColumns = ['id','name','role','email','phone','loginId','active','resetPassword'];
  service: string;
  
  constructor(private outletsService: OutletsService, private activeRoute: ActivatedRoute, private dialog: MatDialog,
    private sharedService: SharedService, private toastMsgService: ToastService) {
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
   }

  ngOnInit(): void {
    this.service = this.outletsService.service;
    this.getVendorDetails();    
  }

  /**
   * Method that gets vendor details for home-tabs
   */
  getVendorDetails(){
    this.outletsService.vendorLoginDetails(this.currentOutletId).subscribe(res => {
      this.vendorDetail = new MatTableDataSource<VendorDetail>(res['result'].map(i => VendorDetail.fromJson(i)));
    });
  }

  /**
   * Method that open reset vendor password dialog box
   * @param loginId 
   */
  openResetPasswordDialog(loginId: string){
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg); 
    const diallogRef = this.dialog.open(SetPasswordDialogComponent, {
      data: {
        loginId
      }
    });
  }

}
