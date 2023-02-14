import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OtpServiceService {

  constructor(private http: HttpClient) { }

  verifyOtp(request:{mailId:string,otp:string}): Observable<HttpResponse<any>> {
   // debugger
   const url = elnEndpointsConfig.endpoints['verifyOtp'];
    return this.http.post<any>(url,request, { observe: 'response' });
  }

  ResendOtp(request:{mailId:string}): Observable<HttpResponse<any>> {
  //  debugger
  const url = elnEndpointsConfig.endpoints['validMail'];
    return this.http.post<any>(url,request, { observe: 'response' });
  }
}

