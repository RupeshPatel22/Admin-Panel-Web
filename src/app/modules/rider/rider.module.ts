import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiderRoutingModule } from './rider-routing.module';
import { ClientComponent } from './client/client.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RiderDetailsComponent } from './rider-lists/rider-details/rider-details.component';
import { LiveTrackingComponent } from './live-tracking/live-tracking.component';
import { environment } from 'src/environments/environment';
import { AgmCoreModule } from '@agm/core';
import { RiderOrdersComponent } from './rider-orders/rider-orders.component';
import { RiderOrdersDetailsComponent } from './rider-orders/rider-orders-details/rider-orders-details.component';
import { RiderPayoutsComponent } from './rider-payouts/rider-payouts.component';
import { RiderPayoutDetailsComponent } from './rider-payouts/rider-payout-details/rider-payout-details.component';
import { RiderShiftsComponent } from './rider-shifts/rider-shifts.component';
import { RiderPodCollectionsComponent } from './rider-pod-collections/rider-pod-collections.component';
import { RiderPodCollectionsDetailsComponent } from './rider-pod-collections/rider-pod-collections-details/rider-pod-collections-details.component';
import { RiderListsComponent } from './rider-lists/rider-lists.component';
import { RiderShiftsDetailsComponent } from './rider-shifts/rider-shifts-details/rider-shifts-details.component';
import { RiderPingLogsComponent } from './rider-ping-logs/rider-ping-logs.component';
import { LiveDashboardComponent } from './live-dashboard/live-dashboard.component';
import { OperationalCityComponent } from './operational-city/operational-city.component';
import { OperationalZoneComponent } from './operational-zone/operational-zone.component';
import { OperationalZoneListComponent } from './operational-zone/operational-zone-list/operational-zone-list.component';
import { OperationalCityListComponent } from './operational-city/operational-city-list/operational-city-list.component';
import { RiderPodDepositComponent } from './rider-pod-deposit/rider-pod-deposit.component';
import { RiderPodDepositDetailsComponent } from './rider-pod-deposit/rider-pod-deposit-details/rider-pod-deposit-details.component';
import { RiderPingStatusComponent } from './rider-ping-status/rider-ping-status.component';
import { BlackZoneComponent } from './black-zone/black-zone.component';
import { BlackZoneListComponent } from './black-zone/black-zone-list/black-zone-list.component';
import { SurgeMappingComponent } from './surge-mapping/surge-mapping.component';
import { LiveStatisticsComponent } from './live-statistics/live-statistics.component';


@NgModule({
  declarations: [ClientComponent, 
    RiderDetailsComponent, 
    LiveTrackingComponent, 
    RiderOrdersComponent, 
    RiderOrdersDetailsComponent,
    RiderPayoutsComponent,
    RiderPayoutDetailsComponent,
    RiderShiftsComponent,
    RiderPodCollectionsComponent,
    RiderPodCollectionsDetailsComponent,
    RiderListsComponent,
    RiderShiftsDetailsComponent,
    RiderPingLogsComponent,
    LiveDashboardComponent,
    OperationalCityComponent,
    OperationalZoneComponent,
    OperationalZoneListComponent,
    OperationalCityListComponent,
    RiderPodDepositComponent,
    RiderPodDepositDetailsComponent,
    RiderPingStatusComponent,
    BlackZoneComponent,
    BlackZoneListComponent,
    SurgeMappingComponent,
    LiveStatisticsComponent,
  ],
  imports: [
    CommonModule,
    RiderRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
      libraries: ["places", "drawing", "geometry"],
    }),
  ]
})
export class RiderModule { }
