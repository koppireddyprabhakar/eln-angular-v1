import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, map, Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class AuditlogService {
  baseUrl: any;

 constructor(
    private readonly http: HttpClient,
   
  ) { }

  getAuditLogs() {
      const url = elnEndpointsConfig.endpoints['getAuditLogs'];
      return this.http
        .get<any>(url)
        .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    }

    downloadAuditPdf(auditData: any[]): Observable<Blob> {
      const url = elnEndpointsConfig.endpoints['downloadAuditPdf'];
      return this.http.post(url, auditData, { responseType: 'blob' }).pipe(
        map(res => res as Blob),
        catchError((err: HttpErrorResponse) => this.handleError(err))
      );
    }
    
    
    

    private handleError(err: HttpErrorResponse): Observable<never> {
      // your existing error formatting
      // e.g. const detail = ClientService.formatError(err);
      return throwError(() => err);
    }
  
}
