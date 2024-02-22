import { GlobalVarComponent } from './../data-dump/global-var/global-var.component';
import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { ClientComponent } from './client/client.component';
import { LiveTrackingComponent } from './live-tracking/live-tracking.component';
import { RiderOrdersComponent } from './rider-orders/rider-orders.component';
import { RiderPayoutsComponent } from './rider-payouts/rider-payouts.component';
import { RiderShiftsComponent } from './rider-shifts/rider-shifts.component';
import { RiderPodCollectionsComponent } from './rider-pod-collections/rider-pod-collections.component';
import { RiderListsComponent } from './rider-lists/rider-lists.component';
import { RiderPingLogsComponent } from './rider-ping-logs/rider-ping-logs.component';
import { LiveDashboardComponent } from './live-dashboard/live-dashboard.component';
import { OperationalCityComponent } from './operational-city/operational-city.component';
import { OperationalZoneComponent } from './operational-zone/operational-zone.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { RiderPodDepositComponent } from './rider-pod-deposit/rider-pod-deposit.component';
import { RiderPingStatusComponent } from './rider-ping-status/rider-ping-status.component';
import { BlackZoneComponent } from './black-zone/black-zone.component';
import { SurgeMappingComponent } from './surge-mapping/surge-mapping.component';
import { LiveStatisticsComponent } from './live-statistics/live-statistics.component';

const routes: Routes = [
  {
    path: 'riders-list',
    data: { title: 'Home' },
    component: RiderListsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'client',
    data: { title: 'Clients' },
    component: ClientComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'live-tracking',
    data: { title: 'Tracking' },
    component: LiveTrackingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: RiderOrdersComponent, data: { kind: 'all', title: 'Orders' },
    canActivate: [AuthGuard]
  },
  {
    path: 'orders-settlement',
    component: RiderOrdersComponent, data: { kind: 'settlement', title: 'Orders Settlement' },
    canActivate: [AuthGuard]
  },
  {
    path: 'riders-allocation',
    component: RiderOrdersComponent, data: { kind: 'manual-allocation', title: 'Riders Allocation' },
    canActivate: [AuthGuard]
  },
  {
    path: 'payouts',
    data: { title: 'Payouts' },
    component: RiderPayoutsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rider-shifts',
    data: { title: 'Shifts' },
    component: RiderShiftsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rider-pod-collections',
    data: { title: 'POD Collections' },
    component: RiderPodCollectionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rider-ping-logs',
    data: { title: 'Rider Ping Logs' },
    component: RiderPingLogsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'live-dashboard',
    data: { title: 'Live Dashboard' },
    component: LiveDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'zone-statistics',
    data: { title: 'Zone Statistics' },
    component: LiveStatisticsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'operational-city',
    data: { title: 'Rider Operational City' },
    component: OperationalCityComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'operational-zone',
    data: { title: 'Rider Operational Zone' },
    component: OperationalZoneComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'black-zone',
    data: { title: 'Rider Black Zone' },
    component: BlackZoneComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'rider-pod-deposits',
    data: { title: 'POD Deposits' },
    component: RiderPodDepositComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'alerts',
    data: { title: 'Alerts' },
    component: RiderPingStatusComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'surge-mapping',
    data: { title: 'Surge Mapping' },
    component: SurgeMappingComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiderRoutingModule { }
