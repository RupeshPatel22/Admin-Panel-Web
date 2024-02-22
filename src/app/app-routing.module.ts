import { AuthGuard } from './shared/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './shared/components/page404/page404.component';
import { Page500Component } from './shared/components/page500/page500.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'server-error',
    data: {title:'Server Error'},
    component: Page500Component
  },
  {
    path: '**',
    data: {title:'Page not found'},
    component: Page404Component
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
