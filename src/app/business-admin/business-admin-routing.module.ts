import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from '@app/business-admin/user/user.component';
import { DosageComponent } from './dosage/dosage.component';
import { ProductComponent } from './product/product.component';

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
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessAdminRoutingModule {}
