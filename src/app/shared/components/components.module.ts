import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MaterialModule } from 'src/material.module';
import {NgxImgModule} from 'ngx-img';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FormErrorMsgComponent } from './form-error-msg/form-error-msg.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { ToolsComponent } from './tools/tools.component';
import { AddNewItemModalComponent } from './add-new-item-modal/add-new-item-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { Page500Component } from './page500/page500.component';


@NgModule({
  declarations: [
    PageTitleComponent,
    FormErrorMsgComponent,
    ToolsComponent,
    ConfirmationDialogComponent,
    AddNewItemModalComponent,
    Page500Component
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxImgModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [
    PageTitleComponent,
    FormErrorMsgComponent,
    ToolsComponent,
    ConfirmationDialogComponent,
    AddNewItemModalComponent,
    NgxImgModule,
  ]
})
export class ComponentsModule {
}
