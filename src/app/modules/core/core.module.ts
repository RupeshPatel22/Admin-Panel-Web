import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AreaComponent } from './area/area.component';
import { AreaListsComponent } from './area/area-lists/area-lists.component';
import { CityComponent } from './city/city.component';
import { AddCityDialogComponent } from './city/add-city-dialog/add-city-dialog.component';
import { environment } from 'src/environments/environment';
import { AgmCoreModule } from '@agm/core';
import { ClientLogsComponent } from './client-logs/client-logs.component';
import { AllServicesComponent } from './all-services/all-services.component';



@NgModule({
  declarations: [
    CityComponent,
    AreaComponent,
    AreaListsComponent,
    AddCityDialogComponent,
    ClientLogsComponent,
    AllServicesComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
      libraries: ["places", "drawing", "geometry"],
    }),
  ]
})
export class CoreModule { }
