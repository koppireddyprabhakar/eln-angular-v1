import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from '@app/business-admin/user/user.component';
import { DosageComponent } from './dosage/dosage.component';
import { InwardManagementComponent } from './inward-management/inward-management.component';
import { ProductComponent } from './product/product.component';
import { AddProjectManagementComponent } from './project-management/add-project-management/add-project-management.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { TeamComponent } from './team/team.component';
import { AddTestComponent } from './test/add-test/add-test.component';
import { TestComponent } from './test/test.component';
import { AddUserComponent } from './user/add-user/add-user.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UserComponent,
          },
          {
            path: 'add-user',
            component: AddUserComponent,
          },
        ],
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
        children: [
          {
            path: '',
            component: TestComponent,
          },
          {
            path: 'add-test',
            component: AddTestComponent,
          },
        ],
      },
      {
        path: 'team',
        component: TeamComponent,
      },
      {
        path: 'inward-management',
        component: InwardManagementComponent,
      },
      {
        path: 'project-management',
        children: [
          {
            path: '',
            component: ProjectManagementComponent,
          },
          {
            path: 'add-project',
            component: AddProjectManagementComponent,
          },
        ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessAdminRoutingModule {}
