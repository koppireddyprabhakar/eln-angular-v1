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

@NgModule({
  declarations: [
    AnalysisComponent,
    AnalysisListComponent,
    AnalysisDashbaordComponent,
    AnalysisExperimentsComponent,
    AnalysisProjectsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnalysisRoutingModule,
    NgxDatatableModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class AnalysisModule {}
