import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getDownloadFileEndPoint } from '../../core/apiUrls';
import { apiEndPoints } from '../models/constants/constant.type';
import { SharedService } from './shared.service';
@Injectable({
  providedIn: 'root'
})
export class DownloadDataService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }

  /**
   * Method that invovke the api to download the data
   * @param ids 
   * @returns response
   */
  download(apiUrl: string, ids: string): Observable<any> {
    return this.http.get(getDownloadFileEndPoint(apiUrl, ids, apiEndPoints[this.service]), { responseType: 'text' }).pipe(
      map(response => {
        return response;
      })
    )
  }
}
