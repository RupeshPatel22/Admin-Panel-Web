import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRoutingModule } from './live-routing.module';
import { AllServiceLiveStatisticsComponent } from './all-service-live-statistics/all-service-live-statistics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [AllServiceLiveStatisticsComponent],
  imports: [
    CommonModule,
    LiveRoutingModule,
    SharedModule,
    RouterModule
  ]
})
export class LiveModule { }
