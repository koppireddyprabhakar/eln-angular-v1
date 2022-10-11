import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessAdminRoutingModule } from '@app/business-admin/business-admin-routing.module';
import { BusinessAdminComponent } from '@app/business-admin/business-admin.component';
import { UserComponent } from '@app/business-admin/user/user.component';
import { ProductComponent } from '@app/business-admin/product/product.component';
import { DosageComponent } from '@app/business-admin/dosage/dosage.component';
import { HeaderComponent } from '@app/layouts/header/header.component';
import { FooterComponent } from '@app/layouts/footer/footer.component';
import { SidebarComponent } from '@app/layouts/sidebar/sidebar.component';

@NgModule({
  declarations: [
    BusinessAdminComponent,
    UserComponent,
    ProductComponent,
    DosageComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
  ],
  imports: [CommonModule, BusinessAdminRoutingModule],
  exports: [HeaderComponent, FooterComponent, SidebarComponent],
})
export class BusinessAdminModule {}
