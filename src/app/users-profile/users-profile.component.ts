import { Component, OnInit } from '@angular/core';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';
import { UserService } from '@app/shared/services/user/user.service';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UsersProfileComponent implements OnInit {

  userDetails:any;
  userRole:string ='';
  userDepartment:string = '';

  constructor(private loginService:LoginserviceService, private userService:UserService) { }

  ngOnInit(): void {
    this.userDetails = this.loginService.userDetails;
    this.userRole = this.userService.userRole;
    this.userDepartment = this.userService.userDepartment;
  }

}
