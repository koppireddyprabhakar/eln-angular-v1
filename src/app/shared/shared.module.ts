import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '@app/layouts/footer/footer.component';
import { HeaderComponent } from '@app/layouts/header/header.component';
import { SidebarComponent } from '@app/layouts/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, SidebarComponent],
  imports: [CommonModule, RouterModule],
  exports: [FooterComponent, HeaderComponent, SidebarComponent],
})
export class SharedModule {}
