import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '@app/shared/services/department/department.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { TeamService } from '@app/shared/services/team/team.service';
import { UserRoleService } from '@app/shared/services/user-role/user-role.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeWhile } from 'rxjs';
import { Departments, Teams, UserRoles } from '../user.interface';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { departmentMapping } from 'src/app/shared/constants/mappings'; 


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  genderList = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
  ];
  departmentList: Departments[] = [];
  userRoles: UserRoles[] = [];
  selectedUser: any = {};
  subscribeFlag = true;
  dosages: any = [];
  teams: Teams[] = [];
  userId: number;
  users: any = [];
  editForm = false;
  userForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    dateOfBirth: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    deptId: ['', [Validators.required]],
    dosageId: [''],
    // roleId: ['', [Validators.required]],
    roleId: new FormControl<number | null>(null, Validators.required),
    contactNo: ['', [Validators.required]],
    mailId: ['', [Validators.email, Validators.required]],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    zipCode: [''],
    teamId: ['', [Validators.required]],
    certifiedReviewer: false,
    coaPermission: false,
    accountLocked: false

  });
  public showErrorMsg: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly departmentService: DepartmentService,
    private readonly userRoleService: UserRoleService,
    private readonly teamsService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private dosageService: DosageService,
    private loginService: LoginserviceService

  ) { }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.queryParams['userId'];
    if (this.userId) {
      this.getUserById();
      this.editForm = true;
    }
    this.getDepartments();
    this.getUserRoles();
    this.getTeams();
    this.getDosages();
    this.getUsers();
  }

  saveUser() {
    let formMailId = this.userForm['controls'] && this.userForm['controls']['mailId'].value ? this.userForm['controls']['mailId'].value : '';

    let isObjectExists = this.users.find(user =>
      user.mailId === formMailId && user.userId !== this.userId
    );

    if (isObjectExists && (Object.keys(this.selectedUser).length === 0 || (this.selectedUser.mailId !== formMailId))) {
      this.showErrorMsg = true;
      return;
    }
    const dob = this.userForm.get('dateOfBirth')?.value || '';
    const newUser = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      dateOfBirth: (dob && new Date(dob)?.toISOString().split('T')[0]) || '',
      gender: this.userForm.get('gender')?.value,
      deptId: this.userForm.get('deptId')?.value,
      dosageId: this.userForm.get('dosageId')?.value,
      roleId: this.userForm.get('roleId')?.value,
      contactNo: this.userForm.get('contactNo')?.value?.toString(),
      mailId: this.userForm.get('mailId')?.value,
      addressLine1: this.userForm.get('addressLine1')?.value,
      addressLine2: this.userForm.get('addressLine2')?.value,
      city: this.userForm.get('city')?.value,
      zipCode: this.userForm.get('zipCode')?.value,
      userTeams: [{ teamId: this.userForm.get('teamId')?.value, userId: this.userId ? this.userId : null }],
      certifiedReviewer: this.userForm.get('certifiedReviewer')?.value,
      coaPermission: this.userForm.get('coaPermission')?.value,
      accountLocked: this.userForm.get('accountLocked')?.value,
    };
    if (!this.userForm.invalid) {
      this.globalService.showLoader();
      if (Object.keys(this.selectedUser).length === 0) {
        this.userService
          .saveUser(newUser)
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.toastr.success('User has been created succesfully', 'Success');
            this.route.navigate(['/business-admin/users/']);
          });
      } else {
        this.selectedUser = [
          {
            ...this.selectedUser,
            ...newUser,
          },
        ];
        this.userService
          .updateUser(this.selectedUser[0])
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.route.navigate(['/business-admin/users/']);
            this.toastr.success('User has been updated succesfully', 'Success');
            this.editForm = false;
          });
      }
    } else {
      this.userForm.get('firstName')?.markAsDirty();
      this.userForm.get('dateOfBirth')?.markAsDirty();
      this.userForm.get('gender')?.markAsDirty();
      this.userForm.get('deptId')?.markAsDirty();
      // this.userForm.get('dosageId')?.markAsDirty();
      this.userForm.get('roleId')?.markAsDirty();
      this.userForm.get('contactNo')?.markAsDirty();
      this.userForm.get('mailId')?.markAsDirty();
      this.userForm.get('teamId')?.markAsDirty();
    }
  }

  redirectToUsers() {
    this.route.navigate(['/business-admin/users/']);
  }

  getDosages() {
    this.dosageService.getDosages().subscribe((dosages) => {
      this.dosages = dosages;
    });
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe((department) => {
      this.departmentList = department;
    });
  }
  /*
    getUserRoles() {
      this.userRoleService.getUserRoles().subscribe((userRoles) => {
        this.userRoles = userRoles;
      });
    }
  */

  getUserRoles() {
    this.globalService.showLoader();
    // Use the login service's userDetails (make sure it's populated)
    const loggedInUser = this.loginService.userDetails;
    this.userRoleService.getUserRoles().subscribe((roles) => {
      if (loggedInUser && loggedInUser.roleId !== 5) {
        // If the logged-in user is NOT SuperAdmin, filter out the SuperAdmin role (assuming roleId 5)
        this.userRoles = roles.filter(role => role.roleId !== 5);
      } else {
        // If the user is a SuperAdmin or no user is available, show all roles
        this.userRoles = roles;
      }
      this.globalService.hideLoader();
    }, err => {
      this.globalService.hideLoader();
      console.error('Error fetching roles:', err);
    });
  }

  getTeams() {
    this.teamsService.getTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  getUsers(){
    this.userService.getUsers().subscribe((users) => {
    this.users=users
    });
  }

  getUserById() {
    this.globalService.showLoader();
    this.userService
      .getUserById(this.userId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((selectedUser) => {
        this.globalService.hideLoader();
        this.selectedUser = selectedUser;
        this.userForm.patchValue({
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          dateOfBirth: selectedUser.dateOfBirth,
          gender: selectedUser.gender,
          deptId: selectedUser.deptId,
          roleId: selectedUser.roleId,
          contactNo: selectedUser.contactNo,
          mailId: selectedUser.mailId,
          addressLine1: selectedUser.addressLine1,
          addressLine2: selectedUser.addressLine2,
          city: selectedUser.city,
          zipCode: selectedUser.zipCode,
          teamId: selectedUser.teamId,
          certifiedReviewer: selectedUser.certifiedReviewer,
          coaPermission: selectedUser.coaPermission,
          accountLocked: selectedUser.accountLocked,
        });
      });
  }

  depChange() {
    const values = Object.values(this.teams);
    const team: any = values.filter(
      (prod) => prod.deptId === Number(this.userForm.get('deptId')?.value)
    )[0];
    this.teams = team;
  }

  assignAdminRoleIfNeeded(): void {
    const deptControl = this.userForm.get('deptId');
    const roleControl = this.userForm.get('roleId');
    if (!deptControl || !roleControl) {
      console.warn('Form controls missing: deptId or roleId');
      return;
    }
    const selectedDeptId = deptControl.value;
    // Check for null or undefined deptId
    if (selectedDeptId == null) {
      roleControl.setValue(null); 
      return;
    }
    const selectedDeptName = departmentMapping[+selectedDeptId];
    if (selectedDeptName === 'ADMIN MANAGEMENT') {
      roleControl.setValue(4); 
    } else {
      roleControl.setValue(null);
    }
  }


  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
