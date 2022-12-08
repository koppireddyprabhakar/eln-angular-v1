import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrfComponent } from './trf/trf.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'trf',
        component: TrfComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrfDashboardRoutingModule {}
