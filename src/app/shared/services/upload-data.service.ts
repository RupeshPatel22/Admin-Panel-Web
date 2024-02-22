import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as apiUrls from '../../core/apiUrls';
import { apiEndPoints } from '../models/constants/constant.type';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class UploadDataService {

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  get service() {
    return this.sharedService.service;
  }

  /**
   * Method that makes api call to get file upload url of s3-bucket
   * @param fileExtn 
   * @returns 
   */
  getFileUploadUrl(fileExtn: string): Observable<any> {
    return this.http.get(apiUrls.getFileUploadUrlEndPoint(fileExtn)).pipe(
      map((response) => {
        return response;
      })
    )
  }

  /**
   * Method that makes api call to upload file to aws-s3 bucket
   * @param uploadUrl 
   * @param file 
   * @returns 
   */
  uploadFile(uploadUrl, file): Observable<any> {
    const headers = new HttpHeaders(
      {
        ignore_headers: 'true',
      },
    )
    return this.http.put(uploadUrl, file, { headers }).pipe(
      map(response => {
        return response
      })
    )
  }

  /**
   * Method that makes api call to send uploaded file name to backend
   * @param fileName 
   * @param apiUrl 
   * @param isPartial
   * @returns 
   */
  sendUploadedFileName(fileName: string, isPartial: boolean,apiUrl: string): Observable<any> {
    const data = {
      csv_file_name: fileName,
      is_partial: isPartial
    }
    return this.http.post(apiUrls.postUploadedFileNameEndPoint(apiUrl, apiEndPoints[this.service]), data).pipe(
      map(response => {
        return response;
      }),
      catchError(err => {
        return throwError(err);
      })
    )
  }

  /**
   * Method that Download sample file format
   * @param apiUrl 
   * @returns 
   */
  getSampleFileFormat(apiUrl: string): Observable<any> {
    return this.http.get(apiUrls.getSampleFileFormatEndPoint(apiUrl, apiEndPoints[this.service]), { responseType: 'text' }).pipe(
      map((response) => {
        return response;
      })
    )
  }
}
