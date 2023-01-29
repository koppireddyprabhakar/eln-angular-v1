import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsPageComponent } from './forms-page/forms-page.component';
import { FormulationsComponent } from './formulations.component';
import { CreateFormulationComponent } from './create-formulation/create-formulation.component';
import { AddTrfComponent } from './add-trf/add-trf.component';
import { ReviewFormulationsComponent } from './review-formulations/review-formulations.component';
import { ReviewFormulationsListComponent } from './review-formulations-list/review-formulations-list.component';

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
        path: 'review',
        component: ReviewFormulationsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulationsRoutingModule {}
