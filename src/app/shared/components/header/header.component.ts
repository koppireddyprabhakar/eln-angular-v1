import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  router: any;
  constructor(@Inject(DOCUMENT) private document: Document, private loginService: LoginserviceService) {}

  userName: string = '';




ngOnInit(): void {
  const userDetails = this.loginService.getUserDetails();
  if (userDetails) {
    this.userName = (userDetails.firstName || '') + ' ' + (userDetails.lastName || '');
  } else {
    this.userName = '';
  }
}

logout() {
  this.loginService.clearUserDetails();
  this.router.navigate(['/']);  // navigate to login page or home
}


  sidebarToggle() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }
}
