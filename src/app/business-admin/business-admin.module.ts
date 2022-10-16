import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessAdminRoutingModule } from '@app/business-admin/business-admin-routing.module';
import { BusinessAdminComponent } from '@app/business-admin/business-admin.component';
import { UserComponent } from '@app/business-admin/user/user.component';
import { ProductComponent } from '@app/business-admin/product/product.component';
import { DosageComponent } from '@app/business-admin/dosage/dosage.component';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BusinessAdminComponent,
    UserComponent,
    ProductComponent,
    DosageComponent,
  ],
  imports: [
    CommonModule,
    BusinessAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class BusinessAdminModule {}
