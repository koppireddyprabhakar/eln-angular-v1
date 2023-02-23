import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeWhile } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';

import { GlobalService } from '@app/shared/services/global/global.service';
import { TrfService } from '@app/shared/services/test-request-form/trf.service';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { TestService } from '@app/shared/services/test/test.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';

@Component({
  selector: 'app-coa-generation',
  templateUrl: './coa-generation.component.html',
  styleUrls: ['./coa-generation.component.css']
})
export class CoaGenerationComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  private subscribeFlag: boolean = true;
  public dosagesList: Dosages[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  expId: number;
  experiment: any;
  staticTrfId = 'TRF123';

  tests: any = [];
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};

  columns: any = [];
  options: any = {};
  tableData: any = [];

  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  testRequest = {
    testRequestId: '',
    department: '',
    dosageForm: '',
    projectName: '',
    productCode: '',
    strength: '',
    batchNumber: '',
    condition: '',
    stage: '',
    packaging: '',
    batchSize: '',
    quantity: '',
    labelClaim: '',
    manufacturingDate: '',
    expiryDate: ''
  };

  testId = 0;

  constructor(private globalService: GlobalService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private formulationService: FormulationsService,
    private experimentService: ExperimentService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.expId = this.activatedRoute.snapshot.queryParams['experimentId'];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'testId',
      textField: 'testName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.columns = [
      { key: 'testNumber', title: 'Test Id' },
      { key: 'testName', title: 'Test Name' },
      { key: 'result', title: 'Results' }
    ];
    if (this.expId) {
      this.getExperimentDetails();
    }

    this.getTestResults();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  getExperimentDetails() {
    const flatten = (object) => {
      let value = {};
      for (var property in object) {
        if (typeof object[property] === 'object') {
          for (var p in object[property]) {
            value[p] = object[property][p];
          }
        } else {
          value[property] = object[property];
        }
      }
      return value;
    };
    this.formulationService
      .getExperimentsById(this.expId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiment) => {
        this.experiment = experiment.map((trf) => flatten(trf))[0];
        this.getTestResults();
        // this.globalService.hideLoader();
      });
  }

  redirectToExperiments() {
    this.route.navigate(['/forms-page/coa-generation-list/']);
  }

  getTestResults() {
    this.globalService.showLoader();
    const flatten = (object) => {
      let value = {};
      for (var property in object) {
        if (typeof object[property] === 'object') {
          for (var p in object[property]) {
            value[p] = object[property][p];
          }
        } else {
          value[property] = object[property];
        }
      }
      return value;
    };
    this.formulationService
      .getTrfResultsByExperimentId(this.expId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((tests) => {
        this.tests = tests;
        let test = tests.map((trf) => flatten(trf))[0];

        this.testRequest['batchNumber'] = this.experiment.batchNumber;
        this.testRequest['dosageForm'] = this.experiment.dosageName;
        this.testRequest['projectName'] = this.experiment.projectName;
        this.testRequest['strength'] = this.experiment.strength;
        this.testRequest['batchSize'] = this.experiment.batchSize;
        this.testRequest['testRequestId'] = this.staticTrfId;
        this.testRequest['department'] = this.experiment.departmentName;
        this.testRequest['productCode'] = this.experiment.productCode;

        this.testRequest['expiryDate'] = test.expireDate;
        this.testRequest['manufacturingDate'] = test.manufacturingDate;
        this.testRequest['condition'] = test.condition;
        this.testRequest['stage'] = test.stage;
        this.testRequest['packaging'] = test.packaging;
        this.testRequest['labelClaim'] = test.labelClaim;
        this.testRequest['quantity'] = test.quantit;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.tests);
        });

        this.globalService.hideLoader();
      });
  }

  updateExperimentStatus() {
    this.experimentService.updateExperimentStatus(this.experiment.expId, 'COA Generated').subscribe((data) => {
      this.toastr.success(data['data'], 'Success');
      this.redirectToExperiments();
    });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }

}
