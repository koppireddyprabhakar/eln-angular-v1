import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  
  userDetails: any;


  constructor(private http: HttpClient,clientService: ClientService,
    private toastr: ToastrService, private router:Router,private authService: AuthService) { }



   login(request: { mailId: string; password: string }): Observable<any> {
  const url = elnEndpointsConfig.endpoints['login'];
  return this.http.post(url, request, { withCredentials: true }).pipe(
    tap((res: any) => {
      if (res.token && res.refreshToken) {
        this.authService.saveTokens(res.token, res.refreshToken);
      }
      if (res.user) {
        this.setUserDetails(res.user);
      }
    })
  );
}

logout(): Observable<string> {
  const url = elnEndpointsConfig.endpoints['logout'];
  const token = this.getAccessToken();
  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
return this.http.post(url, {}, { headers, responseType: 'text' as 'text' });
}

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (error.status === 401) { // Handle unauthorized errors specifically
      this.toastr.error(errorDetail.errorMessage || 'Invalid credentials', 'Error');
    } else {
      this.toastr.error('An unexpected error occurred.', 'Error');
    }
    return throwError(error);
  }

  getUserDetails(): any {
  if (this.userDetails) {
    return this.userDetails;
  }
  const storedUser = sessionStorage.getItem('userDetails'); 
  if (storedUser) {
    try {
      this.userDetails = JSON.parse(storedUser);
      return this.userDetails;
    } catch (e) {
      console.error('Error parsing userDetails from localStorage', e);
      this.clearUserDetails();
      return null;
    }
  }
  return null;
}

setUserDetails(user: any) {
  this.userDetails = user;
  sessionStorage.setItem('userDetails', JSON.stringify(user))
}

setTokens(accessToken: string, refreshToken: string) {
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('refreshToken', refreshToken);
}

getAccessToken(): string | null {
  return sessionStorage.getItem('accessToken');
}


getRefreshToken(): string | null {
  return sessionStorage.getItem('refreshToken');
}


clearUserDetails() {
  this.userDetails = null;
sessionStorage.removeItem('userDetails');  
sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
 }
}
  

