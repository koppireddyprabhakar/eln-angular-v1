import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError, Observable } from 'rxjs';
import { ClientService } from '../client/client.service';

export interface ControlPanelData {
  usersLimit: number;
  numberOfUsers: number;
  licenceStartDate: string;
  licenceExpiryDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class ControlPanelService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) { }

  
  getControlPanel(): Observable<ControlPanelData> {
    const url = elnEndpointsConfig.endpoints['getControlPanel'];
    return this.http.get<ControlPanelData>(url).pipe(catchError(this.handleError));
  }

  saveControlPanel(data: ControlPanelData): Observable<string> {
    const url = elnEndpointsConfig.endpoints['createControlPanel'];
    return this.http.post<string>(url, data).pipe(catchError(this.handleError));
  }
  
  
  updateControlPanel(data: ControlPanelData): Observable<string> {
    const url = elnEndpointsConfig.endpoints['updateControlPanel'];
    return this.http.put<string>(url, data).pipe(catchError(this.handleError));
  }

  getNumberOfUsers(): Observable<number> {
    const url = elnEndpointsConfig.endpoints['getNumberOfUsers'];
    return this.http.get<number>(url).pipe(catchError(this.handleError));
  }

 getUsersLimit(): Observable<number> {
  const url = elnEndpointsConfig.endpoints['getUsersLimit'];
  return this.http.get<number>(url).pipe(catchError(this.handleError));
}

  
  

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }
}
