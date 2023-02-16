import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientService } from '@app/shared/services/client/client.service';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private readonly http: HttpClient,
    private readonly clientService: ClientService
  ) {}

  getProducts() {
    const url = elnEndpointsConfig.endpoints['getProducts'];
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => this.handleError(err)));
  }

  saveProduct(product: { productName: string | null }) {
    const url = elnEndpointsConfig.endpoints['postProduct'];
    return this.http.post<string>(url, product);
  }

  updateProduct(product: { productName: string | null }) {
    const url = elnEndpointsConfig.endpoints['updateProduct'];
    return this.http.put<string>(url, product);
  }

  deleteProduct(product) {
    debugger
    const url = `${elnEndpointsConfig.endpoints['deleteProduct']}`;
    return this.http.delete<string>(url, { body: product });
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
