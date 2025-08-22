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
  ) { }

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

  getExcipientDetailsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getExcipientDetailsById']}?experimentId=${id}`;
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

  updateExperiment(experiment) {
    const url = elnEndpointsConfig.endpoints['updateExperiment'];
    return this.http.put<string>(url, experiment);
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

  saveExperimentAttachment(file, experimentId, projectId, fromSummary): Observable<any> {
    const url = elnEndpointsConfig.endpoints['saveExperimentAttachment'];

    const formData = new FormData();
    formData.append('experimentId', experimentId);
    formData.append('projectId', projectId);
    formData.append('status', 'ACTIVE');
    formData.append('file', file, file.name);
    if (fromSummary) {
    formData.append('fromSummary', fromSummary);  // optional
  }
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

  updateExperimentStatus(experimentId, status) {
    const url = elnEndpointsConfig.endpoints['updateExperimentStatus'];
    return this.http.put<string>(url, {}, { params: { experimentId: experimentId, status: status } });
  }

  getExperimentsByStatus(status: string) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentsByStatus']}?status=${status}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getExperimentsByReviewerAndStatus(userId: number, status: string) {
  const url = `${elnEndpointsConfig.endpoints['getExperimentsByReviewerAndStatus']}?reviewUserId=${userId}&status=${status}`;
  return this.http
    .get<any>(url)
    .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
}


  createExperimentReview(experimentReview: any) {
    const url = `${elnEndpointsConfig.endpoints['createExperimentReview']}`
    return this.http.post<string>(url, experimentReview);
  }

  updateExperimentReview(experimentReview: any) {
    const url = `${elnEndpointsConfig.endpoints['updateExperimentReview']}`
    return this.http.put<string>(url, experimentReview);
  }

  getExperimentReviewByExperimentId(experimentId) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentReviewByExperimentId']
      }?experimentId=${experimentId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getExperimentsByProjectId(projectId) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentsByProjectId']
      }?projectId=${projectId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getAnalysisDetailHistoryByExperimentId(experimentId) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisDetailHistoryByExperimentId']
      }?experimentId=${experimentId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getAnalysisHistoryByProjectId(projectId) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisHistoryByProjectId']
      }?projectId=${projectId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveCoaReviewDetails(coareviewdetails: any) {
    const url = elnEndpointsConfig.endpoints['saveCoaReviewDetails'];
    return this.http.post<any>(url, coareviewdetails);
  }
  getCoaUserDetailsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getCoaUserDetailsById']}?experimentId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getCoaUserDetailsByAnalysisId(id) {
    const url = `${elnEndpointsConfig.endpoints['getCoaUserDetailsByAnalysisId']}?analysisId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  updateFormulationCoaReviewDetails(coareviewdetails) {
    const url = elnEndpointsConfig.endpoints['UpdateFormulationcoareview'];
    return this.http.put<string>(url, coareviewdetails);
  }

  updateAnalysisCoaReviewDetails(coareviewdetails) {
    const url = elnEndpointsConfig.endpoints['UpdateAnalysisCoareview'];
    return this.http.put<string>(url, coareviewdetails);
  }
  updateAnalysisCoaAprovalDetails(coareviewdetails) {
    const url = elnEndpointsConfig.endpoints['UpdateAnalysisCoaApproval'];
    return this.http.put<string>(url, coareviewdetails);
  }
  updateformulationCoaAprovalDetails(coareviewdetails) {
    const url = elnEndpointsConfig.endpoints['UpdateformulationcoaApproval'];
    return this.http.put<string>(url, coareviewdetails);
  }
  getAnalysisExperimentsById(id) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisExperimentsForCoaDetails']}?analysisId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }
  downloadCoaPdf(experimentId: number): Observable<Blob> {
    const url = `${elnEndpointsConfig.endpoints['downloadCoaPdf']
      }?experimentId=${experimentId}`;

    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  getExperimentHistory(projectId) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentHistory']
      }?projectId=${projectId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

 getAnalysisExperimentsByExperimentId(experimentId) {
    const url = `${elnEndpointsConfig.endpoints['getAnalysisExperimentsByExperimentId']
      }?experimentId=${experimentId}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }
  getExperimentHistoryById(id) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentHistoryById']}?experimentHistoryId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getExperimentDetailsHistoryById(id) {
    const url = `${elnEndpointsConfig.endpoints['getExperimentDetailsHistoryById']}?experimentDetailsHistoryId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }


  getExcipientHistoryByExperimentId(id) {
    const url = `${elnEndpointsConfig.endpoints['getExcipientHistoryByExperimentId']}?experimentHistoryId=${id}`;
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
