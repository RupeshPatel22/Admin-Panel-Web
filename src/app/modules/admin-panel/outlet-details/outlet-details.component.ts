import { Component, OnInit } from '@angular/core';
import { OutletsService } from 'src/app/shared/services/outlets.service';
import { Outlet } from '../outlets/model/outlet';
import { ActivatedRoute, Router } from '@angular/router';
import { allowedTabAccessTo, ITab, tabs } from './model/outlet-detail';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Services } from 'src/app/shared/models';

@Component({
  selector: 'app-outlet-details',
  templateUrl: './outlet-details.component.html',
  styleUrls: ['./outlet-details.component.scss']
})
export class OutletDetailsComponent implements OnInit {

  outletDetails: Outlet;
  currentOutletId: string;
  showTabContent: {[key: number]: boolean} = {};
  tabs: ITab[] = [];
  service: string; 
  

  constructor(private outletsService: OutletsService, private activeRoute: ActivatedRoute,
    private router: Router, private sharedService: SharedService) {
    this.currentOutletId = this.activeRoute.snapshot.queryParams.id;
    // this.service = this.activeRoute.snapshot.queryParams.service;
  }

  ngOnInit(): void {
    this.sharedService.isServiceChanged$.subscribe(data => {
      this.service = this.sharedService.service;
      this.indentifyTabsToShow();
    });
    this.setOutletsDetails();
  }

  setOutletsDetails() {
    this.outletsService.getOutletDetails(this.currentOutletId).subscribe(
      res => {
        this.outletDetails = this.outletsService.outletDetails;
        this.tabChange(0);
      }
    );
  }

  /**
   * Method that navigates to home page
   */
  goToHome() {
    this.router.navigate([this.sharedService.service, 'home']);
  }

  /**
   * Method that invokes when tab is changed
   * @param event 
   */
  tabChange(index: number) {
    if (this.showTabContent[index] === undefined) {
      this.showTabContent[index] = !this.showTabContent[index];
    }
  }

  /**
   * Method that identifies which tabs to show to user based on their role
   */
  indentifyTabsToShow() {
    // this.tabs = tabs.filter(tab => {
    //   return tab.allowedTabAccessTo.service.includes(this.service as Services) && 
    //     tab.allowedTabAccessTo.role.some(r => this.sharedService.roles.includes(r));
    // })

    console.log(this.service)
    // for (const i of tabs) {
    //   this.tabs.push(i)
    // }



    this.tabs = tabs.filter(tab => {
      return tab.allowedTabAccessTo.service.includes(this.service as Services) && 
        tab.allowedTabAccessTo.role.some(r => this.sharedService.roles.includes(r));
    })
  }

}
