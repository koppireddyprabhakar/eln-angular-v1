import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { OtpServiceService } from '@app/shared/services/Otp/otp-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {
  username:string;
  Otp:string;
  OtpForm:FormGroup;
  forgetServiceService: any;
  resendOtpButtonDisabled: boolean;

  constructor(private formBuilder:FormBuilder,
    private activatedRoute:ActivatedRoute,
    private route:Router,
    private otpServiceService:OtpServiceService, 
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params)=>{
     this.username=params['email'];
     console.log(params);
    })

    this.OtpForm = this.formBuilder.group({
      'Username': ['', [Validators.required]],
      'Otp': ['', [Validators.required]]
    });
  }
   
    onSubmit() {
      const request = {
        mailId: this.username,
        otp:this.Otp
      };
        this.otpServiceService.verifyOtp(request) .subscribe(
           (response) => {
           console.log(response);
        if(response.status == 200 ) {
            this.route.navigate(['/app-update-password'],{
            queryParams:{email:this.username}
           });
         } 
        },
        (error) => {
          this.toastr.error(
            'Incorrect OTP or expired',
            'Error');
         });
     }
     ResendOtp(){
        this.otpServiceService.ResendOtp({mailId: this.username})
        .subscribe(
        (response) => {
         console.log(response);
         if (response.status == 200 ) {
          this.toastr.success(
            ' OTP has been sent succesfully',
            'Success');
          } 
         },
        (error) => {
        
         }); 
       }
      }