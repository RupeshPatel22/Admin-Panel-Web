import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { PosService } from 'src/app/shared/services/pos.service';
import { Pos, PosOnboardingStatus } from './model/pos-detail';
import { ToastService } from 'src/app/shared/services/toast.service';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { permissionDeniedErrorMsg } from 'src/app/shared/models';

@Component({
  selector: 'app-pos-details',
  templateUrl: './pos-details.component.html',
  styleUrls: ['./pos-details.component.scss'],
})
export class PosDetailsComponent implements OnInit {
  posDetailForm = new FormGroup({
    posRestaurantId: new FormControl(''),
    posId: new FormControl(''),
    posStatus: new FormControl(''),
  });
  currentOutletId: string;
  posDetailList: Pos;
  isInitConnection: boolean;
  isReadyStatus: boolean;
  isOnboardRestaurant: boolean;
  isFetchMenu: boolean;
  posOnboardingStatus: PosOnboardingStatus;
  isGotPosIdStatus: boolean;
  isOnboardRestaurantCompleted: boolean;
  isDetachedStatus: boolean;
  constructor(
    private dialog: MatDialog,
    private posService: PosService,
    private toastMsgService: ToastService,
    private activeRoute: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.getPosDetail();
    if (!this.sharedService.hasEditAccessForOutletDetails) this.posDetailForm.disable();
  }

  /**
   * Method that initalizes POS for outlet
   */
  initializePosForOutlet() {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    const id = this.posDetailForm.get('posRestaurantId').value;
    const data = { pos_restaurant_id: id };
    this.posService
      .postPosInitiate(this.currentOutletId, data)
      .subscribe((res) => {
        this.toastMsgService.showSuccess('Connection has been initiated');
        this.getPosDetail();
      });
  }

  /**
   * Method that update POS onboarding status
   */
  updatePosStatus() {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    const data = {
      pos_id: this.posDetailForm.get('posId').value,
      pos_status: this.posDetailForm.get('posStatus').value,
    };
    this.posService
      .putPosOnboardingDetail(this.currentOutletId, data)
      .subscribe((res) => {
        this.toastMsgService.showSuccess('POS Status Updated successfully');
        this.getPosDetail();
      });
  }

  /**
   * Method that onboard restuarnt for pet pooja
   */
  onboardRestaurantOnPetPooja() {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    const data = {};
    this.posService
      .postPosOnboardingDetail(this.currentOutletId, data)
      .subscribe((res) => {
        this.toastMsgService.showSuccess(
          'Restaurant Successfully Onboarded on Petpooja'
        );
        this.getPosDetail();
      });
  }

  /**
   * Method that is used to detach res onboarding from pet pooja
   */
  detachRestaurantOnPetPooja() {
    if (!this.sharedService.hasEditAccessForOutletDetails) return this.toastMsgService.showInfo(permissionDeniedErrorMsg);
    const data = {};
    this.posService.postPosDetach(this.currentOutletId, data).subscribe((res) => {
      this.toastMsgService.showSuccess('Detached Successfully !!!');
      this.getPosDetail();
    });
  }
  // /**
  //  * Method that fetches menu for POS Restaurant
  //  */
  // fetchMenuOfPosRestaurant() {
  //   this.posService.getPosFetchMenu(this.currentOutletId).subscribe((res) => {
  //     this.toastMsgService.showSuccess(
  //       'Restaurant Menu Fetched Successfully !!!'
  //     );
  //     this.getPosDetail();
  //   });
  // }

  /**
   * Method that sync menu with POS
   */
  // syncMenuWithPOS() {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     data: {
  //       title: 'Are you sure ?',
  //       message:
  //         'Do you really want to sync the menu, this will set your menu same as Pet Pooja menu?',
  //       confirmBtnText: 'OK',
  //       dismissBtnText: 'Cancel',
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res) {
  //       this.fetchMenuOfPosRestaurant();
  //     }
  //   });
  // }

  /**
   * Method that gets POS details of restaurant
   */
  getPosDetail() {
    this.isInitConnection = true;
    this.isReadyStatus = false;
    this.isOnboardRestaurant = false;
    this.isFetchMenu = false;
    this.isGotPosIdStatus = false;
    this.isOnboardRestaurantCompleted = false;

    this.posService
      .getPosOnboardingDetail(this.currentOutletId)
      .subscribe((res) => {
        switch (res['result']['pos_status']) {
          case 'init':
            this.isInitConnection = false;
            this.isReadyStatus = true;
            this.isGotPosIdStatus = true;
            this.isOnboardRestaurantCompleted = false;
            this.isDetachedStatus = false;
            this.posDetailForm.reset();
            this.posDetailForm.patchValue({
              posRestaurantId: res['result']['pos_restaurant_id'],
              posId: res['result']['pos_id'],
              posStatus: res['result']['pos_status']
            });
            break;
          case 'ready':
            this.isInitConnection = false;
            this.isReadyStatus = false;
            this.isGotPosIdStatus = true;
            this.isOnboardRestaurant = true;
            this.isOnboardRestaurantCompleted = false;
            this.isDetachedStatus = false;
            this.posDetailForm.reset();
            this.posDetailForm.patchValue({
              posRestaurantId: res['result']['pos_restaurant_id'],
              posId: res['result']['pos_id'],
              posStatus: res['result']['pos_status']
            });
            break;
          case 'got_pos_id':
            this.isInitConnection = false;
            this.isReadyStatus = false;
            this.isGotPosIdStatus = false;
            this.isOnboardRestaurant = true;
            this.isOnboardRestaurantCompleted = false;
            this.isDetachedStatus = false;
            this.posDetailForm.reset();
            this.posDetailForm.patchValue({
              posRestaurantId: res['result']['pos_restaurant_id'],
              posId: res['result']['pos_id'],
              posStatus: res['result']['pos_status']
            });
            break;
          case 'onboarded':
            // this.isFetchMenu = true;
            this.isInitConnection = false;
            this.isReadyStatus = false;
            this.isGotPosIdStatus = false;
            this.isOnboardRestaurant = false;
            this.isOnboardRestaurantCompleted = true;
            this.isDetachedStatus = false;
            this.posDetailList = Pos.fromJson(res['result']);
            break;
          case 'detached':
            this.isInitConnection = false;
            this.isReadyStatus = false;
            this.isGotPosIdStatus = true;
            this.isOnboardRestaurant = true;
            this.isOnboardRestaurantCompleted = false;
            this.isDetachedStatus = true;
            this.posDetailForm.reset();
            this.posDetailForm.patchValue({
              posRestaurantId: res['result']['pos_restaurant_id'],
              posId: res['result']['pos_id'],
              posStatus: res['result']['pos_status']
            });
          default:
            this.toastMsgService.showInfo('Restaurant can be onboarded on Pet Pooja !!!');
            break;
        }
      });
  }

}
