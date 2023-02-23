import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsPageComponent } from './forms-page/forms-page.component';
import { FormulationsComponent } from './formulations.component';
import { CreateFormulationComponent } from './create-formulation/create-formulation.component';
import { AddTrfComponent } from './add-trf/add-trf.component';
import { ReviewFormulationsComponent } from './review-formulations/review-formulations.component';
import { ReviewFormulationsListComponent } from './review-formulations-list/review-formulations-list.component';
import { FormulationsProjectsComponent } from './formulations-projects/formulations-projects.component';
import { FormulationsExperimentComponent } from './formulations-experiment/formulations-experiment.component';
import { TestReqFormsComponent } from './test-req-forms/test-req-forms.component';
import { CoaGenerationListComponent } from './coa-generation-list/coa-generation-list.component';
import { CoaGenerationComponent } from './coa-generation-list/components/coa-generation/coa-generation.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new-formulation',
        component: FormulationsComponent,
      },
      {
        path: 'add-trf',
        component: AddTrfComponent,
      },
      {
        path: 'review-formulations',
        component: ReviewFormulationsListComponent,
      },
      {
        path: 'coa-generation-list',
        component: CoaGenerationListComponent
      },
      {
        path: 'projects',
        component: FormulationsProjectsComponent,
      },
      {
        path: 'review',
        component: ReviewFormulationsComponent,
      },
      {
        path: 'experiments',
        component: FormulationsExperimentComponent,
      },
      {
        path: 'test-req-forms',
        component: TestReqFormsComponent,
      },
      {
        path: 'coa-generation',
        component: CoaGenerationComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulationsRoutingModule { }
