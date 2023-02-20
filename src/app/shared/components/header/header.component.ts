import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LoginserviceService } from '@app/shared/services/login/loginservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document, private loginService: LoginserviceService) {}

  userName: string = '';

  ngOnInit(): void {
    this.userName = this.loginService.userDetails ? (this.loginService.userDetails['firstName'] + ' ' + this.loginService.userDetails['lastName']) : '';
  }

  sidebarToggle() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }
}
