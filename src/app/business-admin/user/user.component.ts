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
import { UserService } from '@app/shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: any = [];
  selectedTest: any = {};
  subscribeFlag = true;
  columns: any;
  options: any = {};
  showAddForm = false;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly userService: UserService,
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();

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

  getUsers() {
    this.globalService.showLoader();
    this.userService
      .getUsers()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((users) => {
        const usersList = users.map((user: any) => ({
          ...user,
          status: 'str',
        }));
        this.users = usersList;
        console.log(this.users);
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
    // this.userService
    //   .deleteTest(this.selectedTest.testId)
    //   .pipe(takeWhile(() => this.subscribeFlag))
    //   .subscribe(() => {
    //     this.getTests();
    //     this.closeDeleteButton.nativeElement.click();
    //     this.toastr.success('Test has been deleted succesfully', 'Success');
    //   });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
