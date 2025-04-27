import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, map, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) { }

  getProjects() {
    const url = elnEndpointsConfig.endpoints['getProjects'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getProjectsTeams() {
    const url = elnEndpointsConfig.endpoints['getProjectsTeams'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  getProjectById(projectID) {
    const url = `${elnEndpointsConfig.endpoints['getProjectById']}?projectId=${projectID}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveProject(project) {
    const url = elnEndpointsConfig.endpoints['createProject'];
    return this.http.post<string>(url, project);
  }

  updateProject(project: { productName: string | null }) {
    const url = elnEndpointsConfig.endpoints['updateProject'];
    return this.http.put<string>(url, project);
  }

  deleteProject(project) {
    const url = `${elnEndpointsConfig.endpoints['deleteProject']}`;
    return this.http.delete<string>(url, { body: project });
  }

  onHoldproject(project) {
    const url = `${elnEndpointsConfig.endpoints['onHoldProject']}`;
    return this.http.put<string>(url, project);
  }

  generateProjectPdf(projectId) {
    const url = `${elnEndpointsConfig.endpoints['generateProjectPdf']}?projectId=${projectId}`;

    let headerOptions = new HttpHeaders();
    headerOptions = headerOptions.set('Accept', 'application/pdf');

    const requestOptions = {
      headers: headerOptions,
      responseType: 'blob' as 'blob'
    };

    return this.http.get(url, requestOptions).pipe(
      map((data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = "PROJECT_DETAILS_" + projectId + ".pdf";//'your_pdf_filename.pdf';
        a.click();
        URL.revokeObjectURL(objectUrl);
        return blob;
      })
    );


  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
