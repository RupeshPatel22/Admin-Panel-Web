import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/material.module';
import { ComponentsModule } from './components/components.module';
import {NgxImgModule} from 'ngx-img';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToggleModule } from 'ng-toggle-button';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PipesModule } from './pipes/pipes.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DirectivesModule } from './directives/directives.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgToggleModule,
    NgxMaterialTimepickerModule,
    PipesModule,
    NgxImgModule,
    Ng2SearchPipeModule,
    DirectivesModule
  ],
  exports: [
    MaterialModule,
    ComponentsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgToggleModule,
    NgxMaterialTimepickerModule,
    PipesModule,
    NgxImgModule,
    Ng2SearchPipeModule,
    DirectivesModule
  ]
})
export class SharedModule { }
