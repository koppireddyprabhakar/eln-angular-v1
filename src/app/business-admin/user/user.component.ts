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
  selectedUser: any = {};
  subscribeFlag = true;
  columns: any;
  options: any = {};
  showAddForm = false;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;
  @ViewChild('nameTpl', { static: true }) nameTpl: TemplateRef<any>;

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
      {
        key: 'name',
        title: '<div class="blue">Name</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        cellTemplate: this.nameTpl,
      },
      { key: 'dateOfBirth', title: 'DOB' },
      { key: 'gender', title: 'Gender' },
      { key: 'roleName', title: 'Role Name' },
      { key: 'departmentName', title: 'Department Name' },
      { key: 'contactNo', title: 'Contact Number' },
      { key: 'mailId', title: 'Mail Id' },
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

  selectUser(user: any) {
    this.route.navigateByUrl(
      `/business-admin/users/add-user?userId=${user.userId}`
    );
  }

  confirmUserDeletetion(user: any) {
    this.selectedUser = user;
  }

  deleteUser() {
    this.userService
      .deleteUser(this.selectedUser.userId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe(() => {
        this.getUsers();
        this.closeDeleteButton.nativeElement.click();
        this.toastr.success('User has been deleted succesfully', 'Success');
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
