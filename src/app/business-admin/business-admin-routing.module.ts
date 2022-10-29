import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from '@app/business-admin/user/user.component';
import { DosageComponent } from './dosage/dosage.component';
import { ProductComponent } from './product/product.component';
import { TeamComponent } from './team/team.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        component: UserComponent,
      },
      {
        path: 'products',
        component: ProductComponent,
      },
      {
        path: 'dosages',
        component: DosageComponent,
      },
      {
        path: 'test',
        component: TestComponent,
      },
      {
        path: 'team',
        component: TeamComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessAdminRoutingModule {}
