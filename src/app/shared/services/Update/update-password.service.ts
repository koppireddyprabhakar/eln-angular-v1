import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root'
})
export class UpdatePasswordService {

  constructor(private http: HttpClient,private toastr: ToastrService) { }

  Update(request: {mailId: string, password: string}): Observable<any> {
   // debugger
   const url = elnEndpointsConfig.endpoints['update'];
    return this.http.put(url, request);
  }
  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    console.log(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      this.toastr.error(errorDetail.errorMessage, errorDetail.title);
    }
    return throwError(error);
  }
}
