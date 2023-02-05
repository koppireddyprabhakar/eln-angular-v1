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
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  tests: any = [];
  selectedTest: any = {};
  subscribeFlag = true;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  showAddForm = false;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

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
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
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
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.tests);
        });
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
