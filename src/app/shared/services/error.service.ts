import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  showModal = new BehaviorSubject(null);
  error: any;
  customMessage: string;
  shouldReload: boolean;
  httpErrorMessage: string;

  constructor(private router: Router, private toastMsgService: ToastService,) { }



  /**
 * Method that handle errors
 * @param error
 * @returns boolean
 */
  errorHandler(error: HttpErrorResponse): HttpErrorResponse {
    if (error.status === 401) {
      this.toastMsgService.showError('Your session is invalid. Kindly login again');
      localStorage.clear();
      this.router.navigate(['login']);
      if (error.url.includes('user/token/refresh')) window.location.reload();
    }
    else if (error.status === 500) {
      this.router.navigate(['server-error']);
    }
    else {
      error['error']?.['errors']?.forEach(err => {
        this.toastMsgService.showError(err.message)
      })
    }
    return error;
  }
}
