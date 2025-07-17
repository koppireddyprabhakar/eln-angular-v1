import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessAdminComponent } from './business-admin/business-admin.component';
import { DashboardComponent } from '@app/dashboard/dashboard.component';
import { PagesBlankComponent } from './pages/pages-blank/pages-blank.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesError404Component } from './pages/pages-error404/pages-error404.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { UsersProfileComponent } from './users-profile/users-profile.component';
import { FormulationsComponent } from './formulations/formulations.component';
import { CreateFormulationComponent } from './formulations/create-formulation/create-formulation.component';
import { CreateTrfComponent } from './test-request-form/create-trf/create-trf.component';
import { TrfDashboardComponent } from './trf-dashboard/trf-dashboard.component';
import { FormsPageComponent } from './formulations/forms-page/forms-page.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ElnLoginComponent } from './eln-login/eln-login.component';
import { ForgetComponent } from './forget/forget.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { AuthGuardGuard } from './shared/auth-guard/auth-guard.guard';
import { QaDashboardComponent } from './qa-dashboard/qa-dashboard.component';
import { CoaReviewComponent } from './coa-review/coa-review.component';
import { CoaApprovalFormulationComponent } from './coa-review/coa-approval-formulation/coa-approval-formulation.component';
import { CoaApprovalAnalysisComponent } from './coa-review/coa-approval-analysis/coa-approval-analysis.component';
import { QaFormulationApprovalComponent } from './qa-dashboard/qa-formulation-approval/qa-formulation-approval.component';
import { QaAnalysisApprovalComponent } from './qa-dashboard/qa-analysis-approval/qa-analysis-approval.component';
import { AuditlogsComponent } from './auditlogs/auditlogs.component';

// const routes: Routes = [
//   { path: '', component: DashboardComponent },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'pages-blank', component: PagesBlankComponent },
//   { path: 'pages-contact', component: PagesContactComponent },
//   { path: 'pages-error404', component: PagesError404Component },
//   { path: 'pages-faq', component: PagesFaqComponent },
//   { path: 'pages-login', component: PagesLoginComponent },
//   { path: 'pages-register', component: PagesRegisterComponent },
//   { path: 'user-profile', component: UsersProfileComponent },
// ];

const routes: Routes = [
  {
    path: "",
    component: ElnLoginComponent
  },
  {
    path: "app-forget",
    component: ForgetComponent
  },
  {
    path: "app-update-password",
    component: UpdatePasswordComponent
  },
  {
    path: "app-otp-verification",
    component: OtpVerificationComponent
  },
  {
    path: '',
    redirectTo: '/business-admin/users',
    pathMatch: 'full',
    canLoad: [AuthGuardGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () =>
      import('@app/dashboard/dashboard-routing.module').then(
        (route) => route.DashboardRoutingModule
      ),
      canLoad: [AuthGuardGuard]
  },
  {
    path: 'business-admin',
    component: BusinessAdminComponent,
    loadChildren: () =>
      import('@app/business-admin/business-admin.module').then(
        (route) => route.BusinessAdminModule
      ),
      canLoad: [AuthGuardGuard]
  },
  {
    path: 'test-request-form',
    component: TrfDashboardComponent,
    loadChildren: () =>
      import('@app/trf-dashboard/trf-dashboard.module').then(
        (route) => route.TrfDashboardModule
      ),
      canLoad: [AuthGuardGuard]
  },
  {
    path: 'forms-page',
    component: FormsPageComponent,
    loadChildren: () =>
      import('@app/formulations/formulations.module').then(
        (route) => route.FormulationsModule
      ),
      canLoad: [AuthGuardGuard]
  },
  {
    path: 'exp-analysis',
    component: AnalysisComponent,
    loadChildren: () =>
      import('@app/analysis/analysis.module').then(
        (route) => route.AnalysisModule
      ),
      canLoad: [AuthGuardGuard]
  },
  // {
  //   path: 'forms-page',
  //   component: FormulationsComponent,
  // },
  {
    path: 'create-forms',
    component: CreateFormulationComponent,
    canLoad: [AuthGuardGuard]
  },
  {
    path: 'user-profile',
    component: UsersProfileComponent,
    canLoad: [AuthGuardGuard]
  },
  {
    path: 'coareviewcomponent',
    component: CoaReviewComponent,
    canLoad: [AuthGuardGuard],
  },
  {
    path: 'coa-approval-formulation',
    component: CoaApprovalFormulationComponent,
  },
  {
    path: 'coa-approval-analysis',
    component: CoaApprovalAnalysisComponent,
  },
  { 
    path: 'forms-page/qadashboard',
     component: QaDashboardComponent 
  },

  { 
    path: 'qa-approval',
     component: QaFormulationApprovalComponent 
  },

  { 
    path: 'qa-analysis-approval',
     component: QaAnalysisApprovalComponent 
  },
  { 
    path: 'auditlogs',
     component:  AuditlogsComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
