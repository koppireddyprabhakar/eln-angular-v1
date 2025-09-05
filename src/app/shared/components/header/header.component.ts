import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document, private loginService: LoginserviceService, private router: Router) {}
  
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
    this.loginService.logout().subscribe({
    next: () => {
      this.loginService.clearUserDetails();  // clear frontend sessionStorage
      this.router.navigate(['/']);           // navigate to login page
    },
    error: (err) => {
      console.error('Logout failed', err);
    }
  });
}


  sidebarToggle() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }
}
