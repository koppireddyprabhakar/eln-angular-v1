import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { UpdatePasswordService } from '@app/shared/services/Update/update-password.service';
import { event } from 'jquery';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  updateForm:FormGroup;
  username:string;
  newpassword: string;
  confirmpassword: string;
   constructor(private route:Router,
    private activatedRoute:ActivatedRoute,
    private formBuilder:FormBuilder,
    private updatePasswordService:UpdatePasswordService,
    private toastr: ToastrService) { }

  ngOnInit(): void {


    this.activatedRoute.queryParams.subscribe((params)=>{
     this.username=params['email'];
     console.log(params);
     
    })

    this.updateForm = this.formBuilder.group({
      'username':[''],
      'newpassword': ['', [Validators.required]],
      'confirmpassword':['',[Validators.required]]
    });
  }

Space(event:any)
{
  if(event.target.selectionStart === 0 && event.code === "Space"){
    event.prevenDefault();
  }
}
space(event:any)
{
  if(event.charCode === 32){
    event.prevenDefault();
  }
}
  // get f(){
  //     return this.updateForm.controls;
  //   }
  onSubmit(){
    const request = {
      mailId: this.username,
      password: this.newpassword
    };
    // this.updatePasswordService.Update(request).subscribe((data)=>{
    //   if(this.confirmpassword == this.newpassword && this.confirmpassword != '' ){
    //     this.toastr.success(
    //       ' Password has been updated succesfully',
    //       'Success'
    //     );
    //     this.route.navigate(['/dashboard']);
    //   }
    //   else{
    //     this.toastr.error(
    //       ' Password mismatch',
    //       'Error');
    //   }
    // })  
    if(this.confirmpassword == this.newpassword && this.confirmpassword != '' ){
      this.updatePasswordService.Update(request).subscribe((response)=>{
        if(response.status=200)
        {
          this.route.navigate(['/dashboard']);
          this.toastr.success(
            ' Password has been updated succesfully',
            'Success'
          );
        }
        else{
          this.toastr.error(
            ' Password has been updated UNsuccesfully',
            'Success'
          );
        }
      
      })  
    //       this.toastr.success(
    //         ' Password has been updated succesfully',
    //         'Success'
    //       );
    //       this.route.navigate(['/dashboard']);
    }
    else{
      this.toastr.error(
        ' Password mismatch',
        'Success'
      );
    }

  }
}
function Space(event: JQuery.EventExtensions, any: any) {
  throw new Error('Function not implemented.');
}

