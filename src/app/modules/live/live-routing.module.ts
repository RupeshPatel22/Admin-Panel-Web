import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllServiceLiveStatisticsComponent } from './all-service-live-statistics/all-service-live-statistics.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'all-service-live-statistics',
    data: { title: 'Live' },
    component: AllServiceLiveStatisticsComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveRoutingModule { }
