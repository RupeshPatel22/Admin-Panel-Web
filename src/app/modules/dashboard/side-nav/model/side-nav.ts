import { IRouteAccess, Roles, Services } from "src/app/shared/models";

export const navLinks: INavLink[] = [
    {
        name: 'All Live Orders',
        icon: 'assets/icons/home.svg',
        route: 'all-service-live-statistics',
        allowedRouteAccessTo: {
            service: [Services.Live],
            role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
        }
    },
    {
        name: 'Home',
        icon: 'assets/icons/home.svg',
        route: 'home',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
        }
    },
    {
        name: 'Orders',
        icon: 'assets/icons/orders-icon.svg',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.PND, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.oneview, Roles.ops_manager, Roles.catalog, Roles.finance_manager]
        },
        subMenu: [
            {
                name: 'All Orders',
                route: 'orders',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.PND, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.oneview, Roles.ops_manager, Roles.catalog, Roles.finance_manager]
                }
            },
            {
                name: 'For Cancellation',
                route: 'orders-for-cancellation',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.PND, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.finance_manager]
                }
            },
            {
                name: 'For Refund',
                route: 'orders-for-refund',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.PND, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.finance_manager]
                }
            },
        ],
    },
    {
        name: 'Inquiry Orders',
        icon: 'assets/icons/inquiry-order-icon.svg',
        route: 'inquiry-orders',
        allowedRouteAccessTo: {
            service: [Services.Grocery],
            role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
        }
    },
    {
        name: 'Upload Data',
        icon: 'assets/icons/upload-data.svg',
        route: 'upload-data',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
        }
    },
    {
        name: 'Download Data',
        icon: 'assets/icons/download-data.svg',
        route: 'download-data',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
        }
    },
    // {
    //   name: 'Log Data',
    //   icon: 'assets/icons/log-data.svg',
    //   route: 'log-data',
    // },
    // {
    //   name: 'Finance',
    //   icon: 'assets/icons/finance.svg',
    //   route: 'finance',
    // },
    {
        name: 'Payouts',
        icon: 'assets/icons/finance.svg',
        route: 'payouts',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.finance_manager]
        }
    },
    // {
    //   name: 'Menu Cloning',
    //   icon: 'assets/icons/menu-cloning.svg',
    //   route: 'menu-cloning',
    // },
    {
        name: 'Catalog Approval',
        icon: 'assets/icons/catalog-approval-icon.svg',
        route: 'catalog-approval',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.Pharmacy,Services.Paan, Services.Flower, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
        }
    },
    {
        name: 'Menu Changes',
        icon: 'assets/icons/menu-changes-approval-icon.svg',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        },
        subMenu: [
            {
                name: 'Review',
                route: 'menu-changes-review',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            {
                name: 'History',
                route: 'menu-changes-review-history',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            }
        ],
    },
    {
        name: 'Subscriptions',
        icon: 'assets/icons/subscription-icon.svg',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.Paan, Services.Flower, Services.Pharmacy, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        },
        subMenu: [
            {
                name: 'Plans',
                route: 'subscription-plans',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.Paan, Services.Flower, Services.Pharmacy, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            {
                name: 'All Subscriptions',
                route: 'subscriptions',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.Paan, Services.Flower, Services.Pharmacy, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            {
                name: 'Payments',
                route: 'subscription-payments',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.Paan, Services.Flower, Services.Pharmacy, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            }
        ],
    },
    {
        name: 'Customer-review',
        icon: 'assets/icons/customer-review.svg',
        route: 'customer-review',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.Paan, Services.Flower, Services.Pharmacy, Services.Pet],
            role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Live Dashboard',
        icon: 'assets/icons/live-dashboard.svg',
        route: 'live-dashboard',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Zone Statistics',
        icon: 'assets/icons/live-dashboard.svg',
        route: 'zone-statistics',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Riders',
        icon: 'assets/icons/rider-icon.svg',
        route: 'riders-list',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.fleet_manager, Roles.ops_manager]
        }
    },
    {
        name: 'Alerts',
        icon: 'assets/icons/alerts-icon.svg',
        route: 'alerts',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.fleet_manager, Roles.ops_manager]
        }
    },
    {
        name: 'Client',
        icon: 'assets/icons/client-icon.svg',
        route: 'client',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        }
    },
    {
        name: 'Operational City',
        icon: 'assets/icons/operational-city.svg',
        route: 'operational-city',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        }
    },
    {
        name: 'Operational Zone',
        icon: 'assets/icons/operational-zone.svg',
        route: 'operational-zone',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        }
    },
    {
        name: 'Black Zone',
        icon: 'assets/icons/operational-zone.svg',
        route: 'black-zone',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        }
    },
    {
        name: 'Tracking',
        icon: 'assets/icons/tracking.svg',
        route: 'live-tracking',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.fleet_manager, Roles.ops_manager]
        }
    },
    {
        name: 'Orders',
        icon: 'assets/icons/orders-icon.svg',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.finance_manager]
        },
        subMenu: [
            {
                name: 'All Orders',
                route: 'orders',
                allowedRouteAccessTo: {
                    service: [Services.Rider],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.finance_manager]
                }
            },
            {
                name: 'Settle Orders',
                route: 'orders-settlement',
                allowedRouteAccessTo: {
                    service: [Services.Rider],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.finance_manager]
                }
            },
        ],
    },
    {
        name: 'Riders Allocation',
        icon: 'assets/icons/rider-icon.svg',
        route: 'riders-allocation',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        }
    },
    {
        name: 'Payouts',
        icon: 'assets/icons/finance.svg',
        route: 'payouts',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Rider Shifts',
        icon: 'assets/icons/rider-shift-icon.svg',
        route: 'rider-shifts',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.fleet_manager, Roles.ops_manager]
        }
    },
    {
        name: 'POD Collections',
        icon: 'assets/icons/finance.svg',
        route: 'rider-pod-collections',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'POD Deposits',
        icon: 'assets/icons/pod-deposit-icon.svg',
        route: 'rider-pod-deposits',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Surge mapping',
        icon: 'assets/icons/surge-mapping-icon.svg',
        route: 'surge-mapping',
        allowedRouteAccessTo: {
            service: [Services.Rider],
            role: [Roles.superadmin, Roles.admin, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Customers',
        icon: 'assets/icons/customer-icon.svg',
        route: 'customers',
        allowedRouteAccessTo: {
            service: [Services.User],
            role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Admin Users',
        icon: 'assets/icons/admin-icon.svg',
        route: 'admin-users',
        allowedRouteAccessTo: {
            service: [Services.User],
            role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'City',
        icon: 'assets/icons/city.svg',
        route: 'city',
        allowedRouteAccessTo: {
            service: [Services.Core],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        }
    },
    {
        name: 'Area',
        icon: 'assets/icons/area.svg',
        route: 'area',
        allowedRouteAccessTo: {
            service: [Services.Core],
            role: [Roles.superadmin, Roles.serviceability, Roles.ops_manager]
        }
    },
    {
        name: 'Client Logs',
        icon: 'assets/icons/client-logs-icon.svg',
        route: 'client-logs',
        allowedRouteAccessTo: {
            service: [Services.Core],
            role: [Roles.superadmin, Roles.admin]
        }
    },
    {
        name: 'All Services',
        icon: 'assets/icons/all-services.svg',
        route: 'all-services',
        allowedRouteAccessTo: {
            service: [Services.Core],
            role: [Roles.superadmin, Roles.admin]
        }
    },
    {
        name: 'Vendor Users',
        icon: 'assets/icons/admin-icon.svg',
        route: 'vendor-users',
        allowedRouteAccessTo: {
            service: [Services.User],
            role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Merchants',
        icon: 'assets/icons/admin-icon.svg',
        route: 'pnd-merchant',
        allowedRouteAccessTo: {
            service: [Services.PND],
            role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'KYC Pending',
        icon: 'assets/icons/client-logs-icon.svg',
        route: 'pnd-merchant-kyc-pending',
        allowedRouteAccessTo: {
            service: [Services.PND],
            role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
        }
    },
    {
        name: 'Data Dump',
        icon: 'assets/icons/data-dump.svg',
        allowedRouteAccessTo: {
            service: [Services.Food, Services.Grocery, Services.PND, Services.Pharmacy, Services.Rider, Services.User, Services.Paan, Services.Flower, Services.Pet, Services.Core],
            role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
        },
        subMenu: [
            // {
            //   name: 'Items',
            //   route: 'data-dump/items',
            // },
            {
                name: 'Cuisines',
                route: 'data-dump/cuisines',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Paan, Services.Flower, Services.Pharmacy, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            {
                name: 'Master Category',
                route: 'data-dump/master-category',
                allowedRouteAccessTo: {
                    service: [Services.Grocery, Services.Pharmacy, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            // {
            //   name: 'Vendor-Users',
            //   route: 'data-dump/vendor-users',
            // },
            {
                name: 'Category',
                route: 'data-dump/pnd-category',
                allowedRouteAccessTo: {
                    service: [Services.PND],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            {
                name: 'Cancellation Reason',
                route: 'data-dump/cancellation-reason',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.PND, Services.Pharmacy, Services.Paan, Services.Flower, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            {
                name: 'Global Var',
                route: 'data-dump/global-var',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.PND, Services.Rider, Services.User,Services.Grocery, Services.Paan, Services.Flower, Services.Pharmacy, Services.Pet],
                    role: [Roles.superadmin, Roles.admin]
                }
            },
            {
                name: 'Master Shifts',
                route: 'data-dump/shifts',
                allowedRouteAccessTo: {
                    service: [Services.Rider],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            {
                name: 'Change Logs',
                route: 'data-dump/change-logs',
                allowedRouteAccessTo: {
                    service: [Services.Food, Services.Grocery, Services.PND, Services.Rider, Services.Paan, Services.Flower, Services.User, Services.Pharmacy, Services.Pet],
                    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
                }
            },
            {
                name: 'Master Surge',
                route: 'data-dump/master-surge',
                allowedRouteAccessTo: {
                    service: [Services.Rider],
                    role: [Roles.superadmin, Roles.admin, Roles.serviceability, Roles.catalog, Roles.oneview, Roles.fleet_manager, Roles.ops_manager, Roles.finance_manager]
                }
            },
            {
                name: 'Banner',
                route: 'data-dump/banner',
                allowedRouteAccessTo: {
                    service: [Services.Core, Services.PND],
                    role: [Roles.superadmin, Roles.admin, Roles.ops_manager]
                }
            },
            
        ],
    },
    {
        name: 'Notifications',
        icon: 'assets/icons/home.svg',
        route: 'notification',
        allowedRouteAccessTo: {
            service: [Services.Notification],
            role: [Roles.superadmin, Roles.admin, Roles.catalog, Roles.ops_manager]
        }
    },
    // {
    //   name: 'Orders',
    //   icon: 'assets/icons/menu-cloning.svg',
    //   route: 'orders',
    // }
];

export interface INavLink {
    name: string;
    icon?: string;
    route?: string;
    allowedRouteAccessTo: IRouteAccess;
    subMenu?: INavLink[]
    filteredSubMenu?: INavLink[]
}

export const ServiceDisplayName: { [key in Services]?: string } = {
    [Services.Live]: 'Live',
    [Services.Food]: 'Food',
    [Services.Grocery]: 'Grocery',
    [Services.PND]: 'Pickup & Drop',
    [Services.Paan]: 'Paan',
    [Services.Flower]: 'Flower',
    [Services.Pharmacy]: 'Pharmacy',
    [Services.Pet]: 'Pet',
    [Services.Rider]: 'Rider',
    [Services.User]: 'User',
    [Services.Core]: 'Core',
    [Services.Notification]: 'Notification'
}