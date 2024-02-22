import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as apiUrls from '../../core/apiUrls'
import { apiEndPoints } from '../models/constants/constant.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }

  /**
   * Method that gets data for menu changes approval
   * @param data 
   * @returns 
   */
   filterMenuChangesApprovalData(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterMenuChangesApprovalEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  postMenuChangesReview(approvalIds: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postMenuChangesReviewEndPoint(approvalIds, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
