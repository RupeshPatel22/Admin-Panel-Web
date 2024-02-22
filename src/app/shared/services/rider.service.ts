import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as apiUrls from '../../core/apiUrls';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiEndPoints } from '../models';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class RiderService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }

  /**
   * Method that filters riders data based on params
   * @param data 
   * @returns 
   */
  filterRiderList(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterRidersEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that blocks rider by id
   * @param id 
   * @param data 
   * @returns 
   */
  postBlockRider(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postBlockRiderByIdEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that un-blocks rider by id
   * @param id 
   * @param data 
   * @returns 
   */
  postUnBlockRider(id: string): Observable<any> {
    return this.http.post(apiUrls.postUnBlockRiderByIdEndPoint(id, apiEndPoints[this.service]), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets all clients details
   * @returns 
   */
  getClientsDetails(): Observable<any> {
    return this.http.get(apiUrls.getRiderClientsEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that sends newly enrolled client details
   * @param data 
   * @returns 
   */
  sendClientDetails(data: any): Observable<any> {
    return this.http.post(apiUrls.postRiderClientEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates pricing of the client
   * @param clientId 
   * @param data 
   * @returns 
   */
  updateClientPricingDetails(clientId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postRiderClientPricingEndPoint(clientId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that generates auth token for client
   * @param clientId 
   * @returns 
   */
  putClientAuthToken(clientId: string): Observable<any> {
    return this.http.put(apiUrls.putClientAuthTokenEndPoint(clientId, apiEndPoints[this.service]), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that sets callback token for client 
   * @param clientId 
   * @param data 
   * @returns 
   */
  putClientCallbackToken(clientId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putClientCallbackTokenEndPoint(clientId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that sets order status url and method
   * @param clientId 
   * @param data 
   * @returns 
   */
  putClientOrderStatusCb(clientId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putClientOrderStatusCbEndPoint(clientId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that sets rider location url and method
   * @param clientId 
   * @param data 
   * @returns 
   */
  putClientRiderLocationCb(clientId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putClientRiderLocationCbEndPoint(clientId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets live location of riders
   * @param data 
   * @returns 
   */
  filterRiderLocation(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterRiderLiveLocationEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that filter rider orders
   * @param data 
   * @returns 
   */
  filterRiderOrders(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterRiderOrdersEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets allocation history of order
   * @param orderId 
   * @returns 
   */
  getOrderAllocationHistory(orderId: number): Observable<any> {
    return this.http.get(apiUrls.getOrderAllocationHistoryByIdEndPoint(orderId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets status history of order
   * @param orderId 
   * @returns 
   */
  getOrderStatusHistory(orderId: number): Observable<any> {
    return this.http.get(apiUrls.getOrderStatusHistoryByIdEndPoint(orderId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that removes rider from any order before it is delivered
   * @param orderId 
   * @param data 
   * @returns 
   */
  removeRiderFromOrder(orderId: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putRemoveRiderFromOrderByIdEndPoint(orderId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets the available riders for manualling assigning the rider for order
   * @param orderId 
   * @returns 
   */
  getAvailableRidersForManuallyAssigning(orderId: number): Observable<any> {
    return this.http.get(apiUrls.getAvailableRidersForOrderEndPoint(orderId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  postRiderOrderSettlement(orderId: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postRiderOrderSettlementByIdEndPoint(orderId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that filters rider payouts data
   * @param data 
   * @returns 
   */
  filterRiderPayouts(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterPayoutsEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that retrys payout
   * @param id 
   * @returns 
   */
  retryRiderPayout(id: string): Observable<any> {
    return this.http.post(apiUrls.postRetryRiderPayoutByIdEndPoint(id, apiEndPoints[this.service]), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that stops pending payouts from retrying
   * @param id 
   * @returns 
   */
  stopRetryRiderPayout(id: string): Observable<any> {
    return this.http.post(apiUrls.postStopRetryRiderPayoutByIdEndPoint(id, apiEndPoints[this.service]), {}).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that marks payout as complete
   * @param id 
   * @param data 
   * @returns 
   */
  markAsCompleteRiderPayout(id: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postMarkCompleteRiderPayoutByIdEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that calls api to get all the rider shifts
   * @returns response
   */
  getAllRiderShifts(): Observable<any> {
    return this.http.get(apiUrls.getAllRidersShifts(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes the rider shift based on rider shift id
   * @param id 
   * @returns response
   */
  deleteRiderShift(id: string): Observable<any> {
    return this.http.delete(apiUrls.deleteRiderShifts(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that creates new shifts for rider
   * @param data 
   * @returns response
   */
  createRiderShift(data: any): Observable<any> {
    return this.http.post(apiUrls.postCreateRiderShifts(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that update changes in existing rider shift
   * @param data 
   * @returns response
   */
  updateRiderShift(data: any): Observable<any> {
    return this.http.put(apiUrls.putUpdateRiderShifts(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
 * Method that filters all rider's shift data
 * @param data 
 * @returns 
 */
  filterAllRidersShift(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterAllRidersShift(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that settle rider shift
   * @param riderShiftId 
   * @param data 
   * @returns 
   */
  settleRiderShift(riderShiftId: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postSettleRiderShiftById(riderShiftId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
 * Method that filter rider pod collection
 * @param data 
 * @returns 
 */
  filterRiderPodCollections(data: any): Observable<any> {
    return this.http.post(apiUrls.postRiderPodCollectionsV1_1(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that filter pod collection shifts
   * @param data 
   * @returns 
   */
  filterRiderPodCollectionShifts(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterRiderPodCollectionShiftEndPoint(apiEndPoints[this.service]), data).pipe(
      map(response => {
        return response;
      })
    )
  }

  /**
   * Method that assign rider manually
   * @param id 
   * @param data 
   * @returns response
   */
  assignRiderManually(orderId: number, data: any): Observable<any> {
    return this.http.post(apiUrls.postAssignRiderManuallyEndPoint(orderId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that filters pod deposits of all
   * @returns 
   */
  filterRiderPodDepoist(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterRiderPodDepositsEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that adds rider POD deposits
   * @param data 
   * @returns 
   */
  addRiderPodDeposit(riderId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postRiderPodDepositByIdEndPoint(riderId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that cancels rider POD deposits
   * @param data 
   * @returns 
   */
  cancelRiderPodDeposit(depositId: number, data: any): Observable<any> {
    return this.http.patch(apiUrls.patchCancelRiderPodDepositByIdEndPoit(depositId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 Sends a POST request to download a CSV file based on the given endpoint and data.
 @param endpoint The API endpoint to use.
 @param data The data to send in the request body.
 @returns An observable that resolves with the CSV file data.
 */
  downloadCsvFile(endpoint: string, data: any): Observable<any> {
    const apiUrlsMap = {
      riders: apiUrls.postFilterRidersEndPoint(apiEndPoints[this.service]),
      riderOrders: apiUrls.postFilterRiderOrdersEndPoint(apiEndPoints[this.service]),
      riderPayouts: apiUrls.postFilterPayoutsEndPoint(apiEndPoints[this.service]),
      ridersShifts: apiUrls.postFilterAllRidersShift(apiEndPoints[this.service]),
    };
    const apiUrl = apiUrlsMap[endpoint];
    return this.http.post(apiUrl, data, { responseType: 'text' }).pipe(
      map(response => response)
    );
  }

  /**
 * This method sends a POST request to a specified API endpoint to create a CSV file
 * for pod collection related to email.
 */
  emailPodCollectionCsvFile(data: any):Observable<any> {
    return this.http.post(apiUrls.postRiderPodCollectionsCSV(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that call API for rider detail update
   * @param riderId 
   * @param data 
   * @returns response
   */
  putRiderDetailUpdate(riderId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putRiderDetailUpdateEndPoint(riderId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Method that call API for rider ping logs
   * @param data 
   * @returns response
   */
  postRiderPingLogs(data: any): Observable<any> {
    return this.http.post(apiUrls.postRiderPingLogsEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that Retrieves live statistics data from the API.
 * @param data - The data to be sent with the HTTP GET request (if needed).
 * @returns An Observable containing the live statistics data.
 */
  getLiveStatistics(data: any): Observable<any> {
    return this.http.get(apiUrls.getLiveStatisticsEndPoint(apiEndPoints[this.service]),data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that Sends a POST request to retrieve live statistics data from the API.
 * @param data - The data to be sent with the HTTP POST request.
 * @returns An Observable containing the live statistics data.
 */
  postLiveStatistics(data: any): Observable<any>{
    return this.http.post(apiUrls.postLiveStaticsEndPoint(apiEndPoints[this.service]),data).pipe(
      map((response) =>{
        return response;
      })
    )
  }

  // ------------------- Operational City -------------------------------------------

  /**
   * Method that filters operational cities 
   * @param data 
   * @returns 
   */
  filterOperationalCity(data: any): Observable<any> {
    return this.http.post(apiUrls.filterOperationalCityEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }


  /**
   * Method that creates new operational city
   * @param data 
   * @returns 
   */
   createOperationalCity(data: any): Observable<any> {
    return this.http.post(apiUrls.postOperationalCityEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
  /**
   * Method that updates operational city
   * @param data 
   * @returns 
   */
  updateOperationalCity(id: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putOperationalCityByIdEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes operational city
   * @param data 
   * @returns 
   */
  deleteOperationalCity(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteOperationalCityByIdEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  // ------------------- Operational Zone -------------------------------------------

  /**
  * Method that filters operational zones 
  * @param data 
  * @returns 
  */
  filterOperationalZone(data: any): Observable<any> {
    return this.http.post(apiUrls.filterOperationalZoneEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that creates new operational zone
   * @param data 
   * @returns 
   */
  createOperationalZone(data: any): Observable<any> {
    return this.http.post(apiUrls.postOperationalZoneEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates operational zone
   * @param data 
   * @returns 
   */
  updateOperationalZone(id: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putOperationalZoneByIdEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes operational zone
   * @param data 
   * @returns 
   */
  deleteOperationalZone(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteOperationalZoneByIdEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  // -----------------------------Rider-Operational Zone -----------------------------------------

  /**
   * Method that gets operational zones of rider
   * @param riderId 
   * @returns 
   */
  getRiderOperationalZones(riderId: string): Observable<any> {
    return this.http.get(apiUrls.getRiderOperationalZoneByIdEndPoint(riderId, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that adds operational zone for rider
   * @param riderId 
   * @param data 
   * @returns 
   */
  addRiderOperationalZones(riderId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postRiderOperationalZoneByIdEndPoint(riderId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes operational zone of rider
   * @param riderId 
   * @param data 
   * @returns 
   */
  deleteRiderOperationalZones(riderId: string, data: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: data
    };
    return this.http.delete(apiUrls.deleteRiderOperationalZoneByIdEndPoint(riderId, apiEndPoints[this.service]), options).pipe(
      map((response) => {
        return response;
      })
    )
  }

  // ------------------- Black Zone -------------------------------------------

  /**
  * Method that filters black zones 
  * @param data 
  * @returns 
  */
  filterBlackZone(data: any): Observable<any> {
    return this.http.post(apiUrls.filterBlackZoneEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that creates new black zone
   * @param data 
   * @returns 
   */
  createBlackZone(data: any): Observable<any> {
    return this.http.post(apiUrls.postBlackZoneEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates black zone
   * @param data 
   * @returns 
   */
  updateBlackZone(id: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putBlackZoneByIdEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes black zone
   * @param data 
   * @returns 
   */
  deleteBlackZone(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteBlackZoneByIdEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
