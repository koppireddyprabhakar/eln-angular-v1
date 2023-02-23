import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulationsComponent } from './formulations.component';
import { SharedModule } from '@app/shared/shared.module';
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
import { FormulationsProjectsComponent } from './formulations-projects/formulations-projects.component';
import { DataTablesModule } from 'angular-datatables';
import { FormulationsExperimentComponent } from './formulations-experiment/formulations-experiment.component';
import { InwardManagementComponent } from './inward-management/inward-management.component';
import { TestReqFormsComponent } from './test-req-forms/test-req-forms.component';
import { CoaGenerationListComponent } from './coa-generation-list/coa-generation-list.component';
import { CoaGenerationComponent } from './coa-generation-list/components/coa-generation/coa-generation.component';

@NgModule({
  declarations: [
    FormulationsComponent,
    CreateFormulationComponent,
    AddTrfComponent,
    FormsPageComponent,
    ReviewFormulationsComponent,
    ReviewFormulationsListComponent,
    FormulationsProjectsComponent,
    FormulationsExperimentComponent,
    InwardManagementComponent,
    TestReqFormsComponent,
    CoaGenerationListComponent,
    CoaGenerationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BusinessAdminModule,
    CKEditorModule,
    TrfDashboardModule,
    FormulationsRoutingModule,
    DataTablesModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class FormulationsModule {}
