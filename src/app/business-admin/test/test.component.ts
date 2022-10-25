import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { TestService } from '@app/shared/services/test/test.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject } from 'rxjs';
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
  testForm = this.formBuilder.group({
    testName: ['', [Validators.required]],
    testDescription: [''],
    dosageId: this.formBuilder.array([this.addDosages()]),
  });
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  loader = false;

  dosageId = this.testForm.get('dosageId') as FormArray;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  constructor(
    private readonly testService: TestService,
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTests();
    this.getDosages();
  }

  addDosages(): FormGroup {
    return this.formBuilder.group({
      dosageId: [null],
    });
  }

  addNewDosages() {
    this.dosageId.push(this.addDosages());
    console.log(this.dosageId);
  }

  addTest() {
    this.selectedTest = {};
    this.testForm.reset();
  }

  changeToInt(id: any): number {
    return parseInt(id);
  }

  getTests() {
    this.loader = true;
    this.testService.getTests().subscribe((tests) => {
      this.tests = [...tests];
      this.dtTrigger.next(this.tests);
      this.loader = false;
    });
  }

  getDosages() {
    this.loader = true;
    this.dosageService.getDosages().subscribe((dosages) => {
      this.dosagesList = [...dosages];
    });
  }

  saveTest() {
    const selectedDosages = this.testForm.get('dosageId')!.value;
    console.log(selectedDosages);
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
          .pipe(
            finalize(() => {
              this.toastr.success('Test has been added succesfully', 'Success');
              this.dtTrigger.unsubscribe();
              this.closeButton.nativeElement.click();
              this.getTests();
              this.loader = false;
            })
          )
          .subscribe(() => {});
      } else {
        console.log('update');
        this.selectedTest = {
          ...this.selectedTest,
          testName: this.testForm.get('testName')!.value,
        };
        console.log(this.selectedTest);
        this.testService
          .updateTest(this.selectedTest)
          .pipe(
            finalize(() => {
              this.toastr.success(
                'Test has been updated succesfully',
                'Success'
              );
              this.dtTrigger.unsubscribe();
              this.closeButton.nativeElement.click();
              this.getTests();
              this.loader = false;
            })
          )
          .subscribe(() => {});
      }
    } else {
      this.testForm.get('testName')?.markAsDirty();
    }
  }

  selectTest(test: any) {
    console.log(test);
    this.selectedTest = test;
    this.testForm.patchValue({ testName: test.testName });
  }

  confirmTesttDeletetion(test: any) {
    this.selectedTest = test;
  }

  deleteTest() {
    this.testService
      .deleteTest(this.selectedTest.testId)
      .pipe(
        finalize(() => {
          this.toastr.success('Test has been deleted succesfully', 'Success');
          this.dtTrigger.unsubscribe();
          this.closeDeleteButton.nativeElement.click();
          this.getTests();
          this.loader = false;
        })
      )
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
