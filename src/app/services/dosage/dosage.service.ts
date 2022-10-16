import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class DosageService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getDosages() {
    const url = elnEndpointsConfig.endpoints['getDosages'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveDosage(product: { dosageName: string | null }) {
    const url = elnEndpointsConfig.endpoints['postDosage'];
    return this.http.post<string>(url, product);
  }

  updateDosage(product: { dosageName: string | null }) {
    const url = elnEndpointsConfig.endpoints['updateDosage'];
    return this.http.post<string>(url, product);
  }

  deleteDosage(productId: number) {
    const url = `${elnEndpointsConfig.endpoints['deleteDosage']}?dosageId=${productId}`;
    return this.http.get<string>(url);
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
