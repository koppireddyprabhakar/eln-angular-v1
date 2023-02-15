import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root'
})
export class ForgetServiceService {

  constructor(private http: HttpClient) { }
 
  validMail(request:{mailId: string}): Observable<HttpResponse<any>> {
    const url = elnEndpointsConfig.endpoints['validMail'];
    //debugger
     return this.http.post<any>(url, request, { observe: 'response' });
    }
  
}
