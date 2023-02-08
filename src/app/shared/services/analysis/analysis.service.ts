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
  ) { }

  getALlAnalysisExperiments() {
    const url = elnEndpointsConfig.endpoints['getAnalysisList'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getAnalysisExperimentById(id) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisListByTeamId']
      }?teamId=${10}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getAnalysisByStatus(status: String) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisByStatus']
      }?status=${status}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  syncTrf(trfs) {
    this.selectedTrfsSubject.next(trfs);
  }

  getAnalysisById(id) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisById']}?analysisId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getAnalysisDeatilsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisDetailsById']}?analysisDetailsId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getExcipientDetailsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getExcipientAnalysisDetailsById']}?analysisId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getTrfDetailsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getTrfResultsById']}?analysisId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getResultsDetailsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getResultsDTById']}?analysisId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveAnalysisDetails(experiment) {
    const url = elnEndpointsConfig.endpoints['saveAnalysisDetails'];
    return this.http.post<any>(url, experiment);
  }

  saveTrfResults(experiment) {
    const url = `${elnEndpointsConfig.endpoints['updateTestRequestFormResult']}`;
    return this.http.put<any>(url, experiment);
  }

  createTestForm(experiment) {
    const url = elnEndpointsConfig.endpoints['createAnalysisTestRequestForm'];
    return this.http.post<any>(url, experiment);
  }

  updateTestForm(experiment) {
    const url = elnEndpointsConfig.endpoints['updateAnalysisTestRequestForm'];
    return this.http.put<any>(url, experiment);
  }

  getTestFormResults(id) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisTestRequestForms']}?analysisId=${id}`;
    return this.http.get<any>(url);
  }

  saveAnalysisExcipient(excipient) {
    const url = elnEndpointsConfig.endpoints['saveAnalysisExcipient'];
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
    return this.http.post<string>(url, experiment);
  }

  saveAnalysis(experiment) {
    const url = elnEndpointsConfig.endpoints['createAnalysis'];
    return this.http.post<string>(url, experiment);
  }

  saveExperimentTabs(experiment) {
    const url = elnEndpointsConfig.endpoints['saveExperimentDetails'];
    return this.http.post<any>(url, experiment);
  }

  updateExperimentTabs(experiment) {
    const url = elnEndpointsConfig.endpoints['updateExperimentDetails'];
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

  updateAnalysisStatus(analysisReqeust: any) {
    const url = elnEndpointsConfig.endpoints['updateAnalysisStatus'];
    // return this.http.put<string>(url, {}, { params: { analysisId: analysisId, status: status } });
    return this.http.put<string>(url, analysisReqeust);
  }

  createAnalysisReview(analysisReqeust: any) {
    const url = `${elnEndpointsConfig.endpoints['createAnalysisReview']}`
    return this.http.post<string>(url, analysisReqeust);
  }

  updateAnalysisReview(analysisReqeust: any) {
    const url = `${elnEndpointsConfig.endpoints['updateAnalysisReview']}`
    return this.http.put<string>(url, analysisReqeust);
  }

  getAnalysisReview(analysisId) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisReview']
      }?analysisId=${analysisId}`;
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
