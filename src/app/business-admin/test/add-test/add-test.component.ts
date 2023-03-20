import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dosages } from '@app/business-admin/dosage/dosage.interface';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TestService } from '@app/shared/services/test/test.service';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs';

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

  constructor(
    private readonly testService: TestService,
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.testId = this.activatedRoute.snapshot.queryParams['testId'];
    if (this.testId) {
      this.getTestById();
      this.editForm = true;
    }
    this.getDosages();
  }
  closeTest(){
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
     dosageId:['', [Validators.required]]
    });
  }

  addNewTest() {
    this.testRow.push(this.addTests());
  }

  saveTest() {
    const newDosage: any = this.testForm.value.testRow?.map((val: any) => ({
      testName: val.testName,
      description: val.description,
      dosageTests: [{ dosageId: val.dosageId || null }],
    }));
    const isInvalidForm = this.testForm.value.testRow?.some(
      (row) => !row.testName
    );
    if (!isInvalidForm) {
      if (!this.editForm) {
        this.testService
          .saveTest(newDosage)
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

  deleteTest(index) {
    this.testRow.removeAt(index);
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
