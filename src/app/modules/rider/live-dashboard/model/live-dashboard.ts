export class LiveOrderCount {
    liveOrderCount: number;
    pendingOrderCount: number;
    allotedOrderCount: number;
    dispatchedOrderCount: number;
    arrivedOrderCount: number;
    arrivedCustomerDoorStepOrderCount: number;
    cancelledOrderCount: number;
    deliveredOrderCount: number;
    totalOrdersCount: number;
    assignedOrdersCount: number;

    static fromJson (data: any): LiveOrderCount {
        const o : LiveOrderCount = new LiveOrderCount();
        o['liveOrderCount'] = data['live_orders_count'];
        o['pendingOrderCount'] = data['pending_orders_count'];
        o['allotedOrderCount'] = data['alloted_orders_count'];
        o['dispatchedOrderCount'] = data['dispatched_orders_count'];
        o['arrivedOrderCount'] = data['arrived_orders_count'];
        o['arrivedCustomerDoorStepOrderCount'] = data['arrived_customer_doorstep_orders_count'];
        o['cancelledOrderCount'] = data['cancelled_orders_count'];
        o['deliveredOrderCount'] = data['delivered_orders_count'];
        o['totalOrdersCount'] = data['total_orders_count'];
        o['assignedOrdersCount'] = data['assigned_orders_count'];
        return o;
    }
}

export class LiveRiderCount {
    liveRiderCount: number;
    idleRiderCount: number;
    busyRiderCount: number;
    allocatingRiderCount: number;
    offlineRiderCount: number;
    noPingOfflineRiderCount: number;
    noPingWarningRiderCount: number;
    totalRidersCount: number;

    static fromJson(data: any): LiveRiderCount {
        const r : LiveRiderCount = new LiveRiderCount();
        r['liveRiderCount'] = data['live_riders_count'];
        r['idleRiderCount'] = data['idle_riders_count'];
        r['busyRiderCount'] = data['busy_riders_count'];
        r['allocatingRiderCount'] = data['allocating_riders_count'];
        r['offlineRiderCount'] = data['offline_riders_count'];
        r['noPingOfflineRiderCount'] = data['no_ping_offline_riders_count'];
        r['noPingWarningRiderCount'] = data['no_ping_warning_riders_count'];
        r['totalRidersCount'] = data['total_riders_count'];
        return r;
    }
}