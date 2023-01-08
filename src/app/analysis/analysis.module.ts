import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalysisRoutingModule } from './analysis-routing.module';
import { AnalysisComponent } from './analysis.component';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { NgxDatatableModule } from '@tusharghoshbd/ngx-datatable';
import { AnalysisDashbaordComponent } from './analysis-dashbaord/analysis-dashbaord.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnalysisExperimentsComponent } from './analysis-experiments/analysis-experiments.component';
import { AnalysisProjectsComponent } from './analysis-projects/analysis-projects.component';
import { AnalysisExperimentDashboardComponent } from './analysis-experiment-dashboard/analysis-experiment-dashboard.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    AnalysisComponent,
    AnalysisListComponent,
    AnalysisDashbaordComponent,
    AnalysisExperimentsComponent,
    AnalysisProjectsComponent,
    AnalysisExperimentDashboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnalysisRoutingModule,
    CKEditorModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class AnalysisModule {}
