import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { allowedRouteAccessTo, redirectConfig, Roles, Services } from "../models/constants/constant.type";
import jwt_decode from 'jwt-decode';
import { SharedService } from "../services/shared.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  currentUrl: string;
  outletId: string;
  constructor(private router: Router, private sharedService: SharedService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.currentUrl = state.url;
    if (this.currentUrl.includes('/outlet-details')) {
      this.outletId = next.queryParams.outletId;
    }
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      if (!decoded['role']) {
        localStorage.clear();
        this.router.navigate(['login']);
        return false;
      }
      this.setUserRole(decoded['role']);
    }
    if (!token && this.currentUrl !== '/login') {
      this.router.navigate(['login'], { state: { outletId: this.outletId } });
      return false;
    }
    else if (token && (this.currentUrl === '/login')) {
      this.router.navigate(['food', 'home']);
      return false;
    }
    else if (token && !this.checkRouteAccess()) {
      if (!this.sharedService.service) this.sharedService.setService(Services.Food);
      if (this.redirectRoute) {
        this.router.navigate([`${this.sharedService.service}/${this.redirectRoute}`]);
      } else {
        this.router.navigate(['/']);
      }
      return false;
    }


    return true;
  }

  /**
   * Method that determines if route access is allowed for this service and role
   * @returns 
   */
  checkRouteAccess() {
    const url = this.processUrl(this.currentUrl);
    return allowedRouteAccessTo[url]?.['service'].includes(sessionStorage.getItem('service') as Services) &&
      allowedRouteAccessTo[url]?.['role'].some(r => this.sharedService.roles.includes(r));
  }

  /**
   * Method that return url after removing dynamic routing from it
   * @param url 
   * @returns 
   */
  processUrl(url: string) {
    url = url.split('?')[0];
    const index = url.indexOf('/', 1);
    
    // below condition will set the service if it is diff from current one 
    if (index > 0) {
      const derivedService = url.substring(1, index);
      if (this.sharedService.service !== derivedService) 
        this.sharedService.setService(derivedService as Services);
    }
    if (allowedRouteAccessTo[url]) return url;

    return url.substring(index);
  }

  /**
   * Method that sets user roles in const service
   * @param roles 
   */
  setUserRole(roles: string[]) {
    const arr = [];
    roles.forEach(r => arr.push(Roles[r]))
    this.sharedService.roles = arr;
  }

  get redirectRoute() {
    return redirectConfig[this.sharedService.service][this.sharedService.roles[0]];
  }
}
