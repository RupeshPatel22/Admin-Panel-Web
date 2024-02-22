import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagingService } from 'src/app/shared/services/messaging.service';
import { PushNotificationsService } from 'src/app/shared/services/push-notifications.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subcriptions: Subscription[] = [];
  // isSideNavOpen: boolean;
  constructor(private pushNotificationService: PushNotificationsService, private messagingService: MessagingService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.pushNotificationService.initPushNotificationConnection();
    this.messagingService.openWsConnection();
    // this.getAllGlobalVar();
    // this.subcriptions.push(this.sharedService.isSideNavOpen$.subscribe(data => this.isSideNavOpen = data));
  }
  /**
   * Method that gets all global var for vendor
   */
  getAllGlobalVar() {
    this.subcriptions.push(this.pushNotificationService.getGlobalVarFood().subscribe());
    this.subcriptions.push(this.pushNotificationService.getGlobalVarRider().subscribe());
  }
  ngOnDestroy() {
    // this.pushNotificationService.riderNotAvailableAlert.pause();
    clearInterval(this.pushNotificationService.riderNotAvailableAlert);
    this.messagingService.closeWsConnection();
  }

}
