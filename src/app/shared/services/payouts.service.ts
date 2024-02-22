import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints, Services } from '../models/constants/constant.type';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class PayoutsService {

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  get service() {
    return this.sharedService.service;
  }
  /**
  * Method that gets all payout accounts details of particular restaurant
  * @param outletId 
  * @returns 
  */
  getPayoutAccountsDetails(outletId: string): Observable<any> {
    let params = new HttpParams();
    if (this.service === Services.Food) {
      params = params.append('restaurant_id', outletId);
    } else if (this.service === Services.Grocery) {
      params = params.append('store_id', outletId);
    } else if (this.service === Services.Paan || this.service === Services.Flower || this.service === Services.Pharmacy || this.service === Services.Pet){
      params = params.append('outlet_id', outletId);
    }
    return this.http.get(apiUrls.getPayoutAccountsDetailsEndPoint(apiEndPoints[this.service]), { params }).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets payouts data by filter parameters
   * @param data 
   * @returns 
   */
  getPayoutsData(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterPayoutsEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that gets all the filter payouts and download it in csv
   * @param data 
   * @returns 
   */
  downloadPayoutsCsvFile(data: any): Observable<any>{
    return this.http.post(apiUrls.postFilterPayoutsEndPoint(apiEndPoints[this.service]), data, { responseType: 'text' }).pipe(
      map(response => {
        return response;
      })
    )
  }

  /**
   * Method that trigger manual retry of payout
   * @param payoutId 
   * @returns 
   */
  retryPayout(payoutId: string): Observable<any> {
    return this.http.post(apiUrls.postRetryPayoutByIdEndPoint(payoutId, apiEndPoints[this.service]), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that stop retrying of payout
   * @param payoutId 
   * @returns 
   */
  stopRetryPayout(payoutId: string): Observable<any> {
    return this.http.post(apiUrls.postStopRetryPayoutByIdEndPoint(payoutId, apiEndPoints[this.service]), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that manually mark payout as complete
   * @param payoutId 
   * @param data 
   * @returns 
   */
  markPayoutAsComplete(payoutId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postMarkCompletePayoutByIdEndPoint(payoutId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  
  /**
   * Method that send payout report on email.
   * @param data 
   * @returns 
   */
  sendPayoutReportOnEmail(data: any): Observable<any> {
    return this.http.post(apiUrls.postPayoutReportOnEmailEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
