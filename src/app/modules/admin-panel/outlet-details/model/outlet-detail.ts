import { Type } from '@angular/core'
import { IRouteAccess, Roles, Services } from 'src/app/shared/models'
import { CatalogueComponent } from '../catalogue/catalogue.component'
import { FinancesComponent } from '../finances/finances.component'
import { FssaiComponent } from '../fssai/fssai.component'
import { GeneralComponent } from '../general/general.component'
import { HolidaySlotsComponent } from '../holiday-slots/holiday-slots.component'
import { MenuComponent } from '../menu/menu.component'
import { PosDetailsComponent } from '../pos-details/pos-details.component'
import { SalesComponent } from '../sales/sales.component'
import { SlotsComponent } from '../slots/slots.component'
import { VendorDetailsComponent } from '../vendor-details/vendor-details.component'
import { ParentChildComponent } from '../parent-child/parent-child.component'
import { AddDiscountRateComponent } from '../add-discount-rate/add-discount-rate.component'

export enum TabLabel {
  General = 'General',
  Catalogue = 'Catalogue',
  Menu = 'Menu',
  Slots = 'Slots',
  Finances = 'Finances',
  Fssai = 'Fssai',
  HolidaySlots = 'Holiday Slots',
  SalesReport = 'Sales Report',
  VendorDetails = 'Vendor Details',
  PosDetails = 'POS Details',
  ParentChild = 'Parent-Child Outlet Details',
  DiscountRate = 'Discount Rate'
}

export const allowedTabAccessTo: { [key: string]: IRouteAccess } = {
  'TabLabel.General': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [
      Roles.superadmin,
      Roles.admin,
      Roles.serviceability,
      Roles.ops_manager
    ]
  },
  'TabLabel.Catalogue': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.ops_manager]
  },
  'TabLabel.Menu': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.ops_manager]
  },
  'TabLabel.Slots': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.ops_manager]
  },
  'TabLabel.Finances': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.ops_manager]
  },
  'TabLabel.Fssai': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.ops_manager]
  },
  'TabLabel.HolidaySlots': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.ops_manager]
  },
  'TabLabel.SalesReport': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.ops_manager,Roles.finance_manager]
  },
  'TabLabel.VendorDetails': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.ops_manager]
  },
  'TabLabel.PosDetails': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.ops_manager]
  },
  'TabLabel.ParentChild': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.PND,
      Services.Pharmacy,
      Services.Rider,
      Services.User,
      Services.Core,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
  },
  'TabLabel.DiscountRate': {
    service: [
      Services.Food,
      Services.Grocery,
      Services.Pharmacy,
      Services.Paan,
      Services.Flower,
      Services.Pet,
    ],
    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
  },
}

export interface ITab {
  label: TabLabel
  component: Type<any>
  allowedTabAccessTo: IRouteAccess
}

export const tabs: ITab[] = [
  {
    label: TabLabel.General,
    component: GeneralComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.Catalogue,
    component: CatalogueComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.Menu,
    component: MenuComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.Slots,
    component: SlotsComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.Finances,
    component: FinancesComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.Fssai,
    component: FssaiComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.HolidaySlots,
    component: HolidaySlotsComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.SalesReport,
    component: SalesComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.VendorDetails,
    component: VendorDetailsComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        Services.PND,
        Services.Pharmacy,
        Services.Rider,
        Services.User,
        Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.PosDetails,
    component: PosDetailsComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        // Services.Grocery,
        // Services.PND,
        // Services.Pharmacy,
        // Services.Rider,
        // Services.User,
        // Services.Core,
        // Services.Paan,
        // Services.Flower,
        // Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.ParentChild,
    component: ParentChildComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        // Services.Grocery,
        // Services.PND,
        // Services.Pharmacy,
        // Services.Rider,
        // Services.User,
        // Services.Core,
        // Services.Paan,
        // Services.Flower,
        // Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
  {
    label: TabLabel.DiscountRate,
    component: AddDiscountRateComponent,
    allowedTabAccessTo: {
      service: [
        Services.Food,
        Services.Grocery,
        // Services.PND,
        Services.Pharmacy,
        // Services.Rider,
        // Services.User,
        // Services.Core,
        Services.Paan,
        Services.Flower,
        Services.Pet,
      ],
      role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
    }
  },
]
