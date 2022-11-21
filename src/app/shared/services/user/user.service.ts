import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getUsers() {
    const url = elnEndpointsConfig.endpoints['getUsers'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveUser(userData) {
    const url = elnEndpointsConfig.endpoints['createUser'];
    return this.http.post<string>(url, userData);
  }

  updateUser(userData) {
    const url = elnEndpointsConfig.endpoints['updateUser'];
    return this.http.put<string>(url, userData);
  }

  getUserById(id) {
    const url = `${elnEndpointsConfig.endpoints['getUserByID']}?userId=${id}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  deleteUser(user) {
    const url = `${elnEndpointsConfig.endpoints['deleteUser']}`;
    return this.http.delete<string>(url, { body: user });
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
