import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Roles, pageSize, pageSizeOptions } from 'src/app/shared/models';
import { UserService } from 'src/app/shared/services/user.service';
import { Customer, FilterCustomer } from './model/customer';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { validateEmail, validatePhone } from 'src/app/shared/functions/common-validation.functions';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customersList: MatTableDataSource<Customer> = new MatTableDataSource();
  displayedColumns: string[] = ['sr no', 'name', 'phone', 'email', 'isBlocked', 'blockedReason', 'blockedByAdminName', 'unblockedReason', 'unblockedByAdminName','action'];
  blockedCustomerDisplayColumns: string[] =['sr no', 'name', 'phone', 'email', 'isBlocked', 'blockedReason', 'blockedByAdminName','action'];
  unblockedCustomerDisplayColumns: string[] =['sr no', 'name', 'phone', 'email', 'isBlocked', 'unblockedReason', 'unblockedByAdminName','action'];
  pageIndex: number = 0;
  pageSize: number = pageSize;
  totalRecords: number;
  showFilterFields: boolean = true;
  filterCustomerFields: FilterCustomer = new FilterCustomer();
  blockStatus: boolean [];
  readonly pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly Roles = Roles;

    constructor(private userService: UserService, private dialog: MatDialog, private toastMsgService: ToastService, private sharedService: SharedService) { }

  ngOnInit(): void {
    if(![Roles.superadmin].some(r => this.sharedService.roles.includes(r))) {
      this.displayedColumns = this.displayedColumns.filter(c => c !== 'action');
      this.blockedCustomerDisplayColumns = this.blockedCustomerDisplayColumns.filter(c => c!=='action');
      this.unblockedCustomerDisplayColumns = this.unblockedCustomerDisplayColumns.filter(c => c!=='action');
    }
    this.displayedColumns = this.displayedColumns.filter(c => c !== 'blockedReason' && c !== 'blockedByAdminName' && c !== 'unblockedReason' && c !== 'unblockedByAdminName');
  }
  /**
   * Method that gets customer data
   * @param filterFlag 
   */
  getCustomers(filterFlag?: boolean) {
    if (!this.isValidFilterFields()) return;
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
  
    this.filterCustomerFields.pageIndex = this.pageIndex;
    this.filterCustomerFields.pageSize = this.pageSize;
    const data = this.filterCustomerFields.toJson();
  
    this.userService.filterCustomerUsers(data).subscribe(res => {
      this.totalRecords = res.result.total_records;
      this.customersList.data = [];
      this.blockStatus = [];
  
      if (res.result.records) {
        for (const i of res.result.records) {
          this.customersList.data.push(Customer.fromJson(i));
          this.blockStatus.push(i.is_blocked);
        }
  
        const filterBlockStatusTrue = this.blockStatus.filter(t => t === true);
        const filterBlockStatusFalse = this.blockStatus.filter(t => t === false);
  
        if (filterBlockStatusTrue.length === this.blockStatus.length) {
          this.displayedColumns = this.blockedCustomerDisplayColumns;
        } else if (filterBlockStatusFalse.length === this.blockStatus.length) {
          this.displayedColumns = this.unblockedCustomerDisplayColumns;
        } else {
          this.displayedColumns = ['sr no', 'name', 'phone', 'email', 'isBlocked', 'blockedReason', 'blockedByAdminName', 'unblockedReason', 'unblockedByAdminName', 'action'];
        }
      }
  
      this.customersList.sort = this.sort;
    });
  }
  

  /**
 * Method that invokes on page change
 * @param event 
 */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCustomers();
  }

  /**
  * Method that clears filter params
  * @param fieldName 
  */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterCustomerFields = new FilterCustomer();
    }
    this.getCustomers();
    this.displayedColumns = this.displayedColumns.filter(c => c !== 'blockedReason' && c !== 'blockedByAdminName' && c !== 'unblockedReason' && c !== 'unblockedByAdminName')
  }

  /**
   * method that checks the validity of the filter fields
   * @returns 
   */
   isValidFilterFields(): boolean {
    let errorMsg: string;
    if (this.filterCustomerFields.phone) {
      const phones = this.filterCustomerFields.phone.split(',');
      for (const phone of phones) {
        errorMsg = validatePhone(phone.trim());
        if (errorMsg) {
          this.toastMsgService.showError(errorMsg);
          return false;
        }
      }
    }
    if (this.filterCustomerFields.email) {
      const emails = this.filterCustomerFields.email.split(',');
      for (const email of emails) {
        errorMsg = validateEmail(email.trim());
        if (errorMsg) {
          this.toastMsgService.showError(errorMsg);
          return false;
        }
      }
    }
    return true
  }
 
  /**
 * Changes the status of a customer (block/unblock) based on the current status.
 * Opens a dialog to prompt the user for a reason before changing the status.
 * 
 * @param customer - The customer object to change the status for.
 */
  changeCustomerStatus(customer: Customer) {
    const action = customer.isBlocked ? 'Unblocking' : 'Blocking';
    const title = `Enter Reason For ${action} Customer`;
  
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: {
        title: title,      
      },
      autoFocus: false,
    });
  
    dialogRef.afterClosed().subscribe((response) => {
      if (response.flag) {
        const status = customer.isBlocked ? 'unBlock' : 'block';
        const reasonKey = customer.isBlocked ? 'unblocked_reason' : 'blocked_reason';
        const data = {
          [reasonKey]: response.comments
        };
  
        this.userService[status + 'Customer'](customer.id, data).subscribe((res) => {
          this.toastMsgService.showSuccess('Status has been updated')
          customer.isBlocked = !customer.isBlocked;
          this.getCustomers();
        });
      }
    });
  }

  
}
