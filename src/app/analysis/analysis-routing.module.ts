import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { AnalysisDashbaordComponent } from './analysis-dashbaord/analysis-dashbaord.component';
import { AnalysisExperimentsComponent } from './analysis-experiments/analysis-experiments.component';
import { AnalysisProjectsComponent } from './analysis-projects/analysis-projects.component';
import { AnalysisExperimentDashboardComponent } from './analysis-experiment-dashboard/analysis-experiment-dashboard.component';
import { AnalysisNewExperimentComponent } from './analysis-new-experiment/analysis-new-experiment.component';
import { ReviewExperimentsComponent } from './review-experiments/review-experiments.component';
import { ReviewExperimentsListComponent } from './review-experiments-list/review-experiments-list.component';
import { ViewAnalysisExperimentComponent } from './view-analysis-experiment/view-analysis-experiment.component';
import { InwardManagementComponent } from './inward-management/inward-management.component';

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
        path: 'analysis-exp',
        component: AnalysisNewExperimentComponent,
      },
      {
        path: 'analysis-experiments',
        component: AnalysisExperimentsComponent,
      },
      {
        path: 'projects',
        component: AnalysisProjectsComponent,
      },
      {
        path: 'review-list',
        component: ReviewExperimentsListComponent,
      },
      {
        path: 'review',
        component: ReviewExperimentsComponent,
      },
      {
        path: 'view-analysis-experiment',
        component: ViewAnalysisExperimentComponent
      },
      {
        path: 'analysis-inward-management',
        component: InwardManagementComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalysisRoutingModule { }
