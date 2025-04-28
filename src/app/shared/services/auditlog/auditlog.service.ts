import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditlogService {
  baseUrl: any;

  constructor( private readonly http: HttpClient,) { }

  getAuditLogs() {
      const url = elnEndpointsConfig.endpoints['getAuditLogs'];
      return this.http
        .get<any>(url)
        .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    }

  handleError(err: HttpErrorResponse): any {
    throw new Error('Method not implemented.');
  }
  
}
