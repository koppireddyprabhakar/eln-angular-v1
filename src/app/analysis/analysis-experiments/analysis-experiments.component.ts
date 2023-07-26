import {
  Component,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeWhile } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

import { AnalysisService } from '@app/shared/services/analysis/analysis.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { DataTableDirective } from 'angular-datatables';
import { UserService } from '@app/shared/services/user/user.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';

@Component({
  selector: 'app-analysis-experiments',
  templateUrl: './analysis-experiments.component.html',
  styleUrls: ['./analysis-experiments.component.scss'],
})
export class AnalysisExperimentsComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  experiments: any = [];
  myExperiments: any = [];
  subscribeFlag = true;
  expColumns: any;
  myExpColumns: any;
  users: any = [];
  options: any = { rowClickEvent: true };
  userId: any;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  dtMyProjectsTrigger: Subject<any> = new Subject<any>();
  dtMyProjectsOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
  };

  selectedUser: object;
  reviewSubmitForm = this.formBuilder.group({
    userId: ['', [Validators.required]]
  });

  @ViewChild('expActionTpl', { static: true }) expActionTpl: TemplateRef<any>;

  constructor(
    private readonly globalService: GlobalService,
    private readonly analysisService: AnalysisService,
    private readonly formulationService: FormulationsService,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly toastr: ToastrService,
    private route: Router,
    private loginService: LoginserviceService
  ) { }

  ngOnInit(): void {
    this.getExperiments();
    this.getUsers();
    this.expColumns = [
      { key: 'analysisName', title: 'Analysis Name' },
      { key: 'projectId', title: 'Project Id' },
      { key: 'status', title: 'Status' },
      // {
      //   key: 'options',
      //   title: '<div class="blue">Options</div>',
      //   align: { head: 'center', body: 'center' },
      //   sorting: false,
      //   width: 150,
      //   cellTemplate: this.actionTpl,
      // },
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
    this.dtTrigger.next(null);
    this.dtMyProjectsTrigger.next(null);
  }

  getExperiments() {
    this.globalService.showLoader();
    this.analysisService
      .getALlAnalysisExperiments()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiments) => {
        this.experiments = experiments;
        this.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'first-table') {
                dtInstance.destroy();
                this.dtTrigger.next(this.experiments);
              }
            });
          }
        );
        this.globalService.hideLoader();
      });
  }

  getMyExperiments() {
    // this.globalService.showLoader();
    this.analysisService
      .getAnalysisExperimentById()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((myExperiments) => {
        this.myExperiments = myExperiments;
        this.dtElements.forEach(
          (dtElement: DataTableDirective, index: number) => {
            dtElement.dtInstance.then((dtInstance: any) => {
              if (dtInstance.table().node().id === 'second-table') {
                dtInstance.destroy();
                this.dtMyProjectsTrigger.next(this.myExperiments);
              }
            });
          }
        );
        this.globalService.hideLoader();
      });
  }

  onRowClick(event) {
    this.route.navigateByUrl(
      `/exp-analysis/exp-dashboard?projectId=${event.projectId}&analysisId=${event.analysisId}`
    );

  }

  selectUser(user) {
    this.selectedUser = user;
    // this.reviewSubmitForm.patchValue({ roleId: user.userId });
  }

  submitReview() {
    if (this.reviewSubmitForm.invalid) {
      this.toastr.error('Experiment has to be assigned to reviewer.');
      return;
    }
    const reviewObj = {
      reviewUserId: this.reviewSubmitForm.get('userId')!.value,
      analysisId: this.selectedUser['analysisId'],
      userId: this.loginService.userDetails.userId
    };
    if (this.reviewSubmitForm.get('userId')!.value) {
      this.globalService.showLoader();

      this.analysisService
        .createAnalysisReview(reviewObj)
        .subscribe((data) => {
          this.toastr.success(data['data'], 'Success');
          this.globalService.hideLoader();
          this.getMyExperiments();
          // this.route.navigateByUrl(
          //   `/exp-analysis/analysis-experiments`
          // );
        });
    } else {
      this.reviewSubmitForm.get('roleId')?.markAsDirty();
    }
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

  viewAnalysisExperiment(event) {
    this.route.navigateByUrl(
      `/exp-analysis/view-analysis-experiment?projectId=${event.projectId}&analysisId=${event.analysisId}`
    );
  }

}
