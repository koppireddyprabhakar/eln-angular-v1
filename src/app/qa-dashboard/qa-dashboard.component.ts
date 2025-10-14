import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { UserService } from '@app/shared/services/user/user.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeWhile } from 'rxjs';


@Component({
  selector: 'app-qa-dashboard',
  templateUrl: './qa-dashboard.component.html',
  styleUrls: ['./qa-dashboard.component.css']
})
export class QaDashboardComponent implements OnInit {

  @ViewChildren('firstTable', { read: DataTableDirective }) dtElementsFormulation: QueryList<DataTableDirective>;
  @ViewChildren('secondTable', { read: DataTableDirective }) dtElementsAnalysis: QueryList<DataTableDirective>;
  @ViewChildren('thirdTable', { read: DataTableDirective }) dtElementsAnalysisDetails: QueryList<DataTableDirective>;

  @ViewChildren('thirdTable', { read: DataTableDirective }) dtElementsForAnalysis: QueryList<DataTableDirective>;
  experiments: any = [];
  myExperiments: any = [];
  subscribeFlag = true;
  expColumns: any;
  myExpColumns: any;
  users: any = [];
  options: any = { rowClickEvent: true };
  userId: any;

  dtFormulationExperimentTrigger: Subject<any> = new Subject<any>();
  dtFormulationExperiments = {
    pagingType: 'full_numbers',
  };
  dtAnalysisExperimentTrigger: Subject<any> = new Subject<any>();
  dtTriggerForAnalysis: Subject<any> = new Subject<any>();
  dtTriggerForAnalysisOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };

  dtAnalysisExperiments: DataTables.Settings = {
    pagingType: 'full_numbers',
  };

  selectedUser: object;
  reviewSubmitForm = this.formBuilder.group({
    userId: ['', [Validators.required]]
  });
  @ViewChild('expActionTpl', { static: true }) expActionTpl: TemplateRef<any>;
  expId: any;
  analysisId: any;
  analysisDetails: any;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(
    private readonly globalService: GlobalService,
    private readonly analysisService: AnalysisService,
    private readonly formulationService: FormulationsService,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly toastr: ToastrService,
    private readonly experimentService: ExperimentService,

    private route: Router,
    private loginService: LoginserviceService
  ) { }

  ngOnInit(): void {
    this.getFormulationExperiments();
    this.getAnalysisExperiments();
    this.getUsers();
    this.expColumns = [
      { key: 'experimentName', title: 'Analysis Name' },
      { key: 'projectId', title: 'Project Id' },
      { key: 'status', title: 'Status' },
    ];
    this.myExpColumns = [
      { key: 'analysisName', title: 'Experiment Name' },
      { key: 'batchNumber', title: 'Batch No.' },
      { key: 'batchSize', title: 'Batch Size' },
      { key: 'projectId', title: 'Project ID' },
      { key: 'formulationName', title: 'Formulation Type' },
      { key: 'strength', title: 'Strength' },
      { key: 'status', title: 'Status' },
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 150,
        cellTemplate: this.expActionTpl,
      },
    ];
  }

  ngAfterViewInit(): void {
    this.dtFormulationExperimentTrigger.next(null);
    this.dtAnalysisExperimentTrigger.next(null);
    this.dtTriggerForAnalysis.next(null);
 
  }

  getFormulationExperiments() {
    this.globalService.showLoader();
    this.experimentService
      .getExperiments()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiments) => {
        this.experiments = experiments.filter(
        (exp: any) => exp.status === 'COA Reviewed' || exp.status === 'COA Approved'
      );;
        this.dtElementsFormulation.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'first-table') {
                dtInstance.destroy();
                this.dtFormulationExperimentTrigger.next(this.experiments);
              }
            });
          }
        );
        this.globalService.hideLoader();
      });
  }

  getAnalysisExperiments() {
    this.analysisService.getALlAnalysisExperiments()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiments) => {
        this.myExperiments = experiments.filter(exp =>
        exp.status === 'COA Reviewed' || exp.status === 'COA Approved'
      );
        this.dtElementsAnalysis.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'second-table') {
                dtInstance.destroy();
                this.dtAnalysisExperimentTrigger.next(this.myExperiments);
              }
            });
          }
        );
        this.globalService.hideLoader();
      });
  }

  onRowClickForFormulation(event) {
    this.route.navigateByUrl(
      `qa-approval?projectId=${event.projectId}&experimentId=${event.expId}`
    );
  }

  onRowClickForAnalysis(event) {
    this.route.navigateByUrl(
      `qa-analysis-approval?projectId=${event.projectId}&analysisId=${event.analysisId}`
    );
  }



  getUsers() {
    this.globalService.showLoader();
    this.userService
      .getCustomRoles('ANALYSIS')
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((users) => {
        const usersList = users.map((user: any) => ({
          ...user,
          status: 'str',
        }));
        this.users = usersList;
        this.globalService.hideLoader();
      });
  }

getAnalysisExperimentsByExperimentId(experimentId) {
  this.globalService.showLoader();
  this.experimentService
    .getAnalysisExperimentsByExperimentId(experimentId)
    .pipe(takeWhile(() => this.subscribeFlag))
    .subscribe((analysisDetails) => {
      this.analysisDetails = analysisDetails;
      this.dtElementsForAnalysis.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: any) => {
          if (dtInstance.table().node().id === 'thirdTable') {
            dtInstance.destroy();
            this.dtTriggerForAnalysis.next(null);  // no arguments
          }
        });
      });
      this.globalService.hideLoader();
    });
}
  


  viewAnalysisExperiments(event) {
    this.route.navigateByUrl(
      `/exp-analysis/exp-dashboard?projectId=${event.projectId}&analysisId=${event.analysisId}`
    );
  }

  viewFormulationExperiments(event) {
    this.route.navigateByUrl(
      `/view-formulation-experiment?projectId=${event.projectId}&experimentId=${event.expId}`
    );
  }
}
