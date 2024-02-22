import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { CancellationReasonComponent } from './cancellation-reason/cancellation-reason.component';
import { ChangeLogsComponent } from './change-logs/change-logs.component';
import { CuisinesComponent } from './cuisines/cuisines.component';
import { GlobalVarComponent } from './global-var/global-var.component';
import { ItemsComponent } from './items/items.component';
import { PartnerUsersComponent } from './partner-users/partner-users.component';
import { PndCategoryComponent } from './pnd-category/pnd-category.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { MasterSurgeComponent } from './master-surge/master-surge.component';
import { MasterCategoryComponent } from './grocery-master-category/master-category.component';
import { BannerComponent } from './banner/banner.component';

const routes: Routes = [
  // {
  //   path: 'items',
  //   component: ItemsComponent
  // },
  {
    path: 'cuisines',
    data: {title: 'Cuisines Dump'},
    component: CuisinesComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'vendor-users',
  //   component: PartnerUsersComponent
  // }
  {
    path: 'pnd-category',
    data: {title: 'Pick&Drop'},
    component: PndCategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cancellation-reason',
    data: {title: 'Cancellation Reason'},
    component: CancellationReasonComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'global-var',
    data: {title: 'Global Variables'},
    component: GlobalVarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shifts',
    data: { title: 'Master Shifts' },
    component: ShiftsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'change-logs',
    data: { title: 'Change Logs' },
    component: ChangeLogsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'master-surge',
    data: {title: 'Master Surge'},
    component: MasterSurgeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'master-category',
    data: {title: 'Mater Catergory  Dump'},
    component: MasterCategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'banner',
    data: { title: 'Banners' },
    component: BannerComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataDumpRoutingModule { }
