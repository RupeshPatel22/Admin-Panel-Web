import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { apiEndPoints } from '../models';
import { resourceUsage } from 'process';
import * as apiUrls from '../../core/apiUrls'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LiveService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  /**
   * Gets the current service type from the shared service.
   * @returns The current service type.
   */
  get service() {
    return this.sharedService.service;
  }

  /**
   * Fetches Active orders based on the provided data.
   * @param data The data used for filtering Active orders.
   * @returns An observable that emits the response containing Active orders.
   */
  getActiveOrder(data: any): Observable<any> {
    return this.http.post(apiUrls.postActiveOrderEndPoint,data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
