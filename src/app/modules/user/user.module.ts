import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { CustomerDialogComponent } from './customers/customer-dialog/customer-dialog.component';
import { AdminUserDialogComponent } from './admin-users/admin-user-dialog/admin-user-dialog.component';
import { VendorUsersComponent } from './vendor-users/vendor-users.component';


@NgModule({
  declarations: [
    CustomersComponent,
    AdminUsersComponent,
    CustomerDialogComponent,
    AdminUserDialogComponent,
    VendorUsersComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
