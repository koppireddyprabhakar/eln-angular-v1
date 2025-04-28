import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { UserService } from '@app/shared/services/user/user.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeWhile } from 'rxjs';

@Component({
  selector: 'app-coa-approval-formulation',
  templateUrl: './coa-approval-formulation.component.html',
  styleUrls: ['./coa-approval-formulation.component.css']
})
export class CoaApprovalFormulationComponent implements OnInit {

  
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
  complianceStatus: boolean = false;
  onComplianceChange(isCompliant: boolean) {
    this.testRequest.complianceStatus = isCompliant;
}
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
    expiryDate: '',
    market: '',
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

     userValidateForm = this.formBuilder.group({
        userName: [''],
        password: ['',[Validators.required]],
      });
  

  testId = 0;
  userRole: string;
  userDetails: any;
  currentDate: string;
  coadetails: any;

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
     this.currentDate = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
     this.userValidateForm.get('userName')?.setValue(this.userDetails.mailId);
     console.log('User Details:', this.userDetails);
     console.log('User Role:', this.userRole);

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
    this.getCoaUserDetailsById();
    this.getTestResults();
    this.updateCoaReviewDetails();
   
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

  getCoaUserDetailsById(){
    this.experimentService
    .getCoaUserDetailsById(this.expId)
    .subscribe((data) => {
      console.log(data);
      if (data.length > 0) {
        this.coadetails = data[0]; // Taking the first entry from the response array
        console.log("COA Details:", this.coadetails);
      }
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
        this.tableData = tests.map((trf) => flatten(trf));  // Update tableData here
        console.log('Test Results:', this.tableData);  // Check if the data is populated
  
        let test = this.tableData[0];  // Assuming the first test entry is used
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
        this.testRequest['quantity'] = test.quantity;
        this.testRequest['market'] = test.markertName;
        this.testRequest['preparedByName'] = this.coadetails.preparedName;
        this.testRequest['preparedByDesignation'] = this.coadetails.preparedDesignation;
        this.testRequest['preparedByDate'] = this.coadetails.preparedDate;
        this.testRequest['reviewedByName'] = this.userDetails.firstName;
        this.testRequest['reviewedByDesignation'] = this.userRole;
        this.testRequest['reviewedByDate'] = this.currentDate;
        this.testRequest['complianceStatus'] = this.coadetails.complianceStatus;
  
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(this.tableData);  // Ensure that the table is updated
        });
  
        this.globalService.hideLoader();
      });
  }
  
  updateCoaReviewDetails() {
    const coareviewdetails = {
        experimentId: this.expId,
        reviewedByUserId: this.userDetails.userId,
        reviewedByDate: new Date(),  
    };
    this.experimentService.updateFormulationCoaReviewDetails(coareviewdetails).subscribe((data) => {
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
          this.experimentService.updateExperimentStatus(this.experiment.expId, 'COA Reviewed').subscribe((data) => {
            this.updateCoaReviewDetails();
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
