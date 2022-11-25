import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulationsComponent } from './formulations.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@tusharghoshbd/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormulationsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxDatatableModule],
})
export class FormulationsModule {}
