import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as apiUrls from '../../core/apiUrls';

@Injectable({
  providedIn: 'root'
})
export class CityAreaService {

  constructor(private http: HttpClient,) { }

   /**
   * Method that get city list through API
   * @returns response
   */
    public getCityList(): Observable<any> {
      return this.http.get(apiUrls.getCityListEndPoint).pipe(
        map((response) => {
          return response
        })
      )
    }

    public addNewCity(data): Observable<any> {
      return this.http.post(apiUrls.postCityEndPoint,data).pipe(
        map((response) => {
          return response
        })
      )
    }

    public updateCity(id: string, data: any): Observable<any> {
      return this.http.put(apiUrls.putCityEndPoint(id), data).pipe(
        map((response) => {
          return response;
        })
      )
    }

    public deleteCity(id: string): Observable<any> {
      return this.http.delete(apiUrls.deleteCityEndPoint(id)).pipe(
        map((response) => {
          return response;
        })
      )
    }

    public getAreaList(): Observable<any> {
      return this.http.get(apiUrls.getAreaListEndPoint).pipe(
        map((response) => {
          return response;
        })
      )
    }

    /**
     * Method that sends area polygon coordinates through API
     * @param formData 
     * @returns 
     */
    public addAreaPolygon(formData): Observable<any> {
      return this.http.post(apiUrls.postAreaPolygonEndPoint, formData).pipe(
        map((response) => {
          return response;
        })
      )
    }

    /**
     * Method that deletes area polygon through API based on parameter passed
     * @param id 
     * @returns 
     */
    public deleteAreaPolygon(id: string): Observable<any> {
      return this.http.delete(apiUrls.deleteAreaPolygonEndPoint(id)).pipe(
        map((response) => {
          return response;
        })
      )
    }

    /**
     * Method that filters area based on city_id 
     * @param data 
     * @returns 
     */
    postFilterAreaPolygon(data: any): Observable<any> {
      return this.http.post(apiUrls.postFilterAreaPolygonEndPoint, data).pipe(
        map((response) => {
          return response;
        })
      )
    }

    // -----------Client-logs-----------------
  
    /**
     * Method that filters client logs
     * @param data 
     * @returns 
     */
    filterClientLogs(data: any): Observable<any> {
      return this.http.post(apiUrls.postFilterClientLog, data).pipe(
        map((response) => {
          return response;
        })
      )
    }
}
