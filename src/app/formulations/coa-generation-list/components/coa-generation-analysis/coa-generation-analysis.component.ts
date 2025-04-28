import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';
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
  selector: 'app-coa-generation-analysis',
  templateUrl: './coa-generation-analysis.component.html',
  styleUrls: ['./coa-generation-analysis.component.css']
})
export class CoaGenerationAnalysisComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  private subscribeFlag: boolean = true;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  analysisId: any;

  expId: number;
  experiment: any;
  staticTrfId = 'TRF123';
  department = 'ANALYSIS'
  complianceStatus: boolean = false;
  nonComplianceStatus: boolean = false;
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
    market: '',
    expiryDate: '',
    approvedByName: '',
    approvedByDesignation: '',
    approvedByDate: '',
    preparedByName: '',
    reviewedByName: '' , 
    preparedByDesignation: '',
    reviewedByDesignation: '',
    preparedByDate: '',
    reviewedByDate: '',

  };
  
  userValidateForm = this.formBuilder.group({
    userName: [''],
    password: ['',[Validators.required]],
  });
  
  testId = 0;
  userRole: string;
  userDetails: any;
  currentDate: string;
  analysisexperiment: any;
  UserDetailsbyAnalysisId: any;
  constructor(private globalService: GlobalService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private readonly analysisService: AnalysisService,
    private formulationService: FormulationsService,
    private userService: UserService, // Inject UserService
    private loginService: LoginserviceService ,// Inject LoginserviceService
    private toastr: ToastrService,
  private formBuilder: FormBuilder,
  private experimentService: ExperimentService) { }

  ngOnInit(): void {
     this.userDetails = this.loginService.userDetails;
     this.userRole = this.userService.userRole || 'N/A';
     this.userValidateForm.get('userName')?.setValue(this.userDetails.mailId);
     this.currentDate = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
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
    if (this.analysisId) {
        this.getAnalysisExperimentsById();
        this.getTestResultsByAnalysisId();
      }
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
  getAnalysisExperimentsById() {
    debugger
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
    .getAnalysisExperimentsById(this.analysisId)
    .pipe(takeWhile(() => this.subscribeFlag))
    .subscribe((analysisexperiment) => {
      this.analysisexperiment = flatten(analysisexperiment);
      console.log('Analysis Experiment:', this.analysisexperiment.batchNumber);
      this.getTestResultsByAnalysisId();
    });

  }
  
 
  

  redirectToExperiments() {
    this.route.navigate(['/forms-page/coa-generation-list/']);
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
        console.log('Analysis Experiment:', this.analysisexperiment);
        console.log('Analysis Experiment:', this.tests);

        console.log('Analysis Experiment:', this.analysisexperiment.batchNumber);
        console.log('Test Results:', tests);
        this.testRequest['batchNumber'] = this.analysisexperiment.batchNumber;
        this.testRequest['dosageForm'] = this.analysisexperiment.dosageName;
        this.testRequest['projectName'] = this.analysisexperiment.projectName;
        this.testRequest['strength'] = this.analysisexperiment.strength;
        this.testRequest['batchSize'] = this.analysisexperiment.batchSize;
        this.testRequest['testRequestId'] = this.staticTrfId;
        this.testRequest['productCode'] = this.analysisexperiment.productCode;
        this.testRequest['department'] = this.department;
        this.testRequest['market'] = this.analysisexperiment.markertName;

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
        analysisExpId: this.analysisId,
        preparedByUserId: this.userDetails.userId,
        preparedByDate: new Date(),  
        complianceStatus: this.complianceStatus ? 1 : 0,
    };

    this.experimentService.saveCoaReviewDetails(coareviewdetails).subscribe((data) => {
        this.toastr.success(data['data'], 'Success');
        this.redirectToExperiments();
    });
}


  updateAnalysisStatus() {
     ;
    let analysisRequest = {
      analysisId: this.analysisId,
      status: 'COA Generated',
      summary: this.analysisexperiment.summary,
      userId: this.loginService.userDetails.userId,
    }
    if (!this.userValidateForm.invalid) {
      const request = {
        mailId: this.userValidateForm.value.userName || '',
        password: this.userValidateForm.value.password || ''
      };
      this.loginService.login(request).subscribe(response => {
        console.log('usersdeatils', response);        if (response.status=200) {
          this.analysisService.updateAnalysisStatus(analysisRequest).subscribe((data) => {
            this.saveCoaReviewDetails();
            this.toastr.success('Analysis Details Submitted successfully', 'Success');
            this.route.navigate(['/coa-generation-list']);
          });
        } else {
          this.toastr.error('Invalid credentials', 'Error');
        }
      },
      (error: HttpErrorResponse) => {       
          this.toastr.error('Invalid credentials', 'Error');
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
