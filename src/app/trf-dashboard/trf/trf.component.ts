import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TrfService } from '@app/shared/services/test-request-form/trf.service';
import { finalize, takeWhile } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';
@Component({
  selector: 'app-trf',
  templateUrl: './trf.component.html',
  styleUrls: ['./trf.component.css'],
})
export class TrfComponent implements OnInit {
  @Input() hideMain = false;
  public testRequest: any = {};
  private subscribeFlag: boolean = true;
  public dosagesList: Dosages[] = [];

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
  // public testRequestRow: FormArray;

  constructor(
    private globalService: GlobalService,
    private formBuilder: FormBuilder,
    private route: Router,
    private trfService: TrfService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  redirectToUsers() {
    this.route.navigate(['/business-admin/users/']);
  }

  saveTestRequestForm() {
    const manDate = this.testRequestForm.get('manufacturingDate')?.value || '';
    const expiryDate = this.testRequestForm.get('expiryDate')?.value || '';

    const newTestRequest = {
      testRequestId: this.testRequestForm.get('testRequestId')?.value,
      department: this.testRequestForm.get('department')?.value,
      dosageForm: this.testRequestForm.get('dosageForm')?.value,
      projectName: this.testRequestForm.get('projectName')?.value,
      projectCode: this.testRequestForm.get('projectCode')?.value,
      strength: this.testRequestForm.get('strength')?.value,
      batchNumber: this.testRequestForm.get('batchNumber')?.value,
      stage: this.testRequestForm.get('stage')?.value,
      packaging: this.testRequestForm.get('packaging')?.value,
      batchSize: this.testRequestForm.get('batchSize')?.value,
      quantity: this.testRequestForm.get('quantity')?.value,
      labelClaim: this.testRequestForm.get('labelClaim')?.value,
      manufacturingDate:
        (manDate && new Date(manDate)?.toISOString().split('T')[0]) || '',
      expiryDate:
        (expiryDate && new Date(expiryDate)?.toISOString().split('T')[0]) || '',
    };
    if (!this.testRequestForm.invalid) {
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
            this.route.navigate(['/business-admin/users/']);
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
    this.testRequestRow.push(this.addTests());
  }

  addTests(): FormGroup {
    return this.formBuilder.group({
      testId: ['', [Validators.required]],
      test: [''],
      results: [null],
    });
  }
}
