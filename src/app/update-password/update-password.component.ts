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
  isSubmitted: boolean = false;
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
      'newpassword': [
        '',
        [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ]
      ],      
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

passwordsMatch(formGroup: FormGroup) {
  const newpassword = formGroup.get('newpassword')?.value;
  const confirmpassword = formGroup.get('confirmpassword')?.value;
  return newpassword === confirmpassword ? null : { notSame: true };
  }
   
  onSubmit(){
    this.isSubmitted = true;
    const request = {
      mailId: this.username,
      password: this.newpassword
    };
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
            'error'
          );
        }
      })  
    }
    else{
      this.toastr.error(
        ' Password mismatch',
        'error'
      );
    }
  }
}
function Space(event: JQuery.EventExtensions, any: any) {
  throw new Error('Function not implemented.');
}

