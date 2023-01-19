import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class InwardManagementService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getInwards() {
    const url = elnEndpointsConfig.endpoints['getExcipients'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveInward(inward) {
    const url = elnEndpointsConfig.endpoints['createExcipient'];
    return this.http.post<string>(url, inward);
  }

  updateInward(inward) {
    const url = elnEndpointsConfig.endpoints['updateExcipient'];
    return this.http.put<string>(url, inward);
  }

  deleteExcipient(excipientId: number) {
    const url = `${elnEndpointsConfig.endpoints['deleteExcipient']}?excipientId=${excipientId}`;
    return this.http.delete<string>(url);
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
