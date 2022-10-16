import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { elnEndpointsConfig } from '@config/endpoints/eln.endpoints.config';
import { ClientService } from '../client/client.service';

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
    return this.http.post<string>(url, product);
  }

  deleteProduct(productId: number) {
    const url = `${elnEndpointsConfig.endpoints['deleteProduct']}?productId=${productId}`;
    return this.http.get<string>(url);
  }

  handleError(error: HttpErrorResponse) {
    const errorDetail = ClientService.formatError(error);
    if (errorDetail && (errorDetail.title || errorDetail.errorMessage)) {
      // show toast
    }
    return throwError(error);
  }
}
