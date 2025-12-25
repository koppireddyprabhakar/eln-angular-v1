import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginserviceService } from '../services/login/loginservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanLoad, CanActivate {

  constructor(private loginService: LoginserviceService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validateSession();
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validateSession();
  }

private validateSession(): boolean {
  const token = this.loginService.getAccessToken();
  if (!token) {
    this.router.navigate(['']); 
    return false;
  }
  return true;
}
}
