import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getTests() {
    const url = elnEndpointsConfig.endpoints['getTests'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveTest(product: { productName: string | null }) {
    const url = elnEndpointsConfig.endpoints['createTest'];
    return this.http.post<string>(url, product);
  }

  updateTest(product: { productName: string | null }) {
    const url = elnEndpointsConfig.endpoints['updateTest'];
    return this.http.put<string>(url, product);
  }

  deleteTest(testId: number) {
    const url = `${elnEndpointsConfig.endpoints['deleteTest']}?testId=${testId}`;
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
