import { Component, OnInit, OnDestroy } from '@angular/core';
import { RiderService } from 'src/app/shared/services/rider.service';
import { LiveOrderCount, LiveRiderCount } from './model/live-dashboard';
import { interval, Subscription } from 'rxjs';
import { DeliveryStatus } from '../rider-orders/model/rider-order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-dashboard',
  templateUrl: './live-dashboard.component.html',
  styleUrls: ['./live-dashboard.component.scss']
})
export class LiveDashboardComponent implements OnInit, OnDestroy {

  liveOrderCount: LiveOrderCount;
  liveRiderCount: LiveRiderCount;
  bannerFactor: any;
  private subscription: Subscription;

  constructor(private riderService: RiderService, private router: Router) { }

  ngOnInit(): void {
    this.getLiveStatistics();
    this.subscription = interval(30000).subscribe(() => {
      this.getLiveStatistics();
    });
  }

  
  getLiveStatistics(): void {
    this.riderService.getLiveStatistics(this.liveOrderCount).subscribe(res => {
      this.liveOrderCount = LiveOrderCount.fromJson(res.result.order);
      this.liveRiderCount = LiveRiderCount.fromJson(res.result.rider);
      this.bannerFactor = res.result.banner_factor;
    });
  }

  /**
   * Method that navigates to rider-orders page in new tab
   * @param deliveryStatus 
   */
  navigateToRiderOrdersPage(deliveryStatus: DeliveryStatus) {
    const link = this.router.serializeUrl(this.router.createUrlTree([`rider/orders`], {
      queryParams: { deliveryStatus }
    }))
    window.open(link);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
