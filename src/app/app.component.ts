import { Component, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GlobalService } from './shared/services/global/global.service';
import { UserService } from './shared/services/user/user.service';
import { LoginserviceService } from './shared/services/login/loginservice.service';
import { departmentMapping, roleMapping } from './shared/constants/mappings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'eln-angular-v1';
  hideHeaderAndSideBar: boolean;

  constructor(
    private elementRef: ElementRef,
    public _router: Router,
    private globalService: GlobalService,
    private  userService: UserService,
    private loginservice:LoginserviceService,

  ) {}


  ngOnInit() {
  // Get user details safely from login service
  const user = this.loginservice.getUserDetails();

  if (user) {
    // Set role & department for app-wide usage
    this.userService.userRole = roleMapping[user.roleId];
    this.userService.userDepartment = departmentMapping[user.deptId];
    this.loginservice.userDetails = user; // sync the loginService userDetails
  } else {
    this._router.navigate(['']); // redirect to login if no user found
  }
  // Append your external JS file (if needed)
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = '../assets/js/main.js';
  this.elementRef.nativeElement.appendChild(s);

  // Hide header/sidebar for specific routes
  this._router.events.subscribe((event: any) => {
    if (event instanceof NavigationEnd) {
      const url: string = event.urlAfterRedirects.split('?')[0];
      const routeUrls: string[] = ['', '/', '/app-forget', '/app-update-password', '/app-otp-verification'];
      this.hideHeaderAndSideBar = routeUrls.includes(url);
    }
  });
}

  isLoadingEnabled() {
    return this.globalService.loading;
  }
}
