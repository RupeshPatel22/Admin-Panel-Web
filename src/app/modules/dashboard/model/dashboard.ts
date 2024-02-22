import { Router } from "@angular/router";

export const socketTemplates = {
    ORDER_PLACED: (data: any, router: Router): ISocketTemplate => {
        return {
            soundKey: data['order_placed_notification_sound'],
            title: `New Order (${(data.service_name as string).toUpperCase()})`,
            message: `Placed Order ID: ${data.order_id} having ${data.order_items?.length || ''} items`,
            link: router.serializeUrl(router.createUrlTree([`/${data.service_name}/orders`], {
                queryParams: { expanded: data.order_id }
            })),
            icon: 'assets/icons/Placed-order-status.svg',
        }
    },
    ORDER_CANCELLED: (data: any, router: Router): ISocketTemplate => {
        return {
            soundKey: data['order_cancelled_notification_sound'],
            title: `Order Cancelled (${(data.service_name as string).toUpperCase()})`,
            message: `Order ID: ${data.order_id} has been cancelled`,
            link: router.serializeUrl(router.createUrlTree([`/${data.service_name}/orders`], {
                queryParams: { expanded: data.order_id }
            })),
            icon: 'assets/icons/Cancelled-order-status.svg'
        }
    },
    ORDER_ALLOCATION_MAX_ATTEMPT: (data: any, router: Router): ISocketTemplate => {
        return {
            soundKey: data['automatic_rider_allocation_failed_notification_sound'],
            title: `Order Allocation Max Attempt  (${(data.service_name as string).toUpperCase()})`,
            message: `Order ID: ${data.order_id}, allocation attempts reached to max attempts`,
            link: router.serializeUrl(router.createUrlTree(['/rider/riders-allocation'], {
                queryParams: { orderId: data.order_id }
            })),
            icon: 'assets/icons/order-alloc-max-attempt-icon.svg'
        }
    },
    ORDER_ALLOCATION_NO_RIDER: (data: any, router: Router): ISocketTemplate => {
        return {
            soundKey: data['automatic_rider_allocation_failed_notification_sound'],
            title: `No Rider Available  (${(data.service_name as string).toUpperCase()})`,
            message: `Order ID: ${data.order_id} has no Rider available to allocate after 
                ${data.attempt} allocation attempts and ${data.no_free_rider_attempt} no free rider attempts, please assign manually`,
            link: router.serializeUrl(router.createUrlTree(['/rider/riders-allocation'], {
                queryParams: { orderId: data.order_id }
            })),
            icon: 'assets/icons/no-rider-icon.svg'
        }
    },
    RIDER_PING_UPDATES: (data: any, router: Router): ISocketTemplate => {
        return {
            soundKey: data['no_ping_rider_offline_sound'],
            title: `No Ping From Rider  (${(data.service_name as string).toUpperCase()})`,
            message: `${data.warning_rider_count} riders are given Warning and ${data.offline_rider_count} riders are marked Offline`,
            link: router.serializeUrl(router.createUrlTree(['/rider/alerts'])),
            icon: 'assets/icons/rider-ping-updates-icon.svg'
        }
    }
}

export interface ISocketTemplate {
    soundKey: string;
    title: string;
    message: string;
    link: string;
    icon: string;
}