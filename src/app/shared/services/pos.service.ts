import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints } from '../models';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class PosService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  get service() {
    return this.sharedService.service;
  }

  /**
   * Method that provide detail about POS onboarding detail
   * @param id
   * @returns response
   */
  getPosOnboardingDetail(id: string): Observable<any> {
    return this.http
      .get(
        apiUrls.getPetPoojaOnboardByIdEndPoint(id, apiEndPoints[this.service])
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that fetches menu and gets it from pet pooja
   * @param id
   * @returns response
   */
  getPosFetchMenu(id: string): Observable<any> {
    return this.http
      .get(
        apiUrls.getPetPoojaFetchMenuByIdEndPoint(id, apiEndPoints[this.service])
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that Initate connect with pet pooja
   * @param id
   * @param data
   * @returns response
   */
  postPosInitiate(id: string, data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postPetPoojaInitiateByIdEndPoint(
          id,
          apiEndPoints[this.service]
        ),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that sends details for updating onboarding details
   * @param id
   * @param data
   * @returns response
   */
  putPosOnboardingDetail(id: string, data: any): Observable<any> {
    return this.http
      .put(
        apiUrls.putPetPoojaOnboardByIdEndPoint(id, apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that sends onboarding details
   * @param id
   * @param data
   * @returns response
   */
  postPosOnboardingDetail(id: string, data: any): Observable<any> {
    return this.http
      .post(
        apiUrls.postPetPoojaOnboardByIdEndPoint(id, apiEndPoints[this.service]),
        data
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Method that detach pet pooja onboarding
   * @param id 
   * @param data 
   * @returns response
   */
  postPosDetach(id: string, data: any): Observable<any>{
    return this.http.post(apiUrls.postPetPoojaDetachByIdEndPoint(id,apiEndPoints[this.service]), data).pipe(map((response)=>{
      return response;
    }))
  }
}
