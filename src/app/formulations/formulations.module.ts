import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulationsComponent } from './formulations.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxDatatableModule } from '@tusharghoshbd/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateFormulationComponent } from './create-formulation/create-formulation.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [FormulationsComponent, CreateFormulationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    CKEditorModule,
    BrowserModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FormulationsModule {}
