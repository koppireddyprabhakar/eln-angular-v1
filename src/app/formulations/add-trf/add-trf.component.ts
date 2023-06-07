import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TrfService } from '@app/shared/services/test-request-form/trf.service';
import { Subject, finalize, takeWhile } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { TestService } from '@app/shared/services/test/test.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';
import { DataTableDirective } from 'angular-datatables';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';

@Component({
  selector: 'app-add-trf',
  templateUrl: './add-trf.component.html',
  styleUrls: ['./add-trf.component.scss'],
})
export class AddTrfComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  purposeList = [
    { label: 'Informative', value: 'Informative' },
    { label: 'Release', value: 'Release' },
  ];

  public testRequest: any = {};
  private subscribeFlag: boolean = true;
  public dosagesList: Dosages[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  saveClicked = false;
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

  testRequestForm = this.formBuilder.group({
    selectedTests: [[''], Validators.required],
    testRequestId: ['', [Validators.required]],
    department: ['', [Validators.required]],
    dosageForm: ['', [Validators.required]],
    projectName: ['', [Validators.required]],
    productCode: ['', [Validators.required]],
    strength: ['', [Validators.required]],
    batchNumber: ['', [Validators.required]],
    condition: ['', [Validators.required]],
    stage: ['', [Validators.required]],
    packaging: ['', [Validators.required]],
    batchSize: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    labelClaim: ['', [Validators.required]],
    manufacturingDate: ['', [Validators.required]],
    expiryDate: ['', [Validators.required]],
    testRequestRow: this.formBuilder.array([this.addTests()]),
    purpose: ['', [Validators.required]]
  });

  testRequestRow = this.testRequestForm.get('testRequestRow') as FormArray;
  testId = 0;

  // public testRequestRow: FormArray;

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private route: Router,
    private trfService: TrfService,
    private toastr: ToastrService,
    private readonly experimentService: ExperimentService,
    private readonly testService: TestService,
    private activatedRoute: ActivatedRoute,
    private formulationService: FormulationsService,
    private loginservice:LoginserviceService
  ) { }

  ngOnInit(): void {
    this.expId = this.activatedRoute.snapshot.queryParams['expId'];
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
    ];
    if (this.expId) {
      this.getExperimentDetails();
    }

    this.getTests();
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
        this.testRequestForm.patchValue({
          batchNumber: this.experiment.batchNumber,
          dosageForm: this.experiment.dosageName,
          projectName: this.experiment.projectName,
          strength: this.experiment.strength,
          batchSize: this.experiment.batchSize,
          testRequestId: this.staticTrfId,
          department: this.experiment.departmentName,
          productCode: this.experiment.productCode,
        });
        // this.globalService.hideLoader();
      });
  }

  redirectToExperiments() {
    this.route.navigate(['/forms-page/experiments/']);
  }

  getTests() {
    this.globalService.showLoader();
    this.testService
      .getTests()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((tests) => {
        this.tests = tests;
        this.globalService.hideLoader();
      });
  }

  resultValue(event, index) {
    this.tableData[index]['result'] = event.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.tableData);
    });
  }

  onItemSelect(item: any) {
    const tableData = this.tableData;
    const newItem = this.tests.filter((test) => test.testId === item.testId)[0];
    tableData.push(newItem);
    this.tableData = this.tableData.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
      testResult: '',
    }));
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.tableData);
    });
  }
  deselect(item: any) {
    this.tableData = this.tableData.filter(
      (data) => data.testId !== item.testId
    );
    this.tableData = this.tableData.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
      testResult: '',
    }));
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.tableData);
    });
  }
  onSelectAll(items: any) {
    this.tableData = this.tests.map((test, index) => ({
      ...test,
      testStatus: 'string',
      testNumber: `${this.staticTrfId}-A${index}`,
      testResult: '',
    }));
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.tableData);
    });
  }

  saveTestRequestForm() {
    const manDate = this.testRequestForm.get('manufacturingDate')?.value || '';
    const expiryDate = this.testRequestForm.get('expiryDate')?.value || '';

    const newTestRequest = {
      status: 'string',
      expId: Number(this.expId),
      testRequestFormStatus: 'active',
      trfNumber: this.testRequestForm.get('testRequestId')?.value || '',
      condition: this.testRequestForm.get('condition')?.value || '',
      stage: this.testRequestForm.get('stage')?.value || '',
      packaging: this.testRequestForm.get('packaging')?.value || '',
      labelClaim: this.testRequestForm.get('labelClaim')?.value || '',
      quantity: this.testRequestForm.get('quantity')?.value || 0,
      purpose: this.testRequestForm.get('purpose')?.value,
      manufacturingDate: manDate,
      expireDate: expiryDate,
      trfTestResults: this.tableData,
      insertUser: this.loginservice.userDetails.userId
    };
    this.saveClicked = true;
    if (!this.testRequestForm.invalid) {
      this.globalService.showLoader();
      this.trfService
        .createTestRequestForm(newTestRequest)
        .pipe(
          takeWhile(() => this.subscribeFlag),
          finalize(() => {
            this.globalService.hideLoader();
          })
        )
        .subscribe(() => {
          this.toastr.success('Test has been added succesfully', 'Success');
          this.route.navigate(['/forms-page/experiments']);
        });
    } else {
      this.testRequestForm.get('testRequestId')?.markAsDirty();
      this.testRequestForm.get('department')?.markAsDirty();
      this.testRequestForm.get('dosageForm')?.markAsDirty();
      this.testRequestForm.get('expiryDate')?.markAsDirty();
      this.testRequestForm.get('manufacturingDate')?.markAsDirty();
      this.testRequestForm.get('labelClaim')?.markAsDirty();
      this.testRequestForm.get('quantity')?.markAsDirty();
      this.testRequestForm.get('batchSize')?.markAsDirty();
      this.testRequestForm.get('packaging')?.markAsDirty();
      this.testRequestForm.get('stage')?.markAsDirty();
      this.testRequestForm.get('batchNumber')?.markAsDirty();
      this.testRequestForm.get('projectName')?.markAsDirty();
      this.testRequestForm.get('strength')?.markAsDirty();
      this.testRequestForm.get('productCode')?.markAsDirty();
      this.testRequestForm.get('condition')?.markAsDirty();
      this.testRequestForm.get('purpose')?.markAsDirty();
    }
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }

  addNewTest() {
    this.testId = this.testId === 0 ? this.testId + 1 : this.testId;
    this.testRequestRow.push(this.addTests());
  }

  addTests(): FormGroup {
    this.testId = this.testId ? this.testId + 1 : 1;
    return this.formBuilder.group({
      testId: [this.testId, [Validators.required]],
      testNumber: ['string'],
      testStatus: ['string'],
      testName: [''],
      testResult: [null],
    });
  }
}
