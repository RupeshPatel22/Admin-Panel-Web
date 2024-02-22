import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }

  /**
  * Method that filters customer users
  * @param data 
  * @returns 
  */
  filterCustomerUsers(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterCustomersEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that Blocks a customer by their ID.
 * 
 * @param id - The ID of the customer to block.
 * @param data - Additional data related to the customer.
 * @returns An Observable that emits the response from the HTTP PUT request.
 */
  blockCustomer(id: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putBlockCustomerByIdEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }


  /**
   * Unblocks a customer by their ID.
   * 
   * @param id - The ID of the customer to unblock.
   * @param data - Additional data related to the customer.
   * @returns An Observable that emits the response from the HTTP PUT request.
   */
  unBlockCustomer(id: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putUnBlockCustomerByIdEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // ---------Admin Users----------------

  /**
   * Method that gets all admin users list
   * @returns 
   */
  filterAdminUsers(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterAdminUsersEndPoint, data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method taht creates new admin user
   * @param data 
   * @returns 
   */
  postAdminUser(data: any): Observable<any> {
    return this.http.post(apiUrls.postAdminUserEndPoint, data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that edits admin user
   * @param adminId 
   * @param data 
   * @returns 
   */
  putAdminUser(adminId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putAdminUserEndPoint(adminId), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Block admin by their ID.
   * @param adminId - The ID of the admin to block.
   * @param data - Addtional data related to the admin.
   * @returns An Observable that emits the response form the HTTP PUT request.
   */
  blockAdmin(adminId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putBlockAdminByIdEndPoint(adminId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }


  /**
   * Unblocks admin by their ID.
   * 
   * @param id - The ID of the admin to unblock.
   * @param data - Additional data related to the admin.
   * @returns An Observable that emits the response from the HTTP PUT request.
   */
  unBlockAdmin(adminId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putUnBlockAdminByIdEndPoint(adminId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that get vendor details
   * @param data 
   * @returns 
   */
  postVendorUsers(data: any): Observable<any> {
    return this.http.post(apiUrls.postVendorUsersEndPoint(apiEndPoints[this.service]),data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
