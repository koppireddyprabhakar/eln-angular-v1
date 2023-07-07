import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService) { }

    getProjectsByMonth() {
      const url = elnEndpointsConfig.endpoints['getProjectByMonths'];
      return this.http
        .get<any>(url)
        .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    }
    getExperimentsByMonth() {
      const url = elnEndpointsConfig.endpoints['getExperimentsByMonths'];
      return this.http
        .get<any>(url)
        .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    }

    getExperimentStatusByMonth() {
      const url = elnEndpointsConfig.endpoints['getExperimentStatusByMonths'];
      return this.http
        .get<any>(url)
        .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    }

    getTrfStatusByMonth() {
      const url = elnEndpointsConfig.endpoints['getTrfStatusByMonths'];
      return this.http
        .get<any>(url)
        .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
    }

    getAnalysisexperimentByMonth() {
      const url = elnEndpointsConfig.endpoints['getAnalysisExperimentByMonths'];
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
