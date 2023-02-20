import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalysisRoutingModule } from './analysis-routing.module';
import { AnalysisComponent } from './analysis.component';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { AnalysisDashbaordComponent } from './analysis-dashbaord/analysis-dashbaord.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnalysisExperimentsComponent } from './analysis-experiments/analysis-experiments.component';
import { AnalysisProjectsComponent } from './analysis-projects/analysis-projects.component';
import { AnalysisExperimentDashboardComponent } from './analysis-experiment-dashboard/analysis-experiment-dashboard.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { AnalysisNewExperimentComponent } from './analysis-new-experiment/analysis-new-experiment.component';
import { ReviewExperimentsComponent } from './review-experiments/review-experiments.component';
import { ReviewExperimentsListComponent } from './review-experiments-list/review-experiments-list.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '@app/shared/shared.module';
import { InwardManagementComponent } from './inward-management/inward-management.component';

@NgModule({
  declarations: [
    AnalysisComponent,
    AnalysisListComponent,
    AnalysisDashbaordComponent,
    AnalysisExperimentsComponent,
    AnalysisProjectsComponent,
    AnalysisExperimentDashboardComponent,
    AnalysisNewExperimentComponent,
    ReviewExperimentsComponent,
    ReviewExperimentsListComponent,
    InwardManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnalysisRoutingModule,
    CKEditorModule,
    DataTablesModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class AnalysisModule {}
