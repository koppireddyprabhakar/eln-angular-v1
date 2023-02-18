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
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeWhile } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  users: any = [];
  selectedUser: any = {};
  subscribeFlag = true;
  showAddForm = false;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

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
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
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
        }));
        this.users = usersList;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.users);
        });
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
    this.selectedUser = { ...this.selectedUser, status: 'Inactive' };
    this.userService
      .deleteUser(this.selectedUser)
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
