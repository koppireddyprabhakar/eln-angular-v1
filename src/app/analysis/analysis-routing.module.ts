import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { AnalysisDashbaordComponent } from './analysis-dashbaord/analysis-dashbaord.component';
import { AnalysisExperimentsComponent } from './analysis-experiments/analysis-experiments.component';
import { AnalysisProjectsComponent } from './analysis-projects/analysis-projects.component';
import { AnalysisExperimentDashboardComponent } from './analysis-experiment-dashboard/analysis-experiment-dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: AnalysisListComponent,
      },
      {
        path: 'dashboard',
        component: AnalysisDashbaordComponent,
      },
      {
        path: 'exp-dashboard',
        component: AnalysisExperimentDashboardComponent,
      },
      {
        path: 'analysis-experiments',
        component: AnalysisExperimentsComponent,
      },
      {
        path: 'projects',
        component: AnalysisProjectsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalysisRoutingModule {}
