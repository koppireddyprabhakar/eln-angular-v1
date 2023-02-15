import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ForgetServiceService } from '@app/shared/services/forgotPassword/forgot-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {

 forgetForm:FormGroup
 username: string;

  constructor(private route:Router,
    private formBuilder:FormBuilder,
  //  private activatedRoute:ActivatedRoute,
    private forgetServiceService:ForgetServiceService,
    private toastr: ToastrService) { 
   
  }
  ngOnInit(): void {
      this.forgetForm = this.formBuilder.group({
      'username': ['', [Validators.required]]
    });
  }
  onSubmit(){
  
    const request = {
      mailId: this.username
    };
    this.forgetServiceService.validMail(request).subscribe(
    (response) => {
    //debugger;
   if(response.status === 200) {
    this.toastr.success(
      ' OTP has been sent succesfully',
      'Success'
    );
      this.route.navigate(['/app-otp-verification'],{
      queryParams:{email:this.username}
     });
    } 
   },
   (error) => {
    this.toastr.error(
      'Please enter valid MailId',
      'Error');
    });
  }
}