import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints } from '../models';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }

  /**
   * Method that gets all banners
   * @returns 
   */
  getBanners(): Observable<any> {
    return this.http.get(apiUrls.getBannersEndPoint(apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that creates banner
   * @returns 
   */
  postBanner(data: any): Observable<any> {
    return this.http.post(apiUrls.postBannersEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that edits banner
   * @param id 
   * @param data 
   * @returns 
   */
  putBanner(id: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putBannersEndPoint(id, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that deletes banner
   * @param id 
   * @returns 
   */
  deleteBanner(id: string): Observable<any> {
    return this.http.delete(apiUrls.deleteBannersEndPoint(id, apiEndPoints[this.service])).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
