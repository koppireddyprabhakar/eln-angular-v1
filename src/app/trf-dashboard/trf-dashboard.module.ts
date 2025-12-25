import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrfDashboardRoutingModule } from './trf-dashboard-routing.module';
import { TrfDashboardComponent } from './trf-dashboard.component';
import { TrfComponent } from './trf/trf.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TrfDashboardComponent, TrfComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TrfDashboardRoutingModule,
  ],
  exports: [TrfComponent],
})
export class TrfDashboardModule {}
