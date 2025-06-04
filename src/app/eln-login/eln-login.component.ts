
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '@app/shared/services/user/user.service';
import { roleMapping } from '@app/shared/constants/mappings';
import { departmentMapping } from '@app/shared/constants/mappings';

@Component({
  selector: 'app-eln-login',
  templateUrl: './eln-login.component.html',
  styleUrls: ['./eln-login.component.css']
})
export class ElnLoginComponent implements OnInit {
 
  loginForm:FormGroup;
  username: string;
  password: string;
  authError: string;
  showPassword: boolean = false;
  isSubmitted: boolean = false;

  constructor(private formBuilder:FormBuilder,private route:Router,
    private loginService:LoginserviceService,private toastr: ToastrService, private userService: UserService) { 
  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      'Username': ['', [Validators.required]],
      'Password': ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
onSubmit() {
  this.isSubmitted = true;

  if (this.loginForm.valid) {
    const request = {
      mailId: this.username,
      password: this.password,
    };

    this.loginService.login(request).subscribe(
      (data) => {
        if (data.passwordExpired) {
          this.toastr.error(data.passwordExpiryWarning, 'Password Expired');
          this.route.navigate(['/app-update-password'], {
            queryParams: { email: this.username },
          });
        } else if (data.firstLogin == 1) {
          this.route.navigate(['/app-update-password'], {
            queryParams: { email: this.username },
          });
        } else {
          this.loginService.userDetails = data;
          this.getUserRoleAndDepartment(this.loginService.userDetails);
          this.route.navigate(['/dashboard']).then(() => {
            if (data.passwordExpiryWarning) {
              this.toastr.warning(data.passwordExpiryWarning, 'Password Expiry Warning');
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        const errorMsg = error?.error;

        if (typeof errorMsg === 'string') {
          this.toastr.error(errorMsg, 'Error');
        } else if (errorMsg && errorMsg.error) {
          const errorTitle = errorMsg.error.toLowerCase().includes('license') ? 'License Expired' : 'Error';
          this.toastr.error(errorMsg.error, errorTitle);
        } else {
          this.toastr.error('Something went wrong. Please try again later.', 'Error');
        }
      }
    );
  }
}


  getUserRoleAndDepartment(userDetails:any) {
    if(userDetails) {
      this.userService.userRole = roleMapping[userDetails['roleId']];
      this.userService.userDepartment = departmentMapping[userDetails['deptId']]
    }
  }

 }

