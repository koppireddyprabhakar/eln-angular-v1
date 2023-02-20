import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersProfileComponent } from './users-profile/users-profile.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { PagesError404Component } from './pages/pages-error404/pages-error404.component';
import { PagesBlankComponent } from './pages/pages-blank/pages-blank.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { BusinessAdminModule } from './business-admin/business-admin.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormulationsModule } from './formulations/formulations.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { CreateTrfComponent } from './test-request-form/create-trf/create-trf.component';
import { ElnLoginComponent } from './eln-login/eln-login.component';
import { ForgetComponent } from './forget/forget.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { AuthGuardGuard } from './shared/auth-guard/auth-guard.guard';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UsersProfileComponent,
    PagesFaqComponent,
    PagesContactComponent,
    PagesRegisterComponent,
    PagesLoginComponent,
    PagesError404Component,
    PagesBlankComponent,
    CreateTrfComponent,
    ElnLoginComponent,
    ForgetComponent,
    UpdatePasswordComponent,
    OtpVerificationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule,
    CommonModule,
    BusinessAdminModule,
    FormulationsModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [AuthGuardGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
