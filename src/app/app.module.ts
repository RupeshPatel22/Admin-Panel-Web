import { ComponentsModule } from './shared/components/components.module';
import { DirectivesModule } from './shared/directives/directives.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './core/interceptors/http-request-interceptors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { Page404Component } from './shared/components/page404/page404.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ExceptionHandlerService } from './shared/services/exception-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DirectivesModule,
    ComponentsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 2000,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    { provide: ErrorHandler, useClass: ExceptionHandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
