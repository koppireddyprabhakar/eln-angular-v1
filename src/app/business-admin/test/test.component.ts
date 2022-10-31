import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selectedTest: any = {};
  subscribeFlag = true;
  columns: any;
  options: any = {};
  showAddForm = false;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly testService: TestService,
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getTests();

    this.columns = [
      { key: 'testName', title: 'Test Name' },
      { key: 'testTypes', title: 'Dosages' },
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

  addTests(): FormGroup {
    return this.formBuilder.group({
      testName: ['', [Validators.required]],
      description: [''],
      dosageId: [null],
    });
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
          testTypes: 'Dosage 1, Dosage 2, Dosage 3, Dosage 4, Dosage 5',
          status: 'str',
        }));
        this.tests = testList;
        console.log(this.tests);
        this.globalService.hideLoader();
      });
  }

  selectTest(test: any) {
    this.route.navigateByUrl(
      `/business-admin/test/add-test?testId=${test.testId}`
    );
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
