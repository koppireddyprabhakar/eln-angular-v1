import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@app/shared/components/footer/footer.component';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { SidebarComponent } from '@app/shared/components/sidebar/sidebar.component';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, SidebarComponent],
  imports: [CommonModule, RouterModule],
  exports: [FooterComponent, HeaderComponent, SidebarComponent],
})
export class SharedModule {}
