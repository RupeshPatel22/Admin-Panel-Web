import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataDumpRoutingModule } from './data-dump-routing.module';
import { CuisinesComponent } from './cuisines/cuisines.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddCuisineDialogComponent } from './cuisines/add-cuisine-dialog/add-cuisine-dialog.component';
import { PartnerUsersComponent } from './partner-users/partner-users.component';
import { ItemsComponent } from './items/items.component';
import { PndCategoryComponent } from './pnd-category/pnd-category.component';
import { AddPndCategoryDialogComponent } from './pnd-category/add-pnd-category-dialog/add-pnd-category-dialog.component';
import { CancellationReasonComponent } from './cancellation-reason/cancellation-reason.component';
import { AddCancellationReasonDialogComponent } from './cancellation-reason/add-cancellation-reason-dialog/add-cancellation-reason-dialog.component';
import { GlobalVarComponent } from './global-var/global-var.component';
import { GlobalVarDialogComponent } from './global-var/global-var-dialog/global-var-dialog.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { ChangeLogsComponent } from './change-logs/change-logs.component';
import { ChangeLogDetailsComponent } from './change-logs/change-log-details/change-log-details.component';
import { MasterSurgeComponent } from './master-surge/master-surge.component';
import { MasterCategoryComponent } from './grocery-master-category/master-category.component';
import { AddMasterCategoryDialogComponent } from './grocery-master-category/add-master-category-dialog/add-master-category-dialog.component';
import { BannerComponent } from './banner/banner.component';
import { BannerDialogComponent } from './banner/banner-dialog/banner-dialog.component';


@NgModule({
  declarations: [
    CuisinesComponent,
    AddCuisineDialogComponent,
    PartnerUsersComponent,
    ItemsComponent,
    PndCategoryComponent,
    AddPndCategoryDialogComponent,
    CancellationReasonComponent,
    AddCancellationReasonDialogComponent,
    GlobalVarComponent,
    GlobalVarDialogComponent,
    ShiftsComponent,
    ChangeLogsComponent,
    ChangeLogDetailsComponent,
    MasterSurgeComponent,
    MasterCategoryComponent,
    AddMasterCategoryDialogComponent,
    BannerComponent,
    BannerDialogComponent,
  ],
  imports: [
    CommonModule,
    DataDumpRoutingModule,
    SharedModule
  ]
})
export class DataDumpModule { }
