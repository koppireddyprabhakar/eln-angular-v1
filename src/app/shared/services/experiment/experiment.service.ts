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
    console.log(url);
    console.log(experiment);
    return this.http.post<string>(url, experiment);
  }
  saveExcipient(excipient) {
    console.log(excipient);
    const url = elnEndpointsConfig.endpoints['saveExcipient'];
    console.log(url);
    console.log(excipient);
    return this.http.post<string>(url, excipient);
  }

  saveExperimentTabs(experiment) {
    const url = elnEndpointsConfig.endpoints['saveExperimentDetails'];
    console.log(url);
    console.log(experiment);
    return this.http.post<string>(url, experiment);
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
