import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterMerchant, KycStatus, KycStatusList, Merchant, StatusList } from './model/pnd-merchant';
import { pageSize } from 'src/app/shared/models';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-pnd-merchant',
  templateUrl: './pnd-merchant.component.html',
  styleUrls: ['./pnd-merchant.component.scss']
})
export class PndMerchantComponent implements OnInit {

  merchantList: MatTableDataSource<Merchant> = new MatTableDataSource();
  displayedColumns: string[] = ['merchantId','businessName','customerId','email','kycStatus','phone','phoneVerified','status','action'];
  filterMerchantFields: FilterMerchant = new FilterMerchant();
  pageIndex: number = 0;
  pageSize: number = pageSize;
  showFilterFields: boolean;
  readonly originalOrder = originalOrder;
  readonly statusList = StatusList;
  readonly kycStatusList = KycStatusList;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  kind: string;
  pageHeading: string;
  kycStatus: KycStatus[] = [];

  constructor(private outletsService: OutletsService, private activeRoute: ActivatedRoute, private toastMsgService: ToastService) { 
    this.activeRoute.data.subscribe(data => {
      this.kind = data.kind;
      if (data.kind === 'all') {
        this.pageHeading = 'Merchants';
      }
      else if (data.kind === 'kyc-pending') {
        this.pageHeading = 'KYC Pending';
        this.kycStatus = ["approval_pending"];
        this.getMerchantList();
      }
    })
  }

  ngOnInit(): void {
    
    this.getMerchantList();
  }

  /**
   * Method that get merchant details
   * @param filterFlag 
   */
  getMerchantList(filterFlag?: boolean) {
    this.filterMerchantFields.pageIndex = this.pageIndex;
    this.filterMerchantFields.pageSize = this.pageSize;
    if(this.kycStatus.length) {
      this.filterMerchantFields.kycStatus = this.kycStatus;
    }
    const data = this.filterMerchantFields.toJson();
    this.outletsService.postPndMerchant(data).subscribe(res => {
      this.merchantList.data = [];
      for(const i of res['result']['records']){
        this.merchantList.data.push(Merchant.fromJson(i));
      }
      this.merchantList.sort = this.sort;
      this.merchantList.paginator = this.paginator;
    })

  }

  /**
 * Method that Updates the details of a merchant based on the provided event data.
 * Calls the outletsService to send a PUT request with the updated merchant details,
 * and subscribes to the response. Shows a success toast message upon successful update
 * and triggers a refresh of the merchant list.
 */
  updateMerchantDetails(event: any) {
    this.outletsService.putUpdateMerchant(event.merchantId,event.data).subscribe(res => {
      this.toastMsgService.showSuccess('Merchant details updated successfully!!!');
      this.getMerchantList();
    })
  }

  /**
   * Method that clears filter params
   * @param fieldName 
   */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.filterMerchantFields = new FilterMerchant();
      this.showFilterFields = false;
    }
    this.getMerchantList();
  }

  /**
   *Method that approve Merchant KYC
   * @param merchantId 
   */
  approveKyc(merchantId: string) {
    const data = {}
    this.outletsService.postMerchantKycApprove(merchantId,data).subscribe(res => {
      this.toastMsgService.showSuccess('Merchant KYC Approved Successfully!!');
      this.getMerchantList();
    })
  }

}
