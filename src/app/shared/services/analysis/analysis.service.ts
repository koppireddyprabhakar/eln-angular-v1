import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  private selectedTrfsSubject = new BehaviorSubject<any>([]);
  selectedTrfs$ = this.selectedTrfsSubject.asObservable();
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getALlAnalysisExperiments() {
    const url = elnEndpointsConfig.endpoints['getAnalysisList'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getAnalysisExperimentById(id) {
    const url = `${
      elnEndpointsConfig.endpoints['getAnalysisListByTeamId']
    }?teamId=${10}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  syncTrf(trfs) {
    console.log(trfs);
    this.selectedTrfsSubject.next(trfs);
  }

  getAnalysisById(id) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisById']}?analysisId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveAnalysisDetails(experiment) {
    const url = elnEndpointsConfig.endpoints['saveAnalysisDetails'];
    console.log(url);
    console.log(experiment);
    return this.http.post<any>(url, experiment);
  }

  saveAnalysisExcipient(excipient) {
    console.log(excipient);
    const url = elnEndpointsConfig.endpoints['saveAnalysisExcipient'];
    console.log(url);
    console.log(excipient);
    return this.http.post<any>(url, excipient);
  }

  getAttachmentsById(id) {
    const url = `${elnEndpointsConfig.endpoints['searchAnalysisAttachments']}?experimentId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveAnalysisAttachment(file, experimentId, projectId): Observable<any> {
    const url = elnEndpointsConfig.endpoints['saveAnalysisAttachments'];
    console.log(typeof experimentId);
    const formData = new FormData();
    formData.append('experimentId', experimentId.toString());
    formData.append('projectId', projectId.toString());
    formData.append('status', 'ACTIVE');
    formData.append('file', file, file.name);

    return this.http.post<string>(url, formData);
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

  saveExperimentTabs(experiment) {
    const url = elnEndpointsConfig.endpoints['saveExperimentDetails'];
    console.log(url);
    console.log(experiment);
    return this.http.post<any>(url, experiment);
  }

  updateExperimentTabs(experiment) {
    const url = elnEndpointsConfig.endpoints['updateExperimentDetails'];
    console.log(url);
    console.log(experiment);
    return this.http.put<any>(url, experiment);
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
