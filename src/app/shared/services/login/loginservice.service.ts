import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  
  userDetails: any;


  constructor(private http: HttpClient,clientService: ClientService,
    private toastr: ToastrService, private router:Router) { }


  login(request:{mailId: string, password: string}): Observable<any> {
    const url = elnEndpointsConfig.endpoints['login'];
   return this.http.post<{ firstLogin: boolean }>(url,request,{withCredentials: true });
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
  const storedUser = localStorage.getItem('userDetails');
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
  localStorage.setItem('userDetails', JSON.stringify(user));
}


clearUserDetails() {
  this.userDetails = null;
  localStorage.removeItem('userDetails');
}


}
  

