import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class TrfService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  createTestRequestForm(requestBody) {
    const url = elnEndpointsConfig.endpoints['createTestRequestForm'];
    return this.http.post<string>(url, requestBody);
  }

  updateTestRequestForm(requestBody) {
    const url = elnEndpointsConfig.endpoints['updateTestRequestForm'];
    return this.http.post<string>(url, requestBody);
  }

  getTestRequestForms() {
    const url = elnEndpointsConfig.endpoints['getTestRequestForm'];
    return this.http.get(url);
  }
}
