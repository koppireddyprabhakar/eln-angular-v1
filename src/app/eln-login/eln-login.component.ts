
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
 
onSubmit(){
  this.isSubmitted = true;

    if (this.loginForm.valid) {
      const request = {
        mailId: this.username,
        password: this.password,
      };
  this.loginService.login(request).subscribe((data) =>{ 
     if(data.firstLogin==1)
     {
      this.route.navigate(['/app-update-password'],{
        queryParams:{email:this.username}
      });
     }
     else
     {
      // Storing user details in global service
      this.loginService.userDetails = data;
      this.getUserRoleAndDepartment(this.loginService.userDetails);
      this.route.navigate(['/dashboard']);
     }
  },
  (error: HttpErrorResponse) => {
     this.toastr.error('Invalid credentials', 'Error');
     });
  }
 }

  getUserRoleAndDepartment(userDetails:any) {
    if(userDetails) {
      this.userService.userRole = roleMapping[userDetails['roleId']];
      this.userService.userDepartment = departmentMapping[userDetails['deptId']]
    }
  }

 }

