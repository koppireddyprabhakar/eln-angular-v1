import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.API_BASE_PATH;

  constructor(private http: HttpClient) { }

  // === TOKEN HANDLING ===
  saveTokens(accessToken: string, refreshToken: string): void {
    const tokenWithBearer = accessToken.startsWith('Bearer') ? accessToken : `Bearer ${accessToken}`;
    sessionStorage.setItem('accessToken', tokenWithBearer);
    sessionStorage.setItem('refreshToken', refreshToken);
  }
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  }

  clearTokens(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userDetails');
  }


  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.API_URL}/login/refresh`, { refreshToken }).pipe(
      tap((res: any) => {
        // Ensure accessToken has "Bearer " prefix
        const accessTokenWithPrefix = res.accessToken.startsWith('Bearer')
          ? res.accessToken
          : `Bearer ${res.accessToken}`;

        this.saveTokens(accessTokenWithPrefix, res.refreshToken);
      }),
      catchError(err => {
        this.clearTokens();
        return throwError(() => err);
      })
    );
  }

  // === LOGOUT ===
  logout(): void {
    this.clearTokens();

  }

  // === SESSION CHECK ===
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // === ERROR HANDLER ===
  private handleError(error: HttpErrorResponse) {
    console.error('AuthService error:', error);
    this.clearTokens();
    return throwError(() => error);
  }

}
