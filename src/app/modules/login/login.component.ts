import { ToastService } from './../../shared/services/toast.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/shared/services/login.service';
import { Services } from 'src/app/shared/models/constants/constant.type';
import { Location } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Config } from 'ng-otp-input/lib/models/config';
import { NgOtpInputComponent } from 'ng-otp-input';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private unsubscriber: Subject<void> = new Subject<void>();
  
  phone = new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{9}')]);
  otp: string;
  interval: any;
  timeLeft: number = 30;
  canResendOtp: boolean;
  isOtpSent: boolean;
  otpInputConfig: Config = {
    allowNumbersOnly: true,
    length: 5,
  };
  outletId: string;
  service: string;
  @ViewChild(NgOtpInputComponent) otpInputField: NgOtpInputComponent;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastMsgService: ToastService,
    private sharedService: SharedService,
    private location: Location
  ) { }

  

  ngOnInit() {
    if (this.outletId) {

      history.pushState(null, '');

      fromEvent(window, 'popstate')
        .pipe(takeUntil(this.unsubscriber))
        .subscribe((_) => {
          history.go(-1);
        });
    }

    // for deep linking
    const state: any = this.location.getState();
    if (state.outletId) {
      this.outletId = state.outletId;
    }

  }

  /**
   * Method that sends login otp
   * @returns 
   */
  sendOtp() {
    if (!this.phone.valid) return this.toastMsgService.showError('Enter valid phone number');
    const data = {
      phone: `+91${this.phone.value}`
    }
    this.loginService.sendLoginOtp(data).subscribe(res => {
      this.startTimer();
      this.isOtpSent = true;
      this.toastMsgService.showSuccess('OTP sent');
      
    })
    // clear the OTP field
    if (this.otpInputField) {
      this.otpInputField.setValue('');
    }
  }

  /**
   * Method that verifies login otp
   */
  verifyOtp() {
    const data = {
      phone: `+91${this.phone.value}`,
      otp: this.otp
    }
    this.loginService.verifyLoginOtp(data).subscribe(res => {
      this.stopTimer();
      localStorage.setItem('token', res['result']['token']);
      localStorage.setItem('refreshToken', res['result']['refresh_token']);
      localStorage.setItem('userName', res['result']['full_name']);
      this.sharedService.setService(Services.Live);
      if (this.outletId) {
        this.router.navigate([this.sharedService.service, 'outlet-details'], { queryParams: { id: this.outletId } });
      } else {
        this.router.navigate([this.sharedService.service, 'all-service-live-statistics']);
      }
      this.toastMsgService.showSuccess('Logged In Successfully');
    })
  }

  /**
   * Method that invokes on each otp input
   * and it stores the otp
   * @param event 
   */
  onOtpChange(event: string) {
    this.otp = event;
  }

  /**
   * Method that starts timer for resend otp
   */
  startTimer() {
    this.canResendOtp = false;
    this.interval = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft === 0) {
        this.stopTimer();
      }
    }, 1000)
  }

  /**
   * Method that stops timer
   */
  stopTimer() {
    clearInterval(this.interval);
    this.timeLeft = 30;
    this.canResendOtp = true;
  }

  /**
   * Method that allow user to enter phone number again
   */
  signInAgain() {
    this.phone.reset();
    this.isOtpSent = false;
    this.stopTimer();
  }

  ngOnDestroy() {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
