import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints } from '../models';
import { map } from 'rxjs/operators';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }

  /**
   * Method that filters all subscription plans
   * @param data 
   * @returns 
   */
  filterSubscriptionPlans(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterSubscriptionPlansEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that creates new subscription plan
   * @param data 
   * @returns 
   */
  createSubscriptionPlan(data: any): Observable<any> {
    return this.http.post(apiUrls.postSubscriptionPlanEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that updates existing subscription plan
   * @param planId 
   * @param data 
   * @returns 
   */
  updateSubscriptionPlan(planId: string, data: any): Observable<any> {
    return this.http.put(apiUrls.putSubscriptionPlanByIdEndPoint(planId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that filters all subscription data
   * @param data 
   * @returns 
   */
  filterSubscriptions(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterSubcriptionsEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that creates subscription for a plan
   * @param data 
   * @returns 
   */
  createSubscription(data: any): Observable<any> {
    return this.http.post(apiUrls.postSubscriptionEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  cancelSubscription(subscriptionId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postCancelSubscriptionByIdEndPoint(subscriptionId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that retry payment for any subscription that is on hold
   * @param subscriptionId 
   * @param data 
   * @returns 
   */
  retrySubscriptionPayment(subscriptionId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postRetrySubscriptionPaymentByIdEndPoint(subscriptionId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that force activate any subscription that is not active currently
   * @param subscriptionId 
   * @param data 
   * @returns 
   */
  activateSubscription(subscriptionId: string, data: any): Observable<any> {
    return this.http.post(apiUrls.postActivateSubscriptionByIdEndPoint(subscriptionId, apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that filters subscription payment data
   * @param data 
   * @returns 
   */
  filterSubscriptionPayment(data: any): Observable<any> {
    return this.http.post(apiUrls.postFilterSubscriptionPaymentsEndPoint(apiEndPoints[this.service]), data).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
