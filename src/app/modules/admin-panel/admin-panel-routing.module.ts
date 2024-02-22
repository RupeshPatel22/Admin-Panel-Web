import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { DownloadDataComponent } from './download-data/download-data.component';
import { FinanceComponent } from './finance/finance.component';
import { MenuCloningComponent } from './menu-cloning/menu-cloning.component';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { PayoutsComponent } from './payouts/payouts.component';
import { CatalogApprovalComponent } from './catalog-approval/catalog-approval.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { MenuChangesApprovalComponent } from './menu-changes-approval/menu-changes-approval.component';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionPaymentsComponent } from './subscription-payments/subscription-payments.component';
import { Services } from 'src/app/shared/models';
import { OutletsComponent } from './outlets/outlets.component';
import { OutletDetailsComponent } from './outlet-details/outlet-details.component';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
import { PndMerchantComponent } from './pnd-merchant/pnd-merchant.component';
import { InquiryOrdersComponent } from './orders/inquiry-orders/inquiry-orders.component';


const routes: Routes = [
  {
    path: 'home',
    data: { title: 'Home' },
    component: OutletsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'outlet-details',
    data: { title: '' },
    component: OutletDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'upload-data',
    data: { title: 'Upload Data' },
    component: UploadDataComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'download-data',
    data: { title: 'Download Data' },
    component: DownloadDataComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'finance',
  //   component: FinanceComponent
  // },
  {
    path: 'payouts',
    data: { title: 'Payouts' },
    component: PayoutsComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'menu-cloning',
  //   component: MenuCloningComponent
  // },
  {
    path: 'catalog-approval',
    data: { title: 'Catalog Aprroval' },
    component: CatalogApprovalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu-changes-review',
    data: { title: 'Menu Changes Review' },
    component: MenuChangesApprovalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu-changes-review-history',
    component: MenuChangesApprovalComponent, data: { kind: 'history', title: 'Menu Changes Review History' },
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrdersComponent, data: { kind: 'all', title: 'Orders' },
    canActivate: [AuthGuard]
  },
  {
    path: 'orders-for-cancellation',
    component: OrdersComponent, data: { kind: 'cancellation', title: 'Orders For Cancellation' },
    canActivate: [AuthGuard]
  },
  {
    path: 'orders-for-refund',
    component: OrdersComponent, data: { kind: 'refund', title: 'Orders For Refund' },
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-orders',
    component: OrdersComponent, data: { kind: 'customer-orders', title: 'Customer Orders' },
    canActivate: [AuthGuard]
  },
  {
    path: 'subscription-plans',
    data: { title: 'Subscription Plans' },
    component: SubscriptionPlansComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'subscriptions',
    data: { title: 'Subscriptions' },
    component: SubscriptionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'subscription-payments',
    data: { title: 'Subscription Payments' },
    component: SubscriptionPaymentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-review',
    data: { title: 'Customer Review' },
    component: CustomerReviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pnd-merchant',
    data: {kind: 'all', title: 'Merchants'},
    component: PndMerchantComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pnd-merchant-kyc-pending',
    data: {kind: 'kyc-pending', title: 'Merchant KYC Pending'},
    component: PndMerchantComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inquiry-orders',
    data: { title: 'Inquiry Order' },
    component: InquiryOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule {
}
