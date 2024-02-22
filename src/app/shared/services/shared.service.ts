import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Roles, Services } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  isServiceChanged$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  roles: Roles[] = [];
  isSideNavOpen$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  constructor(private router: Router) { }

  /**
   * Method that opens outlet-details component in new window
   * @param id 
   * @param outletName 
   */
  navigateToOutletDetailsInNewWindow(id: string, outletName: string) {
    const link = this.router.serializeUrl(this.router.createUrlTree([`${this.service}/outlet-details`], { 
      queryParams: { 
        id,
        outletName 
      } 
    }));
    window.open(link);
  }

  get hasEditAccessForOutletDetails(): boolean {
    const editAccessRoles: Roles[] = [Roles.superadmin, Roles.admin, Roles.ops_manager, Roles.catalog];
    return editAccessRoles.some(r => this.roles.includes(r));
  }

  /**
   * Method that returns service stored in session storage
   */
  get service() {
    return sessionStorage.getItem('service');
  }

  /**
   * Method that sets service in session storage and constService
   * later to use it across the platform
   * @param service 
   */
  setService(service: Services) {
    sessionStorage.setItem('service', service);
    this.isServiceChanged$.next(true);
  }
}
