import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import * as apiUrls from '../../core/apiUrls';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  /**
   * Method that sends otp for login
   * @param data 
   * @returns 
   */
  sendLoginOtp(data: any): Observable<any> {
    return this.http.post(apiUrls.postSendLoginOtpEndPoint, data).pipe(
      map(response => {
        return response;
      }) 
    )
  }

  /**
   * Method that verifies login otp
   * @param data 
   * @returns 
   */
  verifyLoginOtp(data: any): Observable<any> {
    return this.http.post(apiUrls.postVerifyLoginOtpEndPoint, data).pipe(
      map(response => {
        if (!this.cookieService.get('deviceId')) {
          this.cookieService.set(
            'deviceId',
            uuidv4(),
            new Date('2038-01-19 04:14:07')
          );
        }
        localStorage.setItem('email', response['result']['email']) ;
        return response;
      }) 
    )
  }

  /**
   * Method that gets auth tokens
   * @returns 
   */
  refreshAuthToken(): Observable<any> {
    const headers = new HttpHeaders({
      refresh_token: 'true'
    });
    return this.http.post(apiUrls.postRefreshTokenEndPoint, {}, { headers }).pipe(
      map((response) => {
        localStorage.setItem('token', response['result']['token']);
        localStorage.setItem('refreshToken', response['result']['refresh_token']);
      })
    )
  }
}
