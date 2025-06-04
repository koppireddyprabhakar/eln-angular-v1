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
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormBuilder } from '@angular/forms';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-coa-generation',
  templateUrl: './coa-generation.component.html',
  styleUrls: ['./coa-generation.component.css']
})
export class CoaGenerationComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  private subscribeFlag: boolean = true;
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
  complianceStatus: boolean = false;
  nonComplianceStatus: boolean = false;

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
    market: '',
    labelClaim: '',
    manufacturingDate: '',
    expiryDate: '',
    preparedByName: '',
    preparedByDesignation: '',
    preparedByDate: '',
    reviewedByName: '',
    reviewedByDesignation: '',
    reviewedByDate: '',
    approvedByName: '',
    approvedByDesignation: '',
    approvedByDate: ''
   
  };

  testId = 0;
  userRole: string;
  userDetails: any;
  currentDate: string;
  analysisSubmitDate: string;
  UserDetailsbyAnalysisId: any;

  userValidateForm = this.formBuilder.group({
      userName: [''],
      password: ['',[Validators.required]],
    });

  constructor(private globalService: GlobalService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private formulationService: FormulationsService,
    private experimentService: ExperimentService,
    private userService: UserService, // Inject UserService
    private loginService: LoginserviceService ,// Inject LoginserviceService
    private toastr: ToastrService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
     // Fetch user details and role directly
     this.userDetails = this.loginService.userDetails;
     this.userRole = this.userService.userRole || 'N/A';
     this.userValidateForm.get('userName')?.setValue(this.userDetails.mailId);
     this.currentDate = new Date().toISOString();
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
      { key: 'result', title: 'Results' },
      { key: 'description', title: 'Description' }

    ];
    if (this.expId) {
      this.getExperimentDetails();
    }

    this.getTestResults();
   
    // this.testRequest.preparedByName = this.userDetails.name;
    // this.testRequest.preparedByDesignation = this.userDetails.designation;
    // this.testRequest.reviewedByName = this.userDetails.name;
    // this.testRequest.reviewedByDate = this.currentDate;

    // this.testRequest.approvedByName = this.userDetails.name;
    // this.testRequest.approvedByDate = this.currentDate;

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  onComplianceChange(isCompliance: boolean) {
    if (isCompliance) {
      this.complianceStatus = true;
      this.nonComplianceStatus = false;
    } else {
      this.complianceStatus = false;
      this.nonComplianceStatus = true;
    }
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

       
       // console.log('Test Results:', tests);
        this.testRequest['batchNumber'] = this.experiment.batchNumber;
        this.testRequest['dosageForm'] = this.experiment.dosageName;
        this.testRequest['projectName'] = this.experiment.projectName;
        this.testRequest['strength'] = this.experiment.strength;
        this.testRequest['batchSize'] = this.experiment.batchSize;
        this.testRequest['preparedByDate'] = this.experiment.analysisSubmitDate;
        this.testRequest['testRequestId'] = this.staticTrfId;
        this.testRequest['department'] = this.experiment.departmentName;
        this.testRequest['productCode'] = this.experiment.productCode;
        this.testRequest['market'] = this.experiment.markertName;


        this.testRequest['expiryDate'] = test.expireDate;
        this.testRequest['manufacturingDate'] = test.manufacturingDate;
        this.testRequest['condition'] = test.condition;
        this.testRequest['stage'] = test.stage;
        this.testRequest['packaging'] = test.packaging;
        this.testRequest['labelClaim'] = test.labelClaim;
        this.testRequest['quantity'] = test.quantity;
        this.testRequest['preparedByName'] = this.userDetails.firstName;
        this.testRequest['preparedByDesignation'] = this.userRole;
        this.testRequest['preparedByDate'] = this.currentDate;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.tests);
        });

        this.globalService.hideLoader();
      });
  }

  saveCoaReviewDetails() {
    const coareviewdetails = {
      experimentId: this.expId,
        preparedByUserId: this.userDetails.userId,
        preparedByDate: new Date(),  
        complianceStatus: this.complianceStatus ? 1 : 0,
    };

    this.experimentService.saveCoaReviewDetails(coareviewdetails).subscribe((data) => {
        this.toastr.success(data['data'], 'Success');
        this.redirectToExperiments();
    });
}


updateExperimentStatus() {
  if (!this.userValidateForm.invalid) {
    const request = {
      mailId: this.userValidateForm.value.userName || '',
      password: this.userValidateForm.value.password || ''
    };
    this.loginService.login(request).subscribe(
      (response) => {
        console.log('user details', response);
        if (response) {  //  Corrected comparison
          this.experimentService.updateExperimentStatus(this.experiment.expId, 'COA Generated').subscribe((data) => {
            this.saveCoaReviewDetails();
            this.toastr.success(data['data'], 'Success');
            this.redirectToExperiments();
          });
        } else {
          this.toastr.error('Invalid credentials', 'Error');  //  Executes when login fails
        }
      },
      (error: HttpErrorResponse) => {
        this.toastr.error('Invalid credentials', 'Error'); // Executes when login API fails
      }
    );
  } else {
    this.userValidateForm.get('userName')?.markAsDirty();
    this.userValidateForm.get('password')?.markAsDirty();
  }
}

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
