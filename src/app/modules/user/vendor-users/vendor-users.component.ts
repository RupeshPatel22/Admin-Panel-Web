import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/shared/services/user.service';
import { FilterVendorUsers, VendorUsers, typeList } from './model/vendor-users';
import { pageSize, pageSizeOptions } from 'src/app/shared/models';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-users',
  templateUrl: './vendor-users.component.html',
  styleUrls: ['./vendor-users.component.scss']
})
export class VendorUsersComponent implements OnInit {

  vendorUsersList: MatTableDataSource<VendorUsers> = new MatTableDataSource();
  displayedColumns: string[] = ['sr no','outletId','vendorDetail','phone','email','role','type','active'];
  pageIndex: number = 0;
  pageSize: number = pageSize;
  totalVendorUsersRecords: number;
  readonly pageSizeOptions = pageSizeOptions;
  filterVendorUsersFields: FilterVendorUsers = new FilterVendorUsers();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  showFilterFields: boolean;
  readonly typeList = typeList;
  readonly originalOrder = originalOrder;
  constructor(private userService: UserService, private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.getVendorUsers();
  }

  /**
   * Method that gets vendor details from API
   * @param filterFlag 
   */
  getVendorUsers(filterFlag?: boolean){
    this.filterVendorUsersFields.pageIndex = this.pageIndex;
    this.filterVendorUsersFields.pageSize = this.pageSize;
    const data = this.filterVendorUsersFields.toJson();
    this.userService.postVendorUsers(data).subscribe(res => {
      this.totalVendorUsersRecords = res['result']['total_records'];
      this.vendorUsersList.data = [];
      for (const i of res['result']['records']) {
        this.vendorUsersList.data.push(VendorUsers.fromJson(i));
      }
      this.vendorUsersList.sort = this.sort;
    })
  }

  /**
   * Method that invokes on page change
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getVendorUsers();
  }

   /**
   * Method that clears filter params
   * @param fieldName 
   */
   clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterVendorUsersFields = new FilterVendorUsers();
    }
    this.getVendorUsers();
  }

  /**
   * Method that navigates to another tab based on Id
   * @param rowId
   */
  navigateToOutletDetailsInNewWindow(id: string, type: string) {
    if(type === 'restaurant'){
      type = 'food';
    }
      const link = this.router.serializeUrl(this.router.createUrlTree([type, 'outlet-details'], { queryParams: { id }} ));
      window.open(link);
  }
}
