import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginserviceService } from '../services/login/loginservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanLoad {
  constructor(private loginService: LoginserviceService) {}
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loginService.validateUserSession();
    //return true;
  }

}
