import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '@app/shared/services/department/department.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { InwardManagementService } from '@app/shared/services/inward-management/inward-management.service';
import { TeamService } from '@app/shared/services/team/team.service';
import { UserRoleService } from '@app/shared/services/user-role/user-role.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeWhile } from 'rxjs';
import { Departments, Teams, UserRoles } from '../user.interface';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  genderList = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  departmentList: Departments[] = [];
  userRoles: UserRoles[] = [];
  selectedUser: any = {};
  subscribeFlag = true;
  teams: Teams[] = [];
  userId: number;
  editForm = false;
  userForm = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    dateOfBirth: [''],
    gender: [''],
    deptId: [''],
    roleId: [''],
    contactNo: [''],
    mailId: ['', [Validators.email]],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    zipCode: [''],
    teamId: [''],
  });

  constructor(
    private readonly userService: UserService,
    private readonly departmentService: DepartmentService,
    private readonly userRoleService: UserRoleService,
    private readonly teamsService: TeamService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.queryParams['userId'];

    if (this.userId) {
      console.log('here');
      this.getUserById();
      this.editForm = true;
    }
    this.getDepartments();
    this.getUserRoles();
    this.getTeams();
  }

  saveUser() {
    this.globalService.showLoader();
    const dob = this.userForm.get('dateOfBirth')?.value || '';
    const newUser = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      dateOfBirth: new Date(dob).toISOString().split('T')[0],
      gender: this.userForm.get('gender')?.value,
      deptId: this.userForm.get('deptId')?.value,
      roleId: this.userForm.get('roleId')?.value,
      contactNo: this.userForm.get('contactNo')?.value?.toString(),
      mailId: this.userForm.get('mailId')?.value,
      addressLine1: this.userForm.get('addressLine1')?.value,
      addressLine2: this.userForm.get('addressLine2')?.value,
      city: this.userForm.get('city')?.value,
      zipCode: this.userForm.get('zipCode')?.value,
      userTeamRequests: [{ teamId: this.userForm.get('teamId')?.value }],
    };
    if (!this.userForm.invalid) {
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
            this.toastr.success('Test has been added succesfully', 'Success');
            this.route.navigate(['/business-admin/users/']);
          });
      } else {
        this.selectedUser = {
          ...this.selectedUser,
          ...newUser,
        };
        this.userService
          .updateUser(this.selectedUser)
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
              this.route.navigate(['/business-admin/users/']);
              this.toastr.success(
                'Test has been updated succesfully',
                'Success'
              );
              this.editForm = false;
            })
          )
          .subscribe(() => {});
      }
    } else {
      this.userForm.markAsDirty();
    }
  }

  redirectToUsers() {
    this.route.navigate(['/business-admin/users/']);
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe((department) => {
      this.departmentList = department;
    });
  }

  getUserRoles() {
    this.userRoleService.getUserRoles().subscribe((userRoles) => {
      this.userRoles = userRoles;
    });
  }

  getTeams() {
    this.teamsService.getTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  getUserById() {
    this.userService
      .getUserById(this.userId)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((selectedUser) => {
        console.log(selectedUser);
        this.selectedUser = this.selectedUser;
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
        });
      });
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
