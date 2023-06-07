import { Component, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GlobalService } from './shared/services/global/global.service';

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
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = '../assets/js/main.js';
    this.elementRef.nativeElement.appendChild(s);
    this._router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url: string = event.urlAfterRedirects.split('?')[0];
        const routeUrls: Array<string> = ['', '/', '/app-forget', '/app-update-password', '/app-otp-verification'];
        this.hideHeaderAndSideBar = routeUrls.includes(url);
      }
    });
  }

  isLoadingEnabled() {
    return this.globalService.loading;
  }
}
