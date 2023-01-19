import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, Observable, throwError } from 'rxjs';
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

  getExperimentDetailsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentDetailsById']}?experimentDetailsId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }
  getIndvExperimentById(id) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentById']}?experimentId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }
  getAttachmentsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentAttachmentById']}?experimentId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }
  deleteExperimentAttachment(file) {
    const url = `${elnEndpointsConfig.endpoints['deleteExperimentAttachment']}`;
    return this.http
      .delete<any>(url, { body: file })
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveExperiment(experiment) {
    const url = elnEndpointsConfig.endpoints['createExperiment'];
    return this.http.post<string>(url, experiment);
  }
  saveExcipient(excipient) {
    const url = elnEndpointsConfig.endpoints['saveExcipient'];
    return this.http.post<any>(url, excipient);
  }

  updateExcipient(excipient) {
    const url = elnEndpointsConfig.endpoints['updateExcipient'];
    return this.http.put<any>(url, excipient);
  }

  saveExperimentTabs(experiment) {
    const url = elnEndpointsConfig.endpoints['saveExperimentDetails'];
    return this.http.post<any>(url, experiment);
  }

  updateExperimentTabs(experiment) {
    const url = elnEndpointsConfig.endpoints['updateExperimentDetails'];
    return this.http.put<any>(url, experiment);
  }

  saveExperimentAttachment(file, experimentId, projectId): Observable<any> {
    const url = elnEndpointsConfig.endpoints['saveExperimentAttachment'];

    const formData = new FormData();
    formData.append('experimentId', experimentId);
    formData.append('projectId', projectId);
    formData.append('status', 'ACTIVE');
    formData.append('file', file, file.name);

    return this.http.post<string>(url, formData);
  }

  getExperimentAttachmentContent(
    fileName,
    experimentId,
    projectId
  ): Observable<any> {
    const url =
      elnEndpointsConfig.endpoints['getExperimentAttachmentContent'] +
      '/' +
      fileName +
      '/' +
      experimentId +
      '/' +
      projectId;

    return this.http
      .get(url, { responseType: 'blob' })
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  createTrf(data) {
    const url = elnEndpointsConfig.endpoints['saveTrf'];
    return this.http.post<string>(url, data);
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
