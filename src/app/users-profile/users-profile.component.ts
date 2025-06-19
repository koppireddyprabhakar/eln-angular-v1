import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private toastr: ToastrService
  ) { }


  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleRenewPassword() {
    this.showRenewPassword = !this.showRenewPassword;
  }
  ngOnInit(): void {
    this.userDetails = this.loginService.userDetails;
    this.userRole = this.userService.userRole;
    this.userDepartment = this.userService.userDepartment;
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$')
        ]
      ],
      renewPassword: ['', Validators.required]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  private passwordsMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const renewPassword = formGroup.get('renewPassword')?.value;
    return newPassword !== renewPassword ? { notSame: true } : null;
  }

  onChangePassword(): void {
    this.isSubmitted = true;

    if (this.changePasswordForm.invalid) {
      Object.values(this.changePasswordForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const { currentPassword, newPassword } = this.changePasswordForm.value;
    const request = {
      mailId: this.userDetails.mailId,
      currentPassword,
      password: newPassword
    };

    this.updatePasswordService.resetPassword(request).subscribe({
      next: (response) => {
        const msg = response?.data || 'Something went wrong';

        // Convert to lowercase and check for success keyword
        if (msg.toLowerCase().includes('success')) {
          this.toastr.success(msg, 'Success');
          this.changePasswordForm.reset();
          this.isSubmitted = false;
        } else {
          this.toastr.error(msg, 'Error');
        }
      },
      error: (err) => {
        const errorMessage = err?.error?.data || err?.error || 'Something went wrong. Try again later.';
        this.toastr.error(errorMessage, 'Error');
        console.error("Reset error:", err);
      }
    });
  }
}