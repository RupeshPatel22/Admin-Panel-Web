import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints } from '../models/constants/constant.type';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class DataDumpService {

  // service: string;
  constructor(private http: HttpClient, private sharedService: SharedService) {
    // this.constService.service.subscribe(data => this.service = data);
  }

  get service() {
    return this.sharedService.service;
  }

  /**
 * Method that get city list through API
 * @returns response
 */
  getCuisinesList(): Observable<any> {
    return this.http.get(apiUrls.getCuisinesListEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response
      })
    )
  }

  /**
   * Method that adds new Cuisine
   * @param data 
   * @returns 
   */
  addNewCuisine(data): Observable<any> {
    return this.http.post(apiUrls.postCuisineEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response
      })
    )
  }

  updateCuisine(id: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putCuisineEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
  * Method that deletes cuisine through API based on parameter passed
  * @param id 
  * @returns 
  */
  deleteCuisine(id: string): Observable<any> {
    return this.http.delete(apiUrls.deleteCuisineEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  // Pickup & Drop Category

  /**
   * Method that get all pnd categories list
   * @returns 
   */
  getPndCategoriesList(): Observable<any> {
    return this.http.get(apiUrls.getPndCategoryEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that adds new category
   * @param data 
   * @returns 
   */
  postPndCategory(data: any): Observable<any> {
    return this.http.post(apiUrls.postPndCategoryEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updated the category based on id passed
   * @param id 
   * @param data 
   * @returns 
   */
  putPndCategory(id: string, data): Observable<any> {
    return this.http.put(apiUrls.putPndCategoryEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes the category based on id passed
   * @param id 
   * @returns 
   */
  deletePndCategory(id: string): Observable<any> {
    return this.http.delete(apiUrls.deletePndCategoryEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets all cancellation reasons for order
   * @returns 
   */
  getCancellationReasonList(): Observable<any> {
    return this.http.get(apiUrls.getAllCancellationReasonsEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that adds cancellation reason
   * @param data 
   * @returns 
   */
  postCancellationReason(data: any): Observable<any> {
    return this.http.post(apiUrls.postCancellationReasonEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates the cancellation reason by id passed
   * @param id 
   * @returns 
   */
  putCancellationReason(id: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putCancellationReasonEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes the cancellation reason
   * @param id 
   * @returns 
   */
  deleteCancellationReason(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteCancellationReasonEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  // Global Var 

  /**
   * Method that gets all global var
   * @returns 
   */
  getAllGlobalVar(): Observable<any> {
    return this.http.get(apiUrls.getGlobalVarEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates value of global var
   * @param key 
   * @param data 
   * @returns 
   */
  putGlobalVar(key: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putGlobalVarByKeyEndPoint(key, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
 * Method that get and set change logs with/without filters
 * @param data 
 * @returns 
 */
  postChangesLog(data: any): Observable<any> {
    return this.http.post(apiUrls.postChangesLog(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response
      })
    )
  }

      /**
    * Fetches master category data for a Grocery using an HTTP GET request.
    * @param data The request data, typically containing parameters or options.
    * @returns An Observable that emits the HTTP response containing master category data.
    */
      getMasterCategory(): Observable<any> {
        return this.http.get(apiUrls.getMasterCategoryEndPoint(apiEndPoints[this.service])).pipe(
          map((response) => {
            return response;
          })
        )
      }
  
      /**
       * Add master category data for a Grocery using an HTTP POST request.
       * @param data 
       * @returns 
       */
      addNewMasterCategory(data): Observable<any> {
        return this.http.post(apiUrls.postMasterCategoryEndPoint(apiEndPoints[this.service]), data).pipe(
          map((response) => {
            return response;
          })
        )
      }
  
      /**
       * Update master category data for a Grocery using an HTTP PUT request.
       * @param data 
       * @returns 
       */
      updateMasterCatergory(data: any, id: string): Observable<any> {
        return this.http.put(apiUrls.putMasterCategoryEndPoint(apiEndPoints[this.service],id),data).pipe(
          map((response) => {
            return response;
          })
        )
      }
  
      /**
       * Delete master category data for a Grocery using an HTTP DELETE request.
       * @param data 
       * @returns 
       */
      deleteMasterCatergory(id: string): Observable<any> {
        return this.http.delete(apiUrls.deleteMasterCategoryEndPoint(apiEndPoints[this.service], id)).pipe(
          map((response) => {
            return response;
          })
        )
      }
      
  /**
* Method that Sends a POST request to the Master Surge API endpoint with the provided data.
* @param data - The data to be sent in the POST request.
*/
  postMasterSurge(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterMasterSurgeEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response
      })
    )
  }

  /**
* Method that Sends a GET request to retrieve Master Surge data with the specified ID.
* @param id - The ID of the Master Surge data to retrieve.
*/
  getMasterSurge(id: number): Observable<any> {
    return this.http.get(apiUrls.getMasterSurgeEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
* Method that Sends a PUT request to update Master Surge data with the specified ID and provided data.
* @param id - The ID of the Master Surge data to update.
* @param data - The data to be included in the PUT request for updating.
*/
  putMasterSurge(id: number, data: any): Observable<any> {
    return this.http.put(apiUrls.putMasterSurgeEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
* Method that Sends a POST request to create a new Master Surge record with the provided data.
* @param data - The data to be included in the POST request for creating a new record.
*/
  createMasterSurge(data: any): Observable<any> {
    return this.http.post(apiUrls.postCreateMasterSurge(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
* Method that Sends a DELETE request to delete a Master Surge record with the specified ID.
* @param id - The ID of the Master Surge record to delete.
*/
  deleteMasterSurge(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteMasterSurgeEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response
      })
    )
  }

  /**
 * Method that calls api of create surge mapping with client and ops zone
 * @param data 
 * @returns response
 */
  createSurgeMapping(data: any): Observable<any> {
    return this.http.post(apiUrls.postSurgeMappingEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that gets filtered data of surge mapping data
   * @param data 
   * @returns response
   */
  postSurgeMapping(data: any): Observable<any> {
    return this.http.post(apiUrls.postSurgeMappingFilterEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response
      })
    )
  }

  /**
   * Method that delete Surge Mapping
   * @param id 
   * @returns response
   */
  deleteSurgeMapping(id: number): Observable<any> {
    return this.http.delete(apiUrls.deleteSurgeMappingEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response
      })
    )
  }

   /**
   * Method that change master category sequence
   * @param id 
   * @param data 
   * @returns response
   */
   putMasterCategorySequence(data: any): Observable<any> {
    return this.http.put(apiUrls.putMasterCategorySequenceEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response['result'];
      })
    )
  }
}



 

