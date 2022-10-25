import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './shared/services/global/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'eln-angular-v1';

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
  }

  isLoadingEnabled() {
    return this.globalService.loading;
  }
}
