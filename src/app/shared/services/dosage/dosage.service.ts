import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientService } from '@app/shared/services/client/client.service';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';

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
    return this.http.get<any>(url);
  }

  saveDosage(product: { dosageName: string | null }) {
    const url = elnEndpointsConfig.endpoints['postDosage'];
    return this.http.post<string>(url, product);
  }

  updateDosage(product: { dosageName: string | null }) {
    const url = elnEndpointsConfig.endpoints['updateDosage'];
    return this.http.put<string>(url, product);
  }

  deleteDosage(dosage) {
    const url = `${elnEndpointsConfig.endpoints['deleteDosage']}`;
    return this.http.delete<string>(url, { body: dosage });
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
