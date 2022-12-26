import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class FormulationsService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getProjectsTeamsId() {
    const url = elnEndpointsConfig.endpoints['getFormulationProjectsTeamsId'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getFormulationBatchNumber() {
    const url = elnEndpointsConfig.endpoints['getFormulationBatchNumber'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getExperimentsByUserId() {
    const url = elnEndpointsConfig.endpoints['getExperimentsById'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getExperimentsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getFormulationsExperimentById']}?experimentId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
