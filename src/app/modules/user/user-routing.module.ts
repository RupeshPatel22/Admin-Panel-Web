import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { CustomersComponent } from './customers/customers.component';
import { VendorUsersComponent } from './vendor-users/vendor-users.component';

const routes: Routes = [
  {
    path: 'customers',
    data: { title: 'Customers' },
    component: CustomersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-users',
    data: {title: 'Admin Users'},
    component: AdminUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor-users',
    data: {title: 'vendor Users'},
    component: VendorUsersComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
