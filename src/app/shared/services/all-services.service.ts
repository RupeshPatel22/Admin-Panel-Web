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
export class AllServicesService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }
  /**
   * Method that get city list through API
   * @returns response
   */
  public getAllServices(): Observable<any> {
    return this.http.get(apiUrls.getAllServicesEndPoint).pipe(
      map((response) => {
        return response
      })
    )
  }

  putServices(id: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putServicesEndPoint(id, apiEndPoints[this.service]),data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
