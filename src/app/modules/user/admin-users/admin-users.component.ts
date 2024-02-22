import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { emailValidator, validateEmail, validatePhone } from 'src/app/shared/functions/common-validation.functions';
import { originalOrder } from 'src/app/shared/functions/modular.functions';
import { pageSize, pageSizeOptions, Roles } from 'src/app/shared/models';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AdminUser, AdminUserAction, FilterAdminUser } from './model/admin-user';
import { MatDialog } from '@angular/material/dialog';
import { AdminUserDialogComponent } from './admin-user-dialog/admin-user-dialog.component';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  adminUsersList: MatTableDataSource<AdminUser> = new MatTableDataSource();
  displayedColumns: string[] = ['sr no', 'name', 'email', 'phone', 'loginId', 'roles','isBlock','blockedReason','blockedByAdminName','unBlockedReason','unBlockedByAdminName', 'action'];
  blockedAdminDisplayColumns: string[] = ['sr no', 'name', 'email', 'phone', 'loginId', 'roles','isBlock','blockedReason','blockedByAdminName','action'];
  unblockedAdminDisplayColumns: string[] = ['sr no', 'name', 'email', 'phone', 'loginId', 'roles','isBlock','unBlockedReason','unBlockedByAdminName', 'action'];
  pageIndex: number = 0;
  pageSize: number = pageSize;
  totalAdminUsersRecords: number;
  showFilterFields: boolean;
  showAdminUserModal: boolean;
  action: AdminUserAction;
  filterAdminUserFields: FilterAdminUser = new FilterAdminUser();
  readonly pageSizeOptions = pageSizeOptions;
  readonly adminRoles = Roles;
  readonly originalOrder = originalOrder;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  blockStatus: boolean [];

  adminUserForm = new FormGroup({
    id: new FormControl({ disabled: true, value: '' }),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, emailValidator()]),
    phone: new FormControl('', [Validators.required, Validators.pattern("[6-9][0-9]{9}")]),
    loginId: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    roles: new FormControl('', [Validators.required])
  })
  constructor(private userService: UserService, private toastMsgService: ToastService, private dialog: MatDialog,private sharedService: SharedService) { }

  ngOnInit(): void {
    this.displayedColumns = this.displayedColumns.filter(c => c !== ('blockedReason' && 'blockedByAdminName' && 'unblockedReason' && 'unblockedByAdminName'));
    if(![Roles.superadmin].some(r => this.sharedService.roles.includes(r))) {
      this.displayedColumns = this.displayedColumns.filter(c => c !== 'action');
      this.blockedAdminDisplayColumns = this.blockedAdminDisplayColumns.filter(c => c!=='action');
      this.unblockedAdminDisplayColumns = this.unblockedAdminDisplayColumns.filter(c => c!=='action');
    }
    this.getAdminUsersList();
  }

  /**
   * Method that gets admin users from API
   * @param filterFlag 
   */
  getAdminUsersList(filterFlag?: boolean) {
    if (!this.isValidFilterFields()) return;
    if (filterFlag) {
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
    }
    this.filterAdminUserFields.pageIndex = this.pageIndex;
    this.filterAdminUserFields.pageSize = this.pageSize;
    const data = this.filterAdminUserFields.toJson();
    this.userService.filterAdminUsers(data).subscribe(res => {
      this.totalAdminUsersRecords = res['result']['total_records'];
      this.adminUsersList.data = [];
      this.blockStatus = [];

      for (const i of res['result']['records']) {
        this.adminUsersList.data.push(AdminUser.fromJson(i));
        this.blockStatus.push(i.is_blocked);
      }

      const filterBlockStatusTrue = this.blockStatus.filter(t => t === true);
      const filterBlockStatusFalse = this.blockStatus.filter(t => t === false);

      if(filterBlockStatusTrue.length === this.blockStatus.length) {
        this.displayedColumns = this.blockedAdminDisplayColumns;
      } else if(filterBlockStatusFalse.length === this.blockStatus.length) {
        this.displayedColumns = this.unblockedAdminDisplayColumns;
      } else {
        this.displayedColumns = ['sr no', 'name', 'email', 'phone', 'loginId', 'roles','isBlock','blockedReason','blockedByAdminName','unBlockedReason','unBlockedByAdminName', 'action'];
      }

      this.adminUsersList.sort = this.sort;
    })
  }

  /**
   * Method that adds or edit admin user
   * @returns 
   */
  submitAdminUser() {
    if (this.adminUserForm.status === 'INVALID') return this.adminUserForm.markAllAsTouched();
    const formValues: AdminUser = this.adminUserForm.getRawValue();
    const data: AdminUser = new AdminUser();
    Object.assign(data, formValues);
    if (this.action === 'Add') {
      this.userService.postAdminUser(data.toJson(this.action)).subscribe(res => {
        this.toastMsgService.showSuccess('User created successfully');
        this.getAdminUsersList();
        this.closeAdminUserModal();
      })
    }
    if (this.action === 'Edit') {
      this.userService.putAdminUser(data.id, data.toJson(this.action)).subscribe(res => {
        this.toastMsgService.showSuccess('User updated successfully');
        this.getAdminUsersList();
        this.closeAdminUserModal();
      })
    }
  }

  /**
   * Method that invokes on page change
   * @param event 
   */
  onPageChange(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAdminUsersList();
  }

  /**
   * Method that opens adminUserModal
   * and sets form-values if action type = edit
   * @param actionType 
   * @param adminUser 
   */
  openAdminUserModal(actionType: AdminUserAction, adminUser?: AdminUser) {
    if (actionType === 'Edit') {
      this.adminUserForm.patchValue({ ...adminUser });
      this.adminUserForm.get('password').disable();
    } 
    else {
      this.adminUserForm.get('password').enable();
    }
    this.action = actionType;
    this.showAdminUserModal = true;
  }

  /**
   * Method that closes the admin user modal
   */
  closeAdminUserModal() {
    this.adminUserForm.reset();
    this.showAdminUserModal = false;
  }

  /**
   * Method that clears filter params
   * @param fieldName 
   */
  clearFilter(fieldName?: 'all') {
    if (fieldName === 'all') {
      this.showFilterFields = false;
      this.filterAdminUserFields = new FilterAdminUser();
    }
    this.getAdminUsersList();
    this.displayedColumns = this.displayedColumns.filter(c => c !== ('blockedReason' && 'blockedByAdminName' && 'unblockedReason' && 'unblockedByAdminName'));
  }

  /**
   * method that checks the validity of the filter fields
   * @returns 
   */
   isValidFilterFields(): boolean {
    const validationItems = [
      {validator: validatePhone, args: [this.filterAdminUserFields.phone]},
      {validator: validateEmail, args: [this.filterAdminUserFields.email]},
    ]
    for (const item of validationItems) {
      const errorMsg = item.validator.apply(null, item.args);
      if (errorMsg) {
        this.toastMsgService.showError(errorMsg);
        return false;
      }
    }
    return true
  }

  changeAdminStatus(admin: AdminUser){
    const action = admin.isBlock? 'Unblocking' : 'Blocking';
    const title = `Enter Reason For ${action} Admin`;

    const dialogRef = this.dialog.open(AdminUserDialogComponent, {
      data: {
        title: title,
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((response) => {
      if(response.flag) {
        const status = admin.isBlock? 'unBlock' : 'block';
        const reasonKey = admin.isBlock? 'unblocked_reason' : 'blocked_reason';
        const data = {
          [reasonKey]: response.comments
        };

        this.userService[status + 'Admin'](admin.id, data).subscribe((res) => {
          this.toastMsgService.showSuccess('Status has been updated');
          admin.isBlock = !admin.isBlock;
          this.getAdminUsersList();
        });
      }
    })
  }
}
