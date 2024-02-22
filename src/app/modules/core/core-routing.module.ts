import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { AreaComponent } from './area/area.component';
import { CityComponent } from './city/city.component';
import { ClientLogsComponent } from './client-logs/client-logs.component';
import { AllServicesComponent } from './all-services/all-services.component';

const routes: Routes = [

  {
    path: 'city',
    data: { title: 'City' },
    component: CityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'area',
    data: { title: 'Area' },
    component: AreaComponent, canDeactivate: [CanDeactivateGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'client-logs',
    data: {title: 'Client Logs'},
    component: ClientLogsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'all-services',
    data: {title: 'All Services'},
    component: AllServicesComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
