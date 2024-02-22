import { LoginRoutingModule } from './login-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';
@NgModule({
  imports: [
    CommonModule, 
    LoginRoutingModule,
    SharedModule,
    NgOtpInputModule
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
