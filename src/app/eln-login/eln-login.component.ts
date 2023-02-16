
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

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
  constructor(private formBuilder:FormBuilder,private route:Router,
    private loginserviceService:LoginserviceService,private toastr: ToastrService) { 
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      'Username': ['', [Validators.required]],
      'Password': ['', [Validators.required]]
    });
  }
 
onSubmit(){
  const request = {
    mailId: this.username,
    password: this.password
  };
 
  this.loginserviceService.login(request).subscribe((data) =>{ 
     if(data.firstLogin==1)
     {
      this.route.navigate(['/app-update-password'],{
        queryParams:{email:this.username}
      });
     }
     else
     {
      this.route.navigate(['/dashboard']);
     }
  },
  (error: HttpErrorResponse) => {
     this.toastr.error('Invalid credentials', 'Error');
     });
    }
 }

