import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CancellationReason } from 'src/app/modules/data-dump/cancellation-reason/model/cancellation-reason';
import * as apiUrls from '../../core/apiUrls'
import { apiEndPoints } from '../models/constants/constant.type';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  cancellationReasons$: BehaviorSubject<CancellationReason[]> = new BehaviorSubject<CancellationReason[]>(null);
  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }
  /**
   * Method that gets all orders data
   * @param data 
   * @returns 
   */
  getOrdersData(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterOrdersEndPoint(apiEndPoints[this.service]), data).pipe(
      map(response => {
        return response
      })
    )
  }

  /**
   * Method that gets all the filter order and download it in csv
   * @param data 
   * @returns 
   */
  downloadOrdersCsvFile(data: any): Observable<any>{
    return this.http.post(apiUrls.postFilterOrdersEndPoint(apiEndPoints[this.service]), data, { responseType: 'text' }).pipe(
      map(response => {
        return response;
      })
    )
  }

  /**
   * Method that cancels order based on orderId passed in parameter
   * @param orderId 
   * @param data 
   * @returns 
   */
  cancelOrder(orderId: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postCancelOrderByIdEndPoint(orderId, apiEndPoints[this.service]), data).pipe(
      map(response => {
        return response
      })
    )
  }

  /**
   * Method that sends refund data 
   * @param orderId 
   * @param data 
   * @returns 
   */
  refundOrder(orderId: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postRefundEndPoint(orderId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that mark completed orders for refund
   * @param orderId 
   * @returns 
   */
  markOrderForRefund(orderId: number): Observable<any> {
    return this.http.post(apiUrls.postMarkForRefundEndPoint(orderId, apiEndPoints[this.service]), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }


  /**
   * Method that get cancellation reasons for admin
   * @param id 
   * @returns 
   */
  getCancellationReasonsForAdmin(): Observable<any> {
    return this.http.get(apiUrls.getCancellationReasonsForAdminEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        const data: CancellationReason[] = [];
        for (const i of response['result']['reasons']) {
          data.push(CancellationReason.fromJson(i));
        }
        this.cancellationReasons$.next(data);
      })
    )
  }

  /**
 * Method that Sends a notification to the vendor for the specified order using HTTP POST.
 *
 * @param orderId - The unique identifier of the order.
 * @param data - Data to be included in the notification payload.
 * @returns An observable that represents the HTTP response from the server.
 */
  postSendNotificationToVendor(orderId: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postSendNotificationSoundEndPoint(orderId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method to Sends a POST request to the API endpoint for filtering inquiry orders.
 */
getInquiryOrder(data: any): Observable<any> {
  return this.http.post(apiUrls.postFilterInquiryOrdersEndPoint(apiEndPoints[this.service]), data).pipe(
    map((response) => {
      return response;
    })
  );
}


  /**
 * Method to Sends a GET request to the API endpoint for retrieving details of a specific inquiry order.
 */
getInquiryOrderDetails(inquiryOrderId: number): Observable<any>  {
  return this.http.get(apiUrls.getInquiryOrderDetailsEndPoint(inquiryOrderId, apiEndPoints[this.service])).pipe(
    map((response) => {
      return response;
    })
  );
}

}
