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
  selector: 'app-qa-formulation-approval',
  templateUrl: './qa-formulation-approval.component.html',
  styleUrls: ['./qa-formulation-approval.component.css']
})
export class QaFormulationApprovalComponent implements OnInit {

  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  private subscribeFlag: boolean = true;
  public dosagesList: Dosages[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  expId: number;
  isCoaApproved: boolean = false; 
  experiment: any;
  staticTrfId = 'TRF123';
  showPassword: boolean = false;
  tests: any = [];
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  reviewPwdErrorMessage: string = '';
  columns: any = [];
  options: any = {};
  tableData: any = [];
  complianceStatus: boolean = false;
  onComplianceChange(isCompliant: boolean) {
    this.testRequest.complianceStatus = isCompliant;
}

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
    private userService: UserService,
    private loginService: LoginserviceService ,
    private toastr: ToastrService,
  private formBuilder: FormBuilder) { }

  ngOnInit(): void {
     this.userDetails = this.loginService.userDetails;
     this.userRole = this.userService.userRole || 'N/A';
     this.currentDate = new Date().toISOString();
     this.userValidateForm.get('userName')?.setValue(this.userDetails.mailId);
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
      });
  }

  getCoaUserDetailsById(){
    this.experimentService.getCoaUserDetailsById(this.expId)
     .subscribe((data) => {
      if (data && data.length > 0) {
        this.coadetails = data[0];
      } else {
        this.coadetails = {};
      }
    });
  }

  redirectToExperiments() {
    this.route.navigate(['/forms-page/qadashboard']);
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
        this.testRequest['quantity'] = test.quantity;
        this.testRequest['market'] = this.experiment.markertName;
        this.testRequest['preparedByName'] = this.coadetails.preparedName;
        this.testRequest['preparedByDesignation'] = this.coadetails.preparedDesignation;
        this.testRequest['preparedByDate'] = this.coadetails.preparedDate;
        this.testRequest['reviewedByName'] = this.coadetails.reviewerName;
        this.testRequest['reviewedByDesignation'] = this.coadetails.reviewerDesignation;
        this.testRequest['reviewedByDate'] = this.coadetails.reviewedDate;
         this.testRequest['approvedByName'] = this.userDetails.firstName;
        this.testRequest['approvedByDesignation'] = this.userRole;
        this.testRequest['approvedByDate'] = this.currentDate;
        this.testRequest['complianceStatus'] = this.coadetails.complianceStatus;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(this.tests);
        });

        this.globalService.hideLoader();
      });
  }

  updateCoaReviewDetails() {
    const coareviewdetails = {
        experimentId: this.expId,
        approvedByUserId: this.userDetails.userId,
        approvedByDate: new Date(),  
    };

    this.experimentService.updateformulationCoaAprovalDetails(coareviewdetails).subscribe((data) => {
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
        if (response) {  
          this.experimentService.updateExperimentStatus(this.experiment.expId, 'COA Approved').subscribe((data) => {
            this.updateCoaReviewDetails();
            this.toastr.success(data['data'], 'Success');
             this.isCoaApproved = true;
            this.redirectToExperiments();
          });
        } 
      },
        (err: HttpErrorResponse) => {
        let errorMessage =
          typeof err.error === 'string'
            ? err.error
            : err?.error?.message || err?.message || 'Something went wrong. Please try again.';

        if (err.status === 403) {
          errorMessage = 'Your account has been locked due to multiple failed login attempts.';
          this.toastr.error(errorMessage, 'Account Locked');
          this.route.navigate(['']); 
        }

        this.reviewPwdErrorMessage = errorMessage;
      }
    );
  } else {
    this.userValidateForm.get('userName')?.markAsDirty();
    this.userValidateForm.get('password')?.markAsDirty();
  }
}

downloadCoaPdf(experimentId: number) {
  this.experimentService.downloadCoaPdf(experimentId).subscribe(
    (response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = 'COA_GENERATION_FORM.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    },
    (error) => {
      this.toastr.error('Failed to download COA PDF', 'Error');
    }
  );
}
  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }

}
