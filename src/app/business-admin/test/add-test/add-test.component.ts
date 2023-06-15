import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs';

import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { TestService } from '@app/shared/services/test/test.service';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';

@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css'],
})
export class AddTestComponent implements OnInit, OnDestroy {

  dosagesList: Dosages[] = [];
  testForm = this.formBuilder.group({
    testRow: this.formBuilder.array([this.addTests()]),
  });

  editForm = false;
  subscribeFlag = true;
  testRow = this.testForm.get('testRow') as FormArray;
  testId: number;
  selectedTest: any = {};
  tests: any = [];

  constructor(
    private readonly testService: TestService,
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private loginService: LoginserviceService,
    private readonly globalService: GlobalService,

  ) { }

  ngOnInit(): void {
    this.testId = this.activatedRoute.snapshot.queryParams['testId'];
    if (this.testId) {
      this.getTestById();
      this.editForm = true;
    }
    this.getDosages();
    this.getTests();
  }

  getTests() {
    this.globalService.showLoader();
    this.testService
      .getTests()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((tests) => {
        const testList = tests.map((test: any) => ({
          ...test,
        }));
        this.tests = testList;
        this.globalService.hideLoader();
      });
  }

  closeTest() {
    this.route.navigate(['/business-admin/test/']);
  }

  getTestById() {
    this.testService
      .getTestById(this.testId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((selectedTest) => {
        this.selectedTest = selectedTest;
        this.testRow.at(0).patchValue({
          testName: this.selectedTest.testName,
          description: this.selectedTest.description,
          dosageId: this.selectedTest.dosageTest.dosageId,
        });
      });
  }

  addTests(): FormGroup {
    return this.formBuilder.group({
      testName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dosageId: ['', [Validators.required]],
    });
  }

  getDosages() {
    this.dosageService.getDosages().subscribe((dosages) => {
      this.dosagesList = [...dosages];
    });
  }

  addNewTests(): FormGroup {
    return this.formBuilder.group({
      testName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      // dosageId: [null],
      dosageId: ['', [Validators.required]]
    });
  }

  addNewTest() {
    this.testRow.push(this.addTests());
  }

  saveTest() {
    const newTests: any = this.testForm.value.testRow?.map((val: any) => ({
      testName: val.testName,
      description: val.description,
      dosageTests: [{ dosageId: val.dosageId || null }],
      insertUser: this.loginService.userDetails.userId
    }));

    const isInvalidForm = this.testForm.value.testRow?.some(
      (row) => !row.testName
    );

    if (!isInvalidForm) {
      if (!this.editForm) {

        if (this.isTestExist(newTests)) {
          return;
        }

        this.testService
          .saveTest(newTests)
          .pipe(takeWhile(() => this.subscribeFlag))
          .subscribe(() => {
            this.route.navigate(['/business-admin/test/']);
            this.toastr.success('Test has been added succesfully', 'Success');
          });
      } else {
        const existingDosage: any = this.testForm.value.testRow?.map(
          (val: any) => ({
            ...this.selectedTest,
            testName: val.testName,
            description: val.description,
            dosageTests: [{ dosageId: val.dosageId || null }],
          })
        );
        this.testService
          .updateTest(existingDosage[0])
          .pipe(takeWhile(() => this.subscribeFlag))
          .subscribe(() => {
            this.route.navigate(['/business-admin/test/']);
            this.toastr.success('Test has been updated succesfully', 'Success');
            this.editForm = false;
          });
      }
    } else {
      this.testRow.value.forEach((element, index) => {
        this.testRow.at(index).get('testName')?.markAsDirty();
        this.testRow.at(index).get('description')?.markAsDirty();
        this.testRow.at(index).get('dosageId')?.markAsDirty();
      });
    }
  }

  isTestExist(newTests) {

    for (let i = 0; i < this.tests.length; i++) {
      for (let j = 0; j < newTests.length; j++) {
        if (this.tests[i].testName === newTests[j].testName) {

          this.toastr.error('Same name -' + newTests[j].testName + '- already exist.', 'Error');

          return true;
        }
      }
    }

    return false;
  }

  deleteTest(index) {
    this.testRow.removeAt(index);
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
