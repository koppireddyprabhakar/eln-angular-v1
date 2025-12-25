import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ControlPanelService } from '@app/shared/services/control-panel/control-panel.service';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { UserService } from '@app/shared/services/user/user.service';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { finalize,Subject, takeWhile } from 'rxjs';

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
   userLimitReached: boolean = false; // Flag for button disable
     userLimit: number = 0;


  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  constructor(
   private readonly controlPanelService:ControlPanelService,
    private readonly userService: UserService,
     private loginService: LoginserviceService ,
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
     this.getControlPanelData();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }


  changeToInt(id: any): number {
    return parseInt(id);
  }

  getUsers() {
  this.globalService.showLoader();
  const loggedInUser = this.loginService.userDetails;
  this.userService.getUsers()
    .pipe(takeWhile(() => this.subscribeFlag))
    .subscribe({
      next: (users) => {
        if (loggedInUser && loggedInUser.roleId !== 5) {
          this.users = users.filter(user => user.roleId !== 5);
        } else {
          this.users = users;
        }
        this.checkUserLimit();
        // Destroy old table instance first
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          //Then trigger the reinitialization
          this.dtTrigger.next(null);
        });
        this.globalService.hideLoader();
      },
      error: (err) => {
        this.globalService.hideLoader();
        console.error('Error fetching users:', err);
      }
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

 getControlPanelData() {
  this.globalService.showLoader();
  this.controlPanelService
    .getControlPanel()
    .pipe(
      takeWhile(() => this.subscribeFlag),
      finalize(() => this.globalService.hideLoader())
    )
    .subscribe(
      (data) => {
        this.userLimit = data.usersLimit;
        this.checkUserLimit();
      },
      (error) => {
        this.toastr.error('Failed to load control panel data', 'Error');
      }
    );
}
private checkUserLimit(): void {
  if (this.users !== undefined && this.userLimit !== undefined) {
    // Exclude SuperAdmin users when checking the limit
    const nonSuperAdminUsers = this.users.filter(user => user.roleId !== 5);
    this.userLimitReached = nonSuperAdminUsers.length >= this.userLimit;
  }
}
  ngOnDestroy(): void {
    this.subscribeFlag = false;
    this.dtTrigger.unsubscribe();
  }

  
}
