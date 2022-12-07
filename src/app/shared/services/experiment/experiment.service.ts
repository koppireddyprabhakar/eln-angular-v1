import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class ExperimentService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getExperiments() {
    const url = elnEndpointsConfig.endpoints['getExperiments'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getExperimentById(id) {
    const url = `${elnEndpointsConfig.endpoints['getCreatedExperimentsById']}?experimentId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveExperiment(experiment) {
    const url = elnEndpointsConfig.endpoints['createExperiment'];
    console.log(url);
    console.log(experiment);
    return this.http.post<string>(url, experiment);
  }
  saveExperimentTabs(experiment) {
    const url = elnEndpointsConfig.endpoints['saveExperimentDetails'];
    console.log(url);
    console.log(experiment);
    return this.http.post<string>(url, experiment);
  }
  saveExperimentAttachment(experiment) {
    const url = elnEndpointsConfig.endpoints['saveExperimentAttachment'];
    console.log(url);
    console.log(experiment);
    return this.http.post<string>(url, experiment);
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
