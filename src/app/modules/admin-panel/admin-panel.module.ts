import { RouterModule } from "@angular/router";
import { AdminPanelRoutingModule } from "./admin-panel-routing.module";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgmCoreModule } from "@agm/core";
import { SharedModule } from 'src/app/shared/shared.module';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { DownloadDataComponent } from './download-data/download-data.component';
import { FinanceComponent } from './finance/finance.component';
import { MenuCloningComponent } from './menu-cloning/menu-cloning.component';
import { PayoutsComponent } from './payouts/payouts.component';
import { PayoutsDialogComponent } from './payouts/payouts-dialog/payouts-dialog.component';
import { CatalogApprovalComponent } from './catalog-approval/catalog-approval.component';
import { OrdersComponent } from './orders/orders.component';
import { environment } from '../../../environments/environment';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { MenuChangesApprovalComponent } from './menu-changes-approval/menu-changes-approval.component';
import { MenuChangesDetailsComponent } from './menu-changes-approval/menu-changes-details/menu-changes-details.component';
import { PayoutDetailsComponent } from './payouts/payout-details/payout-details.component';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionDetailsComponent } from './subscriptions/subscription-details/subscription-details.component';
import { SubscriptionPaymentsComponent } from './subscription-payments/subscription-payments.component';
import { PaymentDetailsComponent } from './subscription-payments/payment-details/payment-details.component';
import { OutletsComponent } from './outlets/outlets.component';
import { OutletDialogComponent } from './outlets/outlet-dialog/outlet-dialog.component';
import { OutletDetailsComponent } from './outlet-details/outlet-details.component';
import { CatalogueComponent } from './outlet-details/catalogue/catalogue.component';
import { FinancesComponent } from './outlet-details/finances/finances.component';
import { FssaiComponent } from './outlet-details/fssai/fssai.component';
import { GeneralComponent } from './outlet-details/general/general.component';
import { HolidaySlotsComponent } from './outlet-details/holiday-slots/holiday-slots.component';
import { MenuComponent } from './outlet-details/menu/menu.component';
import { PosDetailsComponent } from './outlet-details/pos-details/pos-details.component';
import { SalesComponent } from './outlet-details/sales/sales.component';
import { SlotsComponent } from './outlet-details/slots/slots.component';
import { VendorDetailsComponent } from './outlet-details/vendor-details/vendor-details.component';
import { IvyCarouselModule } from "angular-responsive-carousel";
import { HolidaySlotsActionDialogComponent } from './outlet-details/holiday-slots/holiday-slots-action-dialog/holiday-slots-action-dialog.component';
import { AddNewAddOnComponent } from './outlet-details/menu/add-new-add-on/add-new-add-on.component';
import { AddNewDialogComponent } from './outlet-details/menu/add-new-dialog/add-new-dialog.component';
import { OfflineDialogComponent } from './outlet-details/menu/offline-dialog/offline-dialog.component';
import { SetPasswordDialogComponent } from './outlet-details/vendor-details/set-password-dialog/set-password-dialog.component';
import { ParentChildComponent } from './outlet-details/parent-child/parent-child.component';
import { AddNewChildComponent } from './outlet-details/parent-child/add-new-child/add-new-child.component';
import { AddDiscountRateComponent } from './outlet-details/add-discount-rate/add-discount-rate.component';
import { CustomerReviewComponent } from "./customer-review/customer-review.component";
import { PndMerchantComponent } from './pnd-merchant/pnd-merchant.component';
import { PndMerchantDetailsComponent } from './pnd-merchant/pnd-merchant-details/pnd-merchant-details.component';
import { InquiryOrdersComponent } from './orders/inquiry-orders/inquiry-orders.component';
import { InquiryOrdersDetailsComponent } from './orders/inquiry-orders/inquiry-orders-details/inquiry-orders-details.component';

@NgModule({
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    RouterModule,
    SharedModule,
    IvyCarouselModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
      libraries: ["places", "drawing", "geometry"],
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    UploadDataComponent,
    DownloadDataComponent,
    FinanceComponent,
    MenuCloningComponent,
    PayoutsComponent,
    PayoutsDialogComponent,
    CatalogApprovalComponent,
    OrdersComponent,
    OrderDetailsComponent,
    MenuChangesApprovalComponent,
    MenuChangesDetailsComponent,
    PayoutDetailsComponent,
    SubscriptionPlansComponent,
    SubscriptionsComponent,
    SubscriptionDetailsComponent,
    SubscriptionPaymentsComponent,
    PaymentDetailsComponent,
    OutletsComponent,
    OutletDialogComponent,
    OutletDetailsComponent,
    CatalogueComponent,
    FinancesComponent,
    FssaiComponent,
    GeneralComponent,
    HolidaySlotsComponent,
    MenuComponent,
    PosDetailsComponent,
    SalesComponent,
    SlotsComponent,
    VendorDetailsComponent,
    HolidaySlotsActionDialogComponent,
    AddNewAddOnComponent,
    AddNewDialogComponent,
    OfflineDialogComponent,
    SetPasswordDialogComponent,
    ParentChildComponent,
    AddNewChildComponent,
    AddDiscountRateComponent,
    CustomerReviewComponent,
    PndMerchantComponent,
    PndMerchantDetailsComponent,
    InquiryOrdersComponent,
    InquiryOrdersDetailsComponent,
  ],
})
export class AdminPanelModule { }
