import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TrfService } from '@app/shared/services/test-request-form/trf.service';
import { finalize, takeWhile } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';
import { TestService } from '@app/shared/services/test/test.service';
import { FormulationsService } from '@app/shared/services/formulations/formulations.service';

@Component({
  selector: 'app-add-trf',
  templateUrl: './add-trf.component.html',
  styleUrls: ['./add-trf.component.scss'],
})
export class AddTrfComponent implements OnInit {
  public testRequest: any = {};
  private subscribeFlag: boolean = true;
  public dosagesList: Dosages[] = [];

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
    testRequestId: ['', [Validators.required]],
    department: ['', [Validators.required]],
    dosageForm: ['', [Validators.required]],
    projectName: ['', [Validators.required]],
    projectCode: ['', [Validators.required]],
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
    private formulationService: FormulationsService
  ) {}

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
      { key: 'testRequestId', title: 'Test Id' },
      { key: 'testName', title: 'Test Name' },
    ];
    console.log(this.testRequestForm);
    this.getExperimentDetails();
    this.getTests();
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
        console.log(this.experiment);
        this.testRequestForm.patchValue({
          batchNumber: this.experiment.batchNumber,
          dosageForm: this.experiment.dosageName,
          projectName: this.experiment.projectName,
          strength: this.experiment.strength,
          batchSize: this.experiment.batchSize,
          testRequestId: this.staticTrfId,
        });
        // this.globalService.hideLoader();
      });
  }

  redirectToUsers() {
    this.route.navigate(['/business-admin/users/']);
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
    console.log(event);
    console.log(index);
    this.tableData[index]['result'] = event.target.value;
    console.log(this.tableData);
  }

  onItemSelect(item: any) {
    console.log(item);
    const tableData = this.tableData;
    const newItem = this.tests.filter((test) => test.testId === item.testId)[0];
    tableData.push(newItem);
    this.tableData = this.tableData.map((test, index) => ({
      ...test,
      testRequestId: `${this.staticTrfId}-A${index}`,
    }));

    console.log(this.tableData);
  }
  deselect(item: any) {
    console.log(item);
    this.tableData = this.tableData.filter(
      (data) => data.testId !== item.testId
    );
    console.log(this.tableData);
    this.tableData = this.tableData.map((test, index) => ({
      ...test,
      testRequestId: `${this.staticTrfId}-A${index}`,
    }));
  }
  onSelectAll(items: any) {
    console.log(items);
    this.tableData = this.tests;
  }

  saveTestRequestForm() {
    const manDate = this.testRequestForm.get('manufacturingDate')?.value || '';
    const expiryDate = this.testRequestForm.get('expiryDate')?.value || '';

    const newTestRequest = {
      status: 'string',
      expId: Number(this.expId),
      testRequestFormStatus: 'string',
      condition: this.testRequestForm.get('condition')?.value || '',
      stage: this.testRequestForm.get('stage')?.value || '',
      packaging: this.testRequestForm.get('packaging')?.value || '',
      labelClaim: this.testRequestForm.get('labelClaim')?.value || '',
      quantity: this.testRequestForm.get('quantity')?.value || 0,
      manufacturingDate: manDate,
      expireDate: expiryDate,
      testId: this.testRequestForm.get('testRequestId')?.value || '',
      testName: '',
      testNumber: '',
      testResult: '',
      testStatus: 'string',
      trfTestResults: this.testRequestRow.value,
    };
    console.log(newTestRequest);
    console.log(this.testRequestForm);
    console.log(this.tableData);
    // if (!this.testRequestForm.invalid) {
    //   console.log(newTestRequest);
    //   this.globalService.showLoader();
    //   if (Object.keys(this.testRequest).length === 0) {
    //     this.trfService
    //       .createTestRequestForm(newTestRequest)
    //       .pipe(
    //         takeWhile(() => this.subscribeFlag),
    //         finalize(() => {
    //           this.globalService.hideLoader();
    //         })
    //       )
    //       .subscribe(() => {
    //         this.toastr.success('Test has been added succesfully', 'Success');
    //         this.route.navigate(['/forms-page/new-formulation']);
    //       });
    //   } else {
    //     // this.testRequest = [
    //     //   {
    //     //     ...this.testRequest,
    //     //     ...newTestRequest,
    //     //   },
    //     // ];
    //     // this.trfService
    //     //   .updateTestRequestForm(this.testRequest[0])
    //     //   .pipe(
    //     //     takeWhile(() => this.subscribeFlag),
    //     //     finalize(() => {
    //     //       this.globalService.hideLoader();
    //     //     })
    //     //   )
    //     //   .subscribe(() => {
    //     //     this.route.navigate(['/business-admin/users/']);
    //     //     this.toastr.success('Test has been updated succesfully', 'Success');
    //     //     // this.editForm = false;
    //     //   });
    //   }
    // } else {
    //   this.testRequestForm.get('testRequestId')?.markAsDirty();
    //   this.testRequestForm.get('department')?.markAsDirty();
    //   this.testRequestForm.get('dosageForm')?.markAsDirty();
    //   this.testRequestForm.get('expiryDate')?.markAsDirty();
    //   this.testRequestForm.get('manufacturingDate')?.markAsDirty();
    //   this.testRequestForm.get('labelClaim')?.markAsDirty();
    //   this.testRequestForm.get('quantity')?.markAsDirty();
    //   this.testRequestForm.get('batchSize')?.markAsDirty();
    //   this.testRequestForm.get('packaging')?.markAsDirty();
    //   this.testRequestForm.get('stage')?.markAsDirty();
    //   this.testRequestForm.get('batchNumber')?.markAsDirty();
    //   this.testRequestForm.get('projectName')?.markAsDirty();
    //   this.testRequestForm.get('strength')?.markAsDirty();
    //   this.testRequestForm.get('projectCode')?.markAsDirty();
    //   this.testRequestForm.get('condition')?.markAsDirty();
    // }
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }

  addNewTest() {
    console.log(this.testId);
    this.testId = this.testId === 0 ? this.testId + 1 : this.testId;
    this.testRequestRow.push(this.addTests());
  }

  addTests(): FormGroup {
    this.testId = this.testId ? this.testId + 1 : 1;
    console.log(this.testId);
    return this.formBuilder.group({
      testId: [this.testId, [Validators.required]],
      testNumber: ['string'],
      testStatus: ['string'],
      testName: [''],
      testResult: [null],
    });
  }
}
