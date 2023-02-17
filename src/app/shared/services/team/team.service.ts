import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeamsList } from '@app/business-admin/team/team.interface';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getTeams() {
    const url = elnEndpointsConfig.endpoints['getTeams'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveTeam(product: { teamName: string | null }) {
    const url = elnEndpointsConfig.endpoints['createTeam'];
    return this.http.post<string>(url, product);
  }

  updateTeam(product: { teamName: string | null }) {
    const url = elnEndpointsConfig.endpoints['updateTeam'];
    return this.http.put<string>(url, product);
  }

  deleteTeam(team) {
    debugger
    const url = `${elnEndpointsConfig.endpoints['deleteTeam']}`;
    return this.http.delete<string>(url, { body: team });
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
