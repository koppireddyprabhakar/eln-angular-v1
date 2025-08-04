import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { UpdatePasswordService } from '@app/shared/services/Update/update-password.service';
import { UserService } from '@app/shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UsersProfileComponent implements OnInit {

  userDetails: any;
  userRole: string = '';
  userDepartment: string = '';
  changePasswordForm: FormGroup;
  isSubmitted: boolean = false;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showRenewPassword: boolean = false;


  constructor(
    private loginService: LoginserviceService,
    private userService: UserService,
    private fb: FormBuilder,
    private updatePasswordService: UpdatePasswordService,
    private toastr: ToastrService,
    private route: Router
  ) { }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  ngOnInit(): void {
    this.userDetails = this.loginService.userDetails;
    this.userRole = this.userService.userRole;
    this.userDepartment = this.userService.userDepartment;

    // Initialize change password form with updated password validators
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$')
        ]
      ],
      renewPassword: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$')
        ]
      ]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  private passwordsMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const renewPassword = formGroup.get('renewPassword')?.value;

    if (newPassword && renewPassword && newPassword !== renewPassword) {
      return { notSame: true };
    }
    return null;
  }

  onChangePassword(): void {
    this.isSubmitted = true;

    if (this.changePasswordForm.invalid) {
      Object.keys(this.changePasswordForm.controls).forEach(field => {
        const control = this.changePasswordForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const { currentPassword, newPassword, renewPassword } = this.changePasswordForm.value;

    // Extra safety check — match confirm password
    if (currentPassword === newPassword) {
      this.toastr.error('New password must be different from current password', 'Error');
      return;
    }

    const request = {
      mailId: this.userDetails.mailId,
      currentPassword: currentPassword,
      password: newPassword
    };

    this.updatePasswordService.reset(request).subscribe({
      next: (response) => {
        if (response && response.data && response.data.includes('Successfully')) {
          this.toastr.success('Password has been updated successfully', 'Success');
          this.changePasswordForm.reset();
          this.isSubmitted = false;
        } else {
          this.toastr.error('Password update failed', 'Error');
        }
      },
      error: (err) => {
        console.error("Update error:", err);
        const errorMessage = typeof err.error === 'string' ? err.error : 'Something went wrong. Try again later.';
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }
}