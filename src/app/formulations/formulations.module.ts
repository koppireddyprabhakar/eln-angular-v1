import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulationsComponent } from './formulations.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@tusharghoshbd/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateFormulationComponent } from './create-formulation/create-formulation.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BusinessAdminModule } from '@app/business-admin/business-admin.module';
import { TrfDashboardModule } from '@app/trf-dashboard/trf-dashboard.module';
import { AddTrfComponent } from './add-trf/add-trf.component';
import { FormsPageComponent } from './forms-page/forms-page.component';
import { FormulationsRoutingModule } from './formulations-routing.module';
import { ReviewFormulationsComponent } from './review-formulations/review-formulations.component';
import { ReviewFormulationsListComponent } from './review-formulations-list/review-formulations-list.component';

@NgModule({
  declarations: [
    FormulationsComponent,
    CreateFormulationComponent,
    AddTrfComponent,
    FormsPageComponent,
    ReviewFormulationsComponent,
    ReviewFormulationsListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    BusinessAdminModule,
    CKEditorModule,
    TrfDashboardModule,
    FormulationsRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class FormulationsModule {}
