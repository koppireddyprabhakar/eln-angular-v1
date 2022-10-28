import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TestService } from '@app/shared/services/test/test.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeWhile } from 'rxjs';
import { Dosages } from '../dosage/dosage.interface';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  tests: any = [];
  dosagesList: Dosages[] = [];
  selectedTest: any = {};
  subscribeFlag = true;
  testForm = this.formBuilder.group({
    testName: ['', [Validators.required]],
    testDescription: [''],
    dosageId: this.formBuilder.array([this.addDosages()]),
  });
  columns: any;
  options: any = {};

  dosageId = this.testForm.get('dosageId') as FormArray;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly testService: TestService,
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTests();
    this.getDosages();
    this.columns = [
      { key: 'testName', title: 'Test Name' },
      { key: 'testTypes', title: 'Insert Process' },
      { key: 'status', title: 'Status' },
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 80,
        cellTemplate: this.actionTpl,
      },
    ];
  }

  addDosages(): FormGroup {
    return this.formBuilder.group({
      dosageId: [null],
    });
  }

  addNewDosages() {
    this.dosageId.push(this.addDosages());
  }

  addTest() {
    this.selectedTest = {};
    this.testForm.reset();
  }

  changeToInt(id: any): number {
    return parseInt(id);
  }

  getTests() {
    this.globalService.showLoader();
    this.testService
      .getTests()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((tests) => {
        const testList = tests.map((test: any) => ({
          ...test,
          testTypes: 'Test 1, Test 2, Test 3, Test 4, Test 5',
          status: 'Active',
        }));
        this.tests = testList;
        console.log(this.tests);
        this.globalService.hideLoader();
      });
  }

  getDosages() {
    this.dosageService.getDosages().subscribe((dosages) => {
      this.dosagesList = [...dosages];
    });
  }

  saveTest() {
    const selectedDosages = this.testForm.get('dosageId')!.value;
    const newDosage: any = {
      testName: this.testForm.get('testName')!.value,
      dosageTestReqeustList: selectedDosages,
    };
    if (
      this.testForm.get('testName')!.value &&
      this.testForm.get('dosageId')!.value
    ) {
      if (Object.keys(this.selectedTest).length === 0) {
        console.log('create');
        this.testService
          .saveTest(newDosage)
          .pipe(takeWhile(() => this.subscribeFlag))
          .subscribe(() => {
            this.getTests();
            this.closeButton.nativeElement.click();
            this.toastr.success('Test has been added succesfully', 'Success');
          });
      } else {
        this.selectedTest = {
          ...this.selectedTest,
          testName: this.testForm.get('testName')!.value,
        };
        this.testService
          .updateTest(this.selectedTest)
          .pipe(takeWhile(() => this.subscribeFlag))
          .subscribe(() => {
            this.getTests();
            this.closeButton.nativeElement.click();
            this.toastr.success('Test has been updated succesfully', 'Success');
          });
      }
    } else {
      this.testForm.get('testName')?.markAsDirty();
    }
  }

  selectTest(test: any) {
    this.selectedTest = test;
    this.testForm.patchValue({ testName: test.testName });
  }

  confirmTesttDeletetion(test: any) {
    this.selectedTest = test;
  }

  deleteTest() {
    this.testService
      .deleteTest(this.selectedTest.testId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe(() => {
        this.getTests();
        this.closeDeleteButton.nativeElement.click();
        this.toastr.success('Test has been deleted succesfully', 'Success');
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
