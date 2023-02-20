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
   return this.http.post<{ firstLogin: boolean }>(url,request);
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    console.log(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      this.toastr.error(errorDetail.errorMessage, errorDetail.title);
    }
    return throwError(error);
  }

  validateUserSession() {
    if(!this.userDetails) {
      this.router.navigate['/login'];
      return false;
    } else {
      return true;
    }
  }

}
  

