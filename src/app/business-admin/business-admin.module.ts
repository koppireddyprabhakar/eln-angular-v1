import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessAdminRoutingModule } from '@app/business-admin/business-admin-routing.module';
import { BusinessAdminComponent } from '@app/business-admin/business-admin.component';
import { UserComponent } from '@app/business-admin/user/user.component';
import { ProductComponent } from '@app/business-admin/product/product.component';
import { DosageComponent } from '@app/business-admin/dosage/dosage.component';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestComponent } from './test/test.component';
import { TeamComponent } from './team/team.component';
import { InwardManagementComponent } from './inward-management/inward-management.component';
import { AddTestComponent } from './test/add-test/add-test.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { AddProjectManagementComponent } from './project-management/add-project-management/add-project-management.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    BusinessAdminComponent,
    UserComponent,
    ProductComponent,
    DosageComponent,
    TestComponent,
    TeamComponent,
    InwardManagementComponent,
    AddTestComponent,
    AddUserComponent,
    ProjectManagementComponent,
    AddProjectManagementComponent,
  ],
  imports: [
    CommonModule,
    BusinessAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
})
export class BusinessAdminModule {}
