import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {title: ''},
    children: [
      {
        path: 'food',
        loadChildren: () => import('../admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'pnd',
        loadChildren: () => import('../admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'grocery',
        loadChildren: () => import('../admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: ':service/data-dump',
        loadChildren: () => import('../data-dump/data-dump.module').then(m => m.DataDumpModule)
      },
      {
        path: 'rider',
        loadChildren: () => import('../rider/rider.module').then(m => m.RiderModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'user',
        loadChildren: () => import('../user/user.module').then(m => m.UserModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'core',
        loadChildren: () => import('../core/core.module').then(m => m.CoreModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'paan',
        loadChildren: () => import('../admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'flower',
        loadChildren: () => import('../admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'pharmacy',
        loadChildren: () => import('../admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'live',
        loadChildren: () => import('../live/live.module').then(m => m.LiveModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'pet',
        loadChildren: () => import('../admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
      {
        path: 'notification',
        loadChildren: () => import('../push-notification/push-notification.module').then(m => m.PushNotificationModule),
        canActivate: [AuthGuard],
        data: {title: ''}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
