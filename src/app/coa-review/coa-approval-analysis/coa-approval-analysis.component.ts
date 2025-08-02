import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-coa-approval-analysis',
  templateUrl: './coa-approval-analysis.component.html',
  styleUrls: ['./coa-approval-analysis.component.css']
})

export class CoaApprovalAnalysisComponent implements OnInit {
  
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  private subscribeFlag: boolean = true;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  analysisId: any;
  reviewPwdErrorMessage: string = '';
  expId: number;
  experiment: any;
  staticTrfId = 'TRF123';
  department = 'ANALYSIS'
  showPassword: boolean = false;
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
    approvedByDate: '',
    complianceStatus: false
   
  };
  
  
  complianceStatus: boolean = false;
  onComplianceChange(isCompliant: boolean) {
    this.testRequest.complianceStatus = isCompliant;
}

  userValidateForm = this.formBuilder.group({
          userName: [''],
          password: ['',[Validators.required]],
        });
    
  

  testId = 0;
  userRole: string;
  userDetails: any;
  currentDate: string;
  analysisexperiment: any;
  coadetails: any;
  constructor(private globalService: GlobalService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private readonly analysisService: AnalysisService,
    private formulationService: FormulationsService,
    private userService: UserService, // Inject UserService
    private loginService: LoginserviceService ,// Inject LoginserviceService
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  private experimentService: ExperimentService,) { }

  ngOnInit(): void {
     // Fetch user details and role directly
     this.userDetails = this.loginService.userDetails;
     this.userRole = this.userService.userRole || 'N/A';
     this.currentDate = new Date().toISOString();
    this.userValidateForm.get('userName')?.setValue(this.userDetails.mailId);
    this.analysisId = this.activatedRoute.snapshot.queryParams['analysisId'];
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
    this.getCoaUserDetailsByAnalysisId();
    if (this.analysisId) {
        this.getAnalysisExperimentsById();
        this.getTestResultsByAnalysisId();
      }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  getCoaUserDetailsByAnalysisId(){
    this.experimentService
    .getCoaUserDetailsByAnalysisId(this.analysisId)
    .subscribe((data) => {
      if (data.length > 0) {
        this.coadetails = data[0]; // Taking the first entry from the response array
      }
    });
  }
  
  
  getAnalysisExperimentsById() {
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
 
    this.experimentService
      .getAnalysisExperimentsById(this.analysisId)  // Use the captured `analysisId`
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((analysisexperiment) => {
       // this.analysisexperiment = analysisexperiment.map((trf) => flatten(trf))[0];
       this.analysisexperiment = flatten(analysisexperiment);
        this.getTestResultsByAnalysisId();
      });
  }

  redirectToExperiments() {
    this.route.navigate(['/coa-review']);
  }

  getTestResultsByAnalysisId() {
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
    this.analysisService
      . getTrfDetailsById(this.analysisId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((tests) => {
        this.tests = tests;
        let test = tests.map((trf) => flatten(trf))[0];
        this.testRequest['batchNumber'] = this.analysisexperiment.batchNumber;
        this.testRequest['dosageForm'] = this.analysisexperiment.dosageName;
        this.testRequest['projectName'] = this.analysisexperiment.projectName;
        this.testRequest['strength'] = this.analysisexperiment.strength;
        this.testRequest['batchSize'] = this.analysisexperiment.batchSize;
        this.testRequest['testRequestId'] = test.testRequestFormId;
        this.testRequest['productCode'] = this.analysisexperiment.productCode;
        this.testRequest['department'] = this.department;
        this.testRequest['expiryDate'] = test.expireDate;
        this.testRequest['manufacturingDate'] = test.manufacturingDate;
        this.testRequest['condition'] = test.condition;
        this.testRequest['stage'] = test.stage;
        this.testRequest['packaging'] = test.packaging;
        this.testRequest['labelClaim'] = test.labelClaim;
        this.testRequest['quantity'] = test.quantity;
        this.testRequest['market'] = this.analysisexperiment.markertName;
        this.testRequest['preparedByName'] = this.coadetails.preparedName;
        this.testRequest['preparedByDesignation'] = this.coadetails.preparedDesignation;
        this.testRequest['preparedByDate'] = this.coadetails.preparedDate;
        this.testRequest['reviewedByName'] = this.userDetails.firstName;
        this.testRequest['reviewedByDesignation'] = this.userRole;
        this.testRequest['reviewedByDate'] = this.currentDate;
        this.testRequest['complianceStatus'] = this.coadetails.complianceStatus;
 
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.tests);
        });
 
        this.globalService.hideLoader();
      });
  }
     
  updateCoaReviewDetails() {
    const coareviewdetails = {
        analysisExpId: this.analysisId,
        reviewedByUserId: this.userDetails.userId,
        reviewedByDate: new Date(),  
    };
    this.experimentService.updateAnalysisCoaReviewDetails(coareviewdetails).subscribe((data) => {
        this.toastr.success(data['data'], 'Success');
        this.redirectToExperiments();
    });
}

updateAnalysisStatus() {
     ;
    let analysisRequest = {
      analysisId: this.analysisId,
      status: 'COA Reviewed',
      summary: this.analysisexperiment.summary,
      userId: this.loginService.userDetails.userId,
    }
    if (!this.userValidateForm.invalid) {
      const request = {
        mailId: this.userValidateForm.value.userName || '',
        password: this.userValidateForm.value.password || ''
      };
      this.loginService.login(request).subscribe(response => {
         if (response.status=200) {
          this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
            this.updateCoaReviewDetails();
            this.toastr.success('Analysis Details Submitted successfully', 'Success');
            this.route.navigate(['/coa-generation-list']);
          });
        }
      },
       (err: HttpErrorResponse) => {
        const errorMessage =
          typeof err.error === 'string'
            ? err.error
            : err?.error?.message || err?.message || 'Something went wrong. Please try again.';

        this.reviewPwdErrorMessage = errorMessage;
      });  
    } else {
      this.userValidateForm.get('userName')?.markAsDirty();
      this.userValidateForm.get('password')?.markAsDirty();
    }
  }  
  
  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }

}
