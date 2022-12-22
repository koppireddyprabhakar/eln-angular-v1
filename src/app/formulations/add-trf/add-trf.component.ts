import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TrfService } from '@app/shared/services/test-request-form/trf.service';
import { finalize, takeWhile } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';
import { ExperimentService } from '@app/shared/services/experiment/experiment.service';

@Component({
  selector: 'app-add-trf',
  templateUrl: './add-trf.component.html',
  styleUrls: ['./add-trf.component.css'],
})
export class AddTrfComponent implements OnInit {
  public testRequest: any = {};
  private subscribeFlag: boolean = true;
  public dosagesList: Dosages[] = [];

  expId: number;
  experiment: any;

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
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.expId = this.activatedRoute.snapshot.queryParams['expId'];
    console.log(this.testRequestForm);
    this.getExperimentDetails();
  }

  getExperimentDetails() {
    this.experimentService
      .getIndvExperimentById(this.expId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((experiment) => {
        this.experiment = experiment;
        this.testRequestForm.patchValue({
          batchNumber: this.experiment.batchNumber,
        });
        this.globalService.hideLoader();
      });
  }

  redirectToUsers() {
    this.route.navigate(['/business-admin/users/']);
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
    if (!this.testRequestForm.invalid) {
      console.log(newTestRequest);
      this.globalService.showLoader();
      if (Object.keys(this.testRequest).length === 0) {
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
            this.route.navigate(['/forms-page/new-formulation']);
          });
      } else {
        // this.testRequest = [
        //   {
        //     ...this.testRequest,
        //     ...newTestRequest,
        //   },
        // ];
        // this.trfService
        //   .updateTestRequestForm(this.testRequest[0])
        //   .pipe(
        //     takeWhile(() => this.subscribeFlag),
        //     finalize(() => {
        //       this.globalService.hideLoader();
        //     })
        //   )
        //   .subscribe(() => {
        //     this.route.navigate(['/business-admin/users/']);
        //     this.toastr.success('Test has been updated succesfully', 'Success');
        //     // this.editForm = false;
        //   });
      }
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
      this.testRequestForm.get('projectCode')?.markAsDirty();
      this.testRequestForm.get('condition')?.markAsDirty();
    }
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
